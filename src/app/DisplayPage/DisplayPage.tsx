import { useParams } from "react-router"
import MainLayout from "../MainLayout"
import Notes from "../../lib/notes"
import AddItemMenu from "../../components/AddItemMenu"
import { Divider, Space, Title } from "@mantine/core"
import NotesList from "../../components/NotesList"
import { useItem, useRelatedItems } from "../../hooks/data"


function Aside() {
    const { id } = useParams()
    const relItems = useRelatedItems(id)

    return (<>{
        relItems.length > 0 && (<>
            <Space h="lg" />
            <Divider />
            <Space h="md" />
            <Title order={3}>Verknüpfte Notizen</Title>
            <NotesList notes={relItems} />
        </>)
    }</>)
}

export function DisplayPage() {
    const { id } = useParams()
    const item = useItem(id)
    
    if (id === undefined) return

    return (
        <MainLayout aside={<Aside />}>
            <Notes.Render item={item} />
            <AddItemMenu parentId={id}/>
        </MainLayout>
    )
}