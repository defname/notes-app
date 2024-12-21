import type { NotePluginProps, NoteEditorPluginProps, ItemType } from "../notes"
import { NotePlugin } from "../notes"
import { IconBlockquote } from "@tabler/icons-react"
import { Text as MText, PolymorphicComponentProps, Space, Spoiler, Textarea, TextInput, TextProps, Title } from "@mantine/core"

interface ContentType {
    location: string
    searchstring: string
}


const LocationPlugin: NotePlugin<ContentType> = {
    forType: { id: "text", text: "Text", icon: IconBlockquote, defaultContent: { title: "", text: "" } },
    
    Render: ({ item }: NotePluginProps<ContentType>) => {
        return (<>
            
        </>)
    },

    RenderSmall: ({ item }: NotePluginProps<ContentType>) => {
        return (<>
            
        </>)
    },

    RenderAsText: ({ item }: NotePluginProps<ContentType>) => {
        return item.content.location
    },

    RenderEditor: ({ item, onChange } : NoteEditorPluginProps<ContentType>) => {
        function onContentChange(content: ContentType) {
            onChange({...item, content: content})
        }
        return (<>
            
        </>)
    },
    
    asSearchable: (item: ItemType<ContentType>) => {
        return [item.content.location, item.content.searchstring]
    },

    validateContent: async (item: ItemType<ContentType>) => {
        if (item.content.location === "") return false
        return true
    },
}

export default LocationPlugin