import type { NotePluginProps, NoteEditorPluginProps, ItemType } from "../notes"
import { NotePlugin } from "../notes"
import { IconCategory } from "@tabler/icons-react"
import { Autocomplete, Text, TextInput, Title } from "@mantine/core"
import db, { DBItem } from "../../db"
import { useState } from "react"

interface ContentType {
    title: string
}

async function queryForDuplicate(title: string): Promise<DBItem|undefined> {
    return db.items.where('type').equals("category").and(item => item.content.title === title).toArray().then(items => items.length > 0 ? items[0] : undefined)
}

async function queryAllCateories(): Promise<DBItem[]> {
    return db.items.where('type').equals("category").toArray()
}


const CategoryPlugin: NotePlugin<ContentType> = {
    forType: { id: "category", text: "Kategorie", icon: IconCategory, defaultContent: { title: "" } },
    
    Render: ({ item }: NotePluginProps<ContentType>) => {
        return (<>
            <Title order={2}><Text span size="smaller">Kategorie:</Text> { item.content.title }</Title>
        </>)
    },

    RenderInline: ({ item }: NotePluginProps<ContentType>) => {
        return (<>
            <Text>Kategorie: <Text span fw="bold">{ item.content.title }</Text></Text>
        </>)
    },

    RenderEditor: ({ item, onChange, create, parentId } : NoteEditorPluginProps<ContentType>) => {
        const [allCategories, setAllCategories] = useState<DBItem[]>([])
        const [error, setError] = useState<string|boolean>(false)
        
        function onContentChange(content: ContentType) {
            const duplicate = allCategories.find(it => it.content.title === content.title)
            if (duplicate) {
                onChange(duplicate)
            }
            else {
                onChange({...item, content: content})
            }
        }

        async function updateAllCategories() {
            const cats = await queryAllCateories()
            setAllCategories(cats)
        }

        async function onBlur() {
            if (item.content.title === "") {
                setError(true)
                return
            }
            console.log(allCategories)
            if (allCategories.find(duplicate => duplicate.content.title === item.content.title) !== undefined) {
                setError("Es existiert schon eine Kategorie mit dem Namen.")
                return
            }
            setError(false)
        }

        return (<>{
            create && parentId ? <Autocomplete
                label="Name"
                error={ item.content.title === "" }
                value={ item.content.title }
                data={ allCategories.map(item => item.content.title) }
                onFocus={ updateAllCategories }
                onChange={ inputStr => onContentChange({...item.content, title: inputStr}) }
            />
            : <TextInput
                label="Name"
                error={ error }
                value={ item.content.title }
                onFocus={ updateAllCategories }
                onBlur={ onBlur }
                onChange={ ev => onContentChange({...item.content, title: ev.target.value}) }
            />
        }</>)
    },

    validateContent: async (item: ItemType<ContentType>) => {
        const duplicate = await queryForDuplicate(item.content.title)
        if (item.content.title === "" || (duplicate !== undefined && duplicate.id === undefined)) return false
        return true
    },
    
    match: (item: ItemType<ContentType>, searchStr: string) => {
        if (item.content.title.includes(searchStr)) return true
        return false
    }
}

export default CategoryPlugin