import { useParams } from 'react-router'
import { useNavigate } from '../../hooks/navigate'
import NotesList from '../../components/NotesList'
import { useAllItemsOfType, useItem, useRelations } from '../../hooks/data'
import MainLayout from '../MainLayout'
import { useMemo } from 'react'
import { Button, Center } from '@mantine/core'
import { NotesManager } from '../../lib/notes'
import { notifications } from '@mantine/notifications'

export function AddPage() {
  const { id, type } = useParams()
  const item = useItem(id)
  const items = useAllItemsOfType(type)
  const relations = useRelations(item)
  const filteredItems = useMemo(() =>
    items.filter(item => item.id !== id && !relations.includes(item.id)),
    [id, items, relations]
  )
  const typeDescr = useMemo(() => type && NotesManager.getTypeDescription(type)||undefined, [type])
  const navigate = useNavigate()

  function getAddRelationHandler(relatedId: string) {
    return function () {
      if (!id || !item) return
      NotesManager.db.addRelation(id, relatedId)
        .then(id => {
          if (id) {
            notifications.show({title: "Verknüpft", message: "Verknüpfung wurde hergestellt."})
          }
          else {
            notifications.show({title: "Bereits verknüpft", message: "Die Verbindung existiert bereits."})
          }
        })
        .catch(err => {
          console.error(err)
          notifications.show({title: "Fehler", message: "Beim erstellen der Verknüpfung ist ein Fehler aufgetreten."})

        })
        navigate(-1)
    }
  }

  return (
    <MainLayout showFloatingButtons={false}>
      <Center mb="md">
        <Button onClick={() => navigate(`/create/${type}?parent=${id}`)} leftSection={typeDescr && <typeDescr.icon />}>Neue {typeDescr?.text} Notiz</Button>
      </Center>
      <NotesList notes={ filteredItems }>
        {(id) => <Button size="compact-sm" onClick={getAddRelationHandler(id)}>Verknüpfen</Button>}
      </NotesList>
    </MainLayout>
  )
}
