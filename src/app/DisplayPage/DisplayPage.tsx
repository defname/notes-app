import { useNavigate, useParams } from "react-router"
import MainLayout from "../MainLayout"
import Notes from "../../lib/notes"
import { ScrollArea, Title } from "@mantine/core"
import NotesList from "../../components/NotesList"
import { useItem, useRelatedItems } from "../../hooks/data"
import db from "../../lib/db"
import { notifications } from "@mantine/notifications"


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
    const navigate = useNavigate()
    
    if (id === undefined) return

    function onDeleteClickedHandler() {
        if (!id) {
            console.warn("No id to delete")
            return
        }
        db.items.delete(id)
            .then(() => {
                db.relations.where("item1").equals(id).or("item2").equals(id).delete()
                    .then(() => {
                        notifications.show({ title: "Gelöscht", message: "Notiz wurde gelöscht" })
                        navigate(-1)
                        return
                    })
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
            <Notes.Render item={item} />
        </MainLayout>
    )
}