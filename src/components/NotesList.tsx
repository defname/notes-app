import { Button, Center, Paper } from "@mantine/core"
import { useNavigate } from "../hooks/navigate"
import Note from "../lib/notes"
import { DBItem } from "../lib/db"
import { useMemo, useState } from "react"
import { FilterOpts, useFilter } from "../hooks/filter"
import SearchField from "./SearchField"


interface NotesListProps {
    notes: DBItem[]
    max?: number
    increaseBy?: number
    children?: (id: string ) => JSX.Element
}


export default function NotesList({ notes, max = 20, increaseBy = 5, children }: NotesListProps) {
    const [filterOpts, setFilterOpts] = useState<FilterOpts>({ searchStr: "", filterTypes: [] })
    const filteredNotes = useFilter(notes, filterOpts)
    const [displayCount, setDisplayCount] = useState(max)
    const limitedNotes = useMemo(() => filteredNotes.slice(0, displayCount), [displayCount, filteredNotes])
    const navigate = useNavigate()

    function showMore() {
        setDisplayCount(count => count < filteredNotes.length ? count + increaseBy : count)
    }

    return (<>
    <SearchField value={filterOpts} onChange={setFilterOpts} />
    {
        limitedNotes.map(note => {
            return (
                <Paper key={note.id} p="lg" my="lg" shadow="md" radius="md" className="notes-list-item">
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
    { displayCount < filteredNotes.length &&
        <Center><Button onClick={showMore}>Mehr anzeigen</Button></Center>
    }
    </>)
}