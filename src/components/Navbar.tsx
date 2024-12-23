import { AppShell, Card, Group, ScrollAreaAutosize, Stack, Title } from "@mantine/core"
import Note, { NotesManager } from "../lib/notes"
import { TypeDescription } from "../lib/notes/notesmanager"
import { useAllItemsOfType } from "../hooks/data"
import { Link, useParams } from "react-router"

function NavbarSection({type}: {type: TypeDescription<any>}) {
    const { id } = useParams()
    const items = useAllItemsOfType(type.id)

    return (<AppShell.Section my="lg">
        <Card shadow="xs" padding="md" radius="md">
            <Stack>
            <Title order={4}><Group><type.icon /> {type.text}</Group></Title>
            { 
                items.map(item => <Link key={item.id} to={`/item/${item.id}`} className={`navbarlink ${item.id === id ? "selected" : ""}`}><Note.Text item={item} /></Link>)
            }
            </Stack>
        </Card>
    </AppShell.Section>)
}

export default function Navbar() {
    const types = NotesManager.supportedTypes()

    return (<>
    <ScrollAreaAutosize>
        {
            types.map(type => <NavbarSection key={type.id} type={type} />)
        }
    </ScrollAreaAutosize></>)

}