import { Loader } from "@mantine/core"
import { ItemType, NoteEditorPublicPluginProps, NotePluginProps, NotePublicPluginProps } from "./notesmanager"
import { Icon as IconType, IconProps, IconXxx } from "@tabler/icons-react"
import { NotesManager } from "./notesmanager"

function _fallback({ item }: NotePluginProps<any>) {
    console.warn(`There is no plugin registered to handle items of type '${ item && item.type }'`)
    return <>There is no plugin registered to handle items of type '{ item && item.type }'</>
}

function Note({ item, ...props }: NotePublicPluginProps<any>) {
    if (!item) return <Loader />
    return NotesManager.getPluginFor(item)?.Render({item, ...props}) || _fallback({ item })
}

function Small({ item, ...props }: NotePublicPluginProps<any>) {
    if (!item) return <Loader />
    return NotesManager.getPluginFor(item)?.RenderSmall({item, ...props}) || _fallback({ item })
}

function Text({ item, ...props }: NotePublicPluginProps<any>): string{
    if (!item) return "..."
    return NotesManager.getPluginFor(item)?.RenderAsText({ item, ...props }) || "Can't handle " + item.type
}

function Editor({ item, onChange, create, ...props }: NoteEditorPublicPluginProps<any>) {
    if (!item) return <Loader />
    return NotesManager.getPluginFor(item)?.RenderEditor({item, onChange,  create, ...props}) || _fallback({ item })
}

function Icon({item, ...props}: {item: ItemType<any>|undefined} & IconProps & React.RefAttributes<IconType>) : JSX.Element {
    const Icon = (item && NotesManager.getTypeDescription(item.type)?.icon) || IconXxx
    return <Icon {...props} />
}

Note.Small = Small
Note.Text = Text
Note.Editor = Editor
Note.Icon = Icon

export default Note