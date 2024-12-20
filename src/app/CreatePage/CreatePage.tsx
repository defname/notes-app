
import { useNavigate, useParams, useSearchParams } from 'react-router'
import MainLayout from '../MainLayout'
import { useEffect, useState } from 'react'
import { ItemType } from '../../lib/notes'
import Notes from '../../lib/notes'
import SaveButton from '../../components/SaveButton'
import db, { DBItem } from '../../lib/db'
import { notifications } from '@mantine/notifications'
import { useItemIsValid } from '../../hooks/data'


async function checkForRelation(id1: string, id2: string): Promise<string|undefined> {
  return db.relations.where("[item1+item2]").anyOf([[id1, id2], [id2, id1]]).toArray()
    .then(relations => relations.length === 0 ? undefined : relations[0].id)
}

async function saveItemToDb(newItem: ItemType<any>|undefined, parentId: string|null, notify: (msg: string) => void): Promise<string>  {
  if (!newItem) throw "Kein Item zum Speichern vorhanden."

  /* validate the new item
   * the plugin's RenderEditor method is in charge of showing hints what exactly
   * is not ok */
  if (!await Notes.validateContent(newItem)) {
    throw "Die Angaben sind nicht vollständig oder nicht korrekt."
  }


  /* Check if the returned item already exists (in this case it has an id) and if so
   * just create a relation between the parent item and the returned item */
  if (Object.hasOwn(newItem, "id") && (newItem as DBItem).id! !== undefined) {
    console.log("Item already exists")
    if (parentId === null) {
      throw "Die Notiz existiert bereits."
    }

    if (parentId === (newItem as DBItem).id) {
      throw "Eine Notiz kann nicht mit sich selbst verknüpft werden."
    }
    const existingItemId = (newItem as DBItem).id
    if (await checkForRelation(parentId, existingItemId)) {
      notify("Die Verbindung existiert bereits.")
      return existingItemId
    }
    return db.relations.add({item1: existingItemId, item2: parentId})
          .then(() => existingItemId)
  }

  /* If the item is actually a new one add it to the database and create a relation
   * to the parent item, if a parent item is specified */
  return db.items.add(newItem)
    .then(newId => {
      if (parentId !== null) {
        return db.relations.add({item1: newId, item2: parentId})
          .then(() => newId)
      }
      else {
        return newId
      }
    })
}

export function CreatePage() {

  const [ newItem, setNewItem ] = useState<DBItem|ItemType<any>|undefined>()
  const { type } = useParams()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const parentId = searchParams.get("parent")
  const itemIsValid = useItemIsValid(newItem)

  useEffect(() => {
    if (type === undefined) return
    const typeDescr = Notes.getTypeDescription(type)
    if (typeDescr === undefined) return
    setNewItem({ type: type, content: typeDescr.defaultContent })
  }, [type])

  function saveButtonHandler() {
    if (newItem === undefined) return
    const result = saveItemToDb(
      newItem,
      parentId,
      (msg: string) => notifications.show({ title: "Hinweis", message: msg })
    )
    
    result.then(newId => navigate(`/item/${newId}`))
    .catch(err => {
      console.warn(err)
      notifications.show({ title: "Fehler", message: err })
      }
    )
  }

  return (
    <MainLayout showFloatingButtons={false}>
      <Notes.RenderEditor item={ newItem } onChange={(item: ItemType<any>) => item && setNewItem(item)} parentId={parentId} create />
      <SaveButton onClick={ saveButtonHandler } hidden={ !itemIsValid } />
    </MainLayout>
  )
}
