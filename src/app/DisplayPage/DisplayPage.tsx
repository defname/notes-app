import { useParams } from "react-router"
import MainLayout from "../MainLayout"
import Notes from "../../lib/notes"
import { ScrollArea, Title } from "@mantine/core"
import NotesList from "../../components/NotesList"
import { useItem, useRelatedItems } from "../../hooks/data"


function Aside() {
    const { id } = useParams()
    const relItems = useRelatedItems(id)

    return (<ScrollArea>{
        relItems.length > 0 && (<>
            <Title order={3}>Verknüpfte Notizen</Title>
            <NotesList notes={relItems} />
        </>)
    }</ScrollArea>)
}

export function DisplayPage() {
    const { id } = useParams()
    const item = useItem(id)
    
    if (id === undefined) return

    return (
        <MainLayout aside={<Aside />} showAddItemMenu={true} currentItem={item}>
            <Notes.Render item={item} />
        </MainLayout>
    )
}