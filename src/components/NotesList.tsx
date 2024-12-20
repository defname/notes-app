import { Paper, TextInput } from "@mantine/core"
import { Link } from "react-router"
import Notes from "../lib/notes"
import { DBItem } from "../lib/db"
import { useState } from "react"
import { useFilter } from "../hooks/data"

interface NotesListProps {
    notes: DBItem[]
}

export default function NotesList({ notes }: NotesListProps) {
    const [searchStr, setSearchStr] = useState("")
    const filteredNotes = useFilter(notes, searchStr)

    return (<>
    <TextInput value={ searchStr } onChange={ev => setSearchStr(ev.target.value)} />
    {
        filteredNotes.map(note => {
            return (
                <Paper key={note.id} p="lg" my="lg" shadow="md" radius="md" className="notes-list-item">
                    <Notes.RenderInline item={ note } />
                    <Link to={{pathname: `/item/${note.id}`}}>Zur Notiz</Link>
                </Paper>
            )
        })
    }
    </>)
}