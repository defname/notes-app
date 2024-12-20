
import { useNavigate, useParams, useSearchParams } from 'react-router'
import MainLayout from '../MainLayout'
import { useEffect, useState } from 'react'
import { ItemType } from '../../lib/notes'
import Notes from '../../lib/notes'
import SaveButton from '../../components/SaveButton'
import db, { DBItem } from '../../lib/db'
import { notifications } from '@mantine/notifications'
import { Affix } from '@mantine/core'
import { useItemIsValid } from '../../hooks/data'


async function checkForRelation(id1: string, id2: string): Promise<string|undefined> {
  return db.relations.where("[item1+item2]").anyOf([[id1, id2], [id2, id1]]).toArray()
    .then(relations => relations.length === 0 ? undefined : relations[0].id)
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

  async function saveItemToDb() {
    if (!newItem) return

    /* validate the new item
     * the plugin's RenderEditor method is in charge of showing hints what exactly
     * is not ok */
    if (!await Notes.validateContent(newItem)) {
      notifications.show({
        title: "Fehler",
        message: "Die Angaben haben nicht das benötigte Format"
      })
      return
    }

    /* Check if the returned item already exists (in this case it has an id) and if so
     * just create a relation between the parent item and the returned item */
    if (Object.hasOwn(newItem, "id") && (newItem as DBItem).id! !== undefined && parentId !== null) {
      const existingItemId = (newItem as DBItem).id
      if (await checkForRelation(parentId, existingItemId)) {
        notifications.show({
          title: "Hinweis",
          message: "Die Verbindung existiert bereits."
        })
        navigate(`/item/${existingItemId}`)
        return
      }
      db.relations.add({item1: existingItemId, item2: parentId})
            .then(() => navigate(`/item/${existingItemId}`))
            .catch(reason => {
              notifications.show({
                title: "Fehler",
                message: reason
              })
            })
      return
    }

    /* If the item is actually a new one add it to the database and create a relation
     * to the parent item, if a parent item is specified */
    db.items.add(newItem)
      .then(newId => {
        if (parentId !== null) {
          db.relations.add({item1: newId, item2: parentId})
            .then(() => navigate(`/item/${newId}`))
        }
        else {
          navigate(`/item/${newId}`)
        }
      })
      .catch(reason => {
        notifications.show({
          title: "Fehler",
          message: reason
        })
      })
  }


  return (
    <MainLayout showAddItemMenu={false}>
      <Notes.RenderEditor item={ newItem } onChange={(item: ItemType<any>) => item && setNewItem(item)} create />
      <Affix hidden={ !itemIsValid } position={{ bottom: 20, right: 20 }}>
        <SaveButton onClick={ saveItemToDb }>Speichern</SaveButton>
      </Affix>
    </MainLayout>
  )
}
