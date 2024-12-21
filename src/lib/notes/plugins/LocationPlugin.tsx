import type { NotePluginProps, NoteEditorPluginProps, ItemType } from "../notes"
import { NotePlugin } from "../notes"
import { IconMapPin } from "@tabler/icons-react"

interface ContentType {
    location: string
    searchstring: string
}


const LocationPlugin: NotePlugin<ContentType> = {
    forType: { id: "location", text: "Location", icon: IconMapPin, defaultContent: { location: "", searchstring: "" } },
    
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