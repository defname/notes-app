import { Card, Group, ScrollAreaAutosize, SimpleGrid, Stack, Title } from "@mantine/core"
import Note, { NotesManager } from "../lib/notes"
import { TypeDescription } from "../lib/notes/notesmanager"
import { useAllItemsOfType } from "../hooks/data"
import { Link, useParams } from "react-router"

function NavbarSection({type}: {type: TypeDescription<any>}) {
    const { id } = useParams()
    const items = useAllItemsOfType(type.id)

    return (
        <Card shadow="xs" padding="md" radius="md">
            <Stack>
            <Title order={4}><Group><type.icon /> {type.text}</Group></Title>
            { 
                items.map(item => <Link key={item.id} to={`/item/${item.id}`} className={`navbarlink ${item.id === id ? "selected" : ""}`}><Note.Text item={item} /></Link>)
            }
            </Stack>
        </Card>
    )
}

export default function Navbar() {
    const types = NotesManager.supportedTypes()

    return (<>
    <ScrollAreaAutosize>
        <SimpleGrid cols={{base: 1, xs: 1, sm: 2, md: 1,  lg: 1, xl: 1}}>
        {
            types.map(type => <NavbarSection key={type.id} type={type} />)
        }
        </SimpleGrid>
    </ScrollAreaAutosize></>)

}