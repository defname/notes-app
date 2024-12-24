import { Button, Center, Container, Paper } from "@mantine/core"
import { useNavigate } from "react-router"
import Note from "../lib/notes"
import { DBItem } from "../lib/db"
import { useState } from "react"
import { FilterOpts, useFilter } from "../hooks/filter"
import SearchField from "./SearchField"


interface NotesListProps {
    notes: DBItem[]
    children?: (id: string ) => JSX.Element
}


export default function NotesList({ notes, children }: NotesListProps) {
    const [filterOpts, setFilterOpts] = useState<FilterOpts>({ searchStr: "", filterTypes: [] })
    const filteredNotes = useFilter(notes, filterOpts)
    const navigate = useNavigate()

    return (<>
    <SearchField value={filterOpts} onChange={setFilterOpts} />
    {
        filteredNotes.map(note => {
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
    </>)
}