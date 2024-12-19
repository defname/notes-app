
import { useNavigate, useParams, useSearchParams } from 'react-router'
import MainLayout from '../MainLayout'
import { useEffect, useState } from 'react'
import { ItemType } from '../../lib/notes'
import Notes from '../../lib/notes'
import SaveButton from '../../components/SaveButton'
import db from '../../lib/db'
import { notifications } from '@mantine/notifications'
import { Affix } from '@mantine/core'
import { useItemIsValid } from '../../hooks/data'



export function CreatePage() {

  const [ item, setItem ] = useState<ItemType<any>|undefined>()
  const { type } = useParams()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const parentId = searchParams.get("parent")
  const itemIsValid = useItemIsValid(item)

  useEffect(() => {
    if (type === undefined) return
    const typeDescr = Notes.getTypeDescription(type)
    if (typeDescr === undefined) return
    setItem({ type: type, content: typeDescr.defaultContent })
  }, [type])

  async function saveItemToDb() {
    if (!item) return
    if (!await Notes.validateContent(item)) {
      notifications.show({
        title: "Fehler",
        message: "Die Angaben haben nicht das benötigte Format"
      })
      return
    }
    db.items.add(item)
      .then(id => {
        if (parentId !== null) {
          db.relations.add({item1: id, item2: parentId})
            .then(() => navigate(`/item/${id}`))
        }
        else {
          navigate(`/item/${id}`)
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
      <Notes.RenderEditor item={ item } onChange={(item: ItemType<any>) => item && setItem(item)}/>
      <Affix hidden={ !itemIsValid } position={{ bottom: 20, right: 20 }}>
        <SaveButton onClick={ saveItemToDb }>Speichern</SaveButton>
      </Affix>
    </MainLayout>
  )
}
