import { ActionIcon, Button, Center, Paper } from "@mantine/core"
import Note, { NotesManager } from "../lib/notes"
import { DBItem } from "../lib/db"
import { useEffect, useState } from "react"
import { IconX } from "@tabler/icons-react"
import { notifications } from "@mantine/notifications"
import { useGraph } from "../hooks/graph"
import NotesTree from "./NotesTree"
import { FilterOpts, useFilter } from "../hooks/filter"
import SearchField from "./SearchField"
import { useNavigate } from "react-router"

interface NotesListProps {
    parentId: string|undefined
    children?: (id: string) => JSX.Element
}

export default function RelatedNotesList({ parentId, children }: NotesListProps) {
    const [maxDistance, setMaxDistance] = useState<number>(1)
    const [filterOpts, setFilterOpts] = useState<FilterOpts>({ searchStr: "", filterTypes: [] })
    const [notes, setNotes] = useState<DBItem[]>([])
    const filteredNotes = useFilter(notes, filterOpts)
    const navigate = useNavigate()

    const [root, asList] = useGraph(parentId)

    useEffect(() => {
        setNotes(asList().filter(node => node.distance! <= maxDistance).map(node => node.item))
    }, [root, maxDistance])

    function getRemoveRelationHandler(id: string) {
        if (!parentId) return () => undefined
        return function () {
            console.log("Remove relation", id, parentId)
            NotesManager.db.deleteRelation(parentId, id)
                .then(() => notifications.show({ title: "Gelöscht", message: "Verknüpfung wurde gelöscht" }))
                .catch(err => {
                    console.warn(err)
                    notifications.show({ title: "Fehler", message: "Verknüpfung konnte nicht gelöscht werden" })
                })
        }
    }

    return (<>
    <NotesTree root={ root } />
    <SearchField value={filterOpts} onChange={setFilterOpts} maxDistance={maxDistance} onMaxDistanceChange={setMaxDistance} />
    {
        filteredNotes.map(note => {
            return (
                <Paper key={note.id} p="lg" my="lg" shadow="md" radius="md" className="notes-list-item">
                    { parentId &&
                        <ActionIcon onClick={ getRemoveRelationHandler(note.id) }style={{ float: "right"}}variant="transparent" size="sm" radius="xl">
                            <IconX style={{ width: '70%', height: '70%' }} stroke={1.5} />
                        </ActionIcon>
                    }
                    <Note.Small item={ note } />
                    <Center mt="md">
                        { children 
                            ? children(note.id)
                            : <Button size="compact-sm" onClick={() => navigate(`/item/${note.id}`)}>Zur Notiz</Button>
                        }
                    </Center>
                </Paper>
            )
        })
    }
    </>)
}