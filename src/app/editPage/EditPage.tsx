import { useParams } from "react-router"
import { useNavigate } from "../../hooks/navigate"
import { useItem, useItemIsValid } from "../../hooks/data"
import MainLayout from "../MainLayout"
import { NotesManager } from "../../lib/notes"
import { useEffect, useState } from "react"
import { DBItem } from "../../lib/db"
import SaveButton from "../../components/SaveButton"
import { notifications } from "@mantine/notifications"
import Note from "../../lib/notes"

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
        NotesManager.db.updateItem(modifiedItem)
            .then(id => navigate(`/item/${id}`))
            .catch(err => notifications.show({ title: "Fehler", message: err }))
    }
    
    if (id === undefined) return

    return (<MainLayout showFloatingButtons={false}>
        <Note.Editor item={ modifiedItem } onChange={(item: any) => item && onChangeHandler(item)} />
        <SaveButton onClick={ onSaveHandler } hidden={ !itemIsValid } />
    </MainLayout>)
}