import { Paper } from "@mantine/core"
import { Link } from "react-router"
import Note from "../lib/notes"
import { DBItem } from "../lib/db"
import { useState } from "react"
import { FilterOpts, useFilter } from "../hooks/filter"
import SearchField from "./SearchField"


interface NotesListProps {
    notes: DBItem[]
}


export default function NotesList({ notes }: NotesListProps) {
    const [filterOpts, setFilterOpts] = useState<FilterOpts>({ searchStr: "", filterTypes: [] })
    const filteredNotes = useFilter(notes, filterOpts)

    return (<>
    <SearchField value={filterOpts} onChange={setFilterOpts} />
    {
        filteredNotes.map(note => {
            return (
                <Paper key={note.id} p="lg" my="lg" shadow="md" radius="md" className="notes-list-item">
                    <Note.Small item={ note } />
                    <Link to={{pathname: `/item/${note.id}`}}>Zur Notiz</Link>
                </Paper>
            )
        })
    }
    </>)
}