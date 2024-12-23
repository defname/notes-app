
import { useNavigate, useParams, useSearchParams } from 'react-router'
import MainLayout from '../MainLayout'
import { useEffect, useState } from 'react'
import Note, { ItemType } from '../../lib/notes'
import { NotesManager } from '../../lib/notes'
import SaveButton from '../../components/SaveButton'
import { DBItem } from '../../lib/db'
import { notifications } from '@mantine/notifications'
import { useItemIsValid } from '../../hooks/data'


export function CreatePage() {

  const [ newItem, setNewItem ] = useState<DBItem|ItemType<any>|undefined>()
  const { type } = useParams()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const parentId = searchParams.get("parent")
  const itemIsValid = useItemIsValid(newItem)

  useEffect(() => {
    if (type === undefined) return
    const typeDescr = NotesManager.getTypeDescription(type)
    if (typeDescr === undefined) return
    const defItem = NotesManager.getDefaultItem(type)
    if (defItem) {
      setNewItem(defItem)
    }
  }, [type])

  function saveButtonHandler() {
    if (newItem === undefined) return
    const result = NotesManager.db.saveItem(newItem, parentId)

    result.then(result => {
      if (Object.hasOwn(newItem, "id") && result[0] === (newItem as DBItem).id && !result[1]) {
        notifications.show({ title: "Hinweis", message: "Die Verbindung existiert bereits."})
      }
      navigate(`/item/${result[0]}`)
    })
    .catch(err => {
      console.warn(err)
      notifications.show({ title: "Fehler", message: err })
      }
    )
  }

  return (
    <MainLayout showFloatingButtons={false}>
      <Note.Editor item={ newItem } onChange={(item: ItemType<any>) => item && setNewItem(item)} parentId={parentId} create />
      <SaveButton onClick={ saveButtonHandler } hidden={ !itemIsValid } />
    </MainLayout>
  )
}
