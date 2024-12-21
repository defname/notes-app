import { ActionIcon, Container, Group, Paper, TextInput } from "@mantine/core"
import { Link } from "react-router"
import Notes from "../lib/notes"
import db, { DBItem } from "../lib/db"
import { useEffect, useState } from "react"
import { IconX } from "@tabler/icons-react"
import { notifications } from "@mantine/notifications"
import { Node, useGraph } from "../hooks/graph"
import NotesTree from "./NotesTree"
import { useSearch } from "../hooks/filter"

interface NotesListProps {
    parentId?: string
}


export default function RelatedNotesList({ parentId }: NotesListProps) {
    const [searchStr, setSearchStr] = useState("")
    const [notes, setNotes] = useState<DBItem[]>([])
    const filteredNotes = useSearch(notes, searchStr)

    const [root, asList] = useGraph(parentId)

    useEffect(() => {
        setNotes(asList().map(node => node.item))
    }, [root])

    function getRemoveRelationHandler(id: string) {
        if (!parentId) return () => undefined
        return function () {
            console.log("Remove relation", id, parentId)
            db.relations.where("[item1+item2]").anyOf([[id, parentId], [parentId, id]]).delete()
                .then(() => notifications.show({ title: "Gelöscht", message: "Verknüpfung wurde gelöscht" }))
                .catch(err => {
                    console.warn(err)
                    notifications.show({ title: "Fehler", message: "Verknüpfung konnte nicht gelöscht werden" })
                })
        }
    }

    return (<>
    <TextInput value={ searchStr } onChange={ev => setSearchStr(ev.target.value)} />
    <NotesTree root={ root } />
    {
        filteredNotes.map(note => {
            return (
                <Paper key={note.id} p="lg" my="lg" shadow="md" radius="md" className="notes-list-item">
                    { parentId &&
                        <ActionIcon onClick={ getRemoveRelationHandler(note.id) }style={{ float: "right"}}variant="transparent" size="sm" radius="xl">
                            <IconX style={{ width: '70%', height: '70%' }} stroke={1.5} />
                        </ActionIcon>
                    }
                    <Notes.RenderSmall item={ note } />
                    <Link to={{pathname: `/item/${note.id}`}}>Zur Notiz</Link>
                </Paper>
            )
        })
    }
    </>)
}