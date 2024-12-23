import { useNavigate, useParams } from "react-router"
import MainLayout from "../MainLayout"
import { ScrollArea, Title } from "@mantine/core"
import { useItem, useRelatedItems } from "../../hooks/data"
import { notifications } from "@mantine/notifications"
import RelatedNotesList from "../../components/RelatedNotes"
import Note, { NotesManager } from "../../lib/notes"


function Aside() {
    const { id } = useParams()
    const relItems = useRelatedItems(id)

    return (<ScrollArea><Title order={3}>Verknüpfte Notizen</Title>{
        relItems.length > 0 && (<>
            <RelatedNotesList parentId={id} />
        </>)
    }</ScrollArea>)
}

export function DisplayPage() {
    const { id } = useParams()
    const item = useItem(id)
    const navigate = useNavigate()
    
    if (id === undefined) return

    function onDeleteClickedHandler() {
        if (!id) {
            console.warn("No id to delete")
            return
        }
        NotesManager.db.deleteItem(id)
            .then(() => {
                notifications.show({ title: "Gelöscht", message: "Notiz wurde gelöscht" })
                navigate(-1)
            })
            .catch(err => {
                notifications.show({ title: "Fehler", message: "Notiz konnte nicht gelöscht werden" })
                console.warn(err)
                return
            })
    }

    function onEditClickedHandler() {
        if (!id) {
            console.warn("No id to edit")
            return
        }

        navigate(`/edit/${id}`)
    }


    return (
        <MainLayout aside={<Aside />} showFloatingButtons={ true } currentItem={ item } onDeleteClicked={ onDeleteClickedHandler } onEditClicked={ onEditClickedHandler }>
            { item && new Date(item!.lastChange).toString()}
            <Note item={item} />
        </MainLayout>
    )
}