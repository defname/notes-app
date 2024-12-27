import { Loader } from "@mantine/core"
import { ItemType, NoteEditorPublicPluginProps, NotePluginProps, NotePublicPluginProps } from "./notesmanager"
import { Icon as IconType, IconProps, IconXxx } from "@tabler/icons-react"
import { NotesManager } from "./notesmanager"

function Fallback({ item }: NotePluginProps<any>) {
    console.warn(`There is no plugin registered to handle items of type '${ item && item.type }'`)
    return <>There is no plugin registered to handle items of type '{ item && item.type }'</>
}

function Note({ item, ...props }: NotePublicPluginProps<any>) {
    if (!item) return <Loader />
    return NotesManager.getPluginFor(item)?.Render({item, ...props}) || Fallback({ item })
}

function Small({ item, ...props }: NotePublicPluginProps<any>) {
    if (!item) return <Loader />
    return NotesManager.getPluginFor(item)?.RenderSmall({item, ...props}) || Fallback({ item })
}

function Text({ item, ...props }: NotePublicPluginProps<any>): string{
    if (!item) return "..."
    return NotesManager.getPluginFor(item)?.RenderAsText({ item, ...props }) || "Can't handle " + item.type
}

function Editor({ item, onChange, create, ...props }: NoteEditorPublicPluginProps<any>) {
    /* This workaround was done to prevent React from throwing an
     * "Expected static flag was missing" error
     */
    const plugin = NotesManager.getPluginFor(item)
    const Editor = plugin ? plugin.RenderEditor : Fallback
    if (!item) return <Loader />
    return <Editor { ...{item, onChange,  create, ...props} } /> 
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