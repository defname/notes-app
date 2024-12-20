import type { NotePluginProps, NoteEditorPluginProps, ItemType } from "../notes"
import { NotePlugin } from "../notes"
import { IconCategory } from "@tabler/icons-react"
import { Text, TextInput, Title } from "@mantine/core"
import db from "../../db"
import { useState } from "react"

interface ContentType {
    title: string
}

async function queryForDuplicates(title: string): Promise<boolean> {
    return db.items.where('type').equals("category").and(item => item.content.title === title).toArray().then(items => items.length > 0)
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

    RenderEditor: ({ item, onChange } : NoteEditorPluginProps<ContentType>) => {
        const [duplicates, setDuplicates] = useState(false)
        function onContentChange(content: ContentType) {
            onChange({...item, content: content})
        }
        async function onBlur() {
            setDuplicates(await queryForDuplicates(item.content.title))
        }
        return (<>
            <TextInput label="Name" error={item.content.title === "" || (duplicates && "Eine Kategorie mit dem Namen existiert bereits.")} placeholder="" value={ item.content.title } onBlur={onBlur} onChange={ev => onContentChange({...item.content, title: ev.target.value})} />
        </>)
    },

    validateContent: async (item: ItemType<ContentType>) => {
        if (item.content.title === "" || await queryForDuplicates(item.content.title)) return false
        return true
    },
    
    match: (item: ItemType<ContentType>, searchStr: string) => {
        if (item.content.title.includes(searchStr)) return true
        return false
    }
}

export default CategoryPlugin