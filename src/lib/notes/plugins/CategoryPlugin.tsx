import type { NotePluginProps, NoteEditorPluginProps, ItemType } from "../notes"
import { NotePlugin } from "../notes"
import { IconCategory } from "@tabler/icons-react"
import { Autocomplete, FocusTrap, Text, TextInput, Title } from "@mantine/core"
import db, { DBItem } from "../../db"
import { useState } from "react"

interface ContentType {
    title: string
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

    RenderSmall: ({ item }: NotePluginProps<ContentType>) => {
        return (<>
            <Text>Kategorie: <Text span fw="bold">{ item.content.title }</Text></Text>
        </>)
    },

    RenderAsText: ({ item }: NotePluginProps<ContentType>) => {
        return item.content.title
    },

    RenderEditor: ({ item, onChange, create, parentId } : NoteEditorPluginProps<ContentType>) => {
        const [allCategories, setAllCategories] = useState<DBItem[]>([])
        const [error, setError] = useState<string|boolean>(false)
        
        function onContentChange(content: ContentType) {
            if (!create) return onChange({...item, content: content})

            const duplicate = allCategories.find(it => it.content.title === content.title)
            if (duplicate) {
                onChange(duplicate)
            }
            else {
                onChange({...item, content: content, id: undefined})
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

        return (<FocusTrap active={true}>{
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
        }
        </FocusTrap>)
    },

    asSearchable: (item: ItemType<ContentType>) => {
        return [item.content.title]
    },

    validateContent: async (item: ItemType<ContentType>|DBItem|undefined) => {
        if (!item) return false
        if (!Object.hasOwn(item, "id")) return item.content.title !== ""
        const allCategories = await queryAllCateories()
        const duplicate = allCategories.find(duplicate => duplicate.content.title === item.content.title)
        return (duplicate === undefined || duplicate.id === (item as DBItem).id) && item.content.title !== ""
    },
    
    match: (item: ItemType<ContentType>, searchStr: string) => {
        if (item.content.title.includes(searchStr)) return true
        return false
    }
}

export default CategoryPlugin