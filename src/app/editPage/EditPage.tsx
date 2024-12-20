import { useNavigate, useParams } from "react-router"
import { useItem, useItemIsValid } from "../../hooks/data"
import MainLayout from "../MainLayout"
import Notes from "../../lib/notes"
import { useEffect, useState } from "react"
import db, { DBItem } from "../../lib/db"
import SaveButton from "../../components/SaveButton"
import { notifications } from "@mantine/notifications"


export function EditPage() {
    const { id } = useParams()
    const item = useItem(id)
    const [modifiedItem, setModifiedItem] = useState<DBItem|undefined>(item)
    const navigate = useNavigate()
    const itemIsValid = useItemIsValid(modifiedItem)

    useEffect(() => {
        setModifiedItem(item)
    }, [item])

    function onChangeHandler(item: DBItem) {
        setModifiedItem(item)
    }

    async function onSaveHandler() {
        if (!modifiedItem) return
        if (!itemIsValid) {
            notifications.show({ title: "Fehler", message: "Die Angaben sind nicht vollständig oder nicht korrekt." })
            return
        }
        console.log(modifiedItem.id)
        return db.items.update(modifiedItem.id, {"content": modifiedItem.content})
            .then(() => navigate(`/item/${modifiedItem.id}`))
            .catch(err => notifications.show({ title: "Fehler", message: err }))
    }
    
    if (id === undefined) return

    return (<MainLayout showFloatingButtons={false}>
        <Notes.RenderEditor item={ modifiedItem } onChange={(item: any) => item && onChangeHandler(item)} />
        <SaveButton onClick={ onSaveHandler } hidden={ !itemIsValid } />
    </MainLayout>)

}