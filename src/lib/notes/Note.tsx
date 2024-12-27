import { Loader } from "@mantine/core"
import { ItemType, NoteEditorPublicPluginProps, NotePluginProps, NotePublicPluginProps } from "./notesmanager"
import { Icon as IconType, IconProps, IconXxx } from "@tabler/icons-react"
import { NotesManager } from "./notesmanager"
import ErrorBoundary from "../../components/ErrorBoundary"

function Fallback({ item }: NotePluginProps<any>) {
    console.warn(`There is no plugin registered to handle items of type '${ item && item.type }'`)
    return <>There is no plugin registered to handle items of type '{ item && item.type }'</>
}

function Note({ item, ...props }: NotePublicPluginProps<any>) {
    const Render = NotesManager.getPluginFor(item)?.Render || Fallback
    if (!item) return <Loader />
    return <ErrorBoundary message="Beim Darstellen der Notiz ist ein Fehler aufgetreten.">
        <Render item={ item } { ...props } />
    </ErrorBoundary>
}

function Small({ item, ...props }: NotePublicPluginProps<any>) {
    const Render = NotesManager.getPluginFor(item)?.RenderSmall || Fallback
    if (!item) return <Loader />
    return <ErrorBoundary message="Beim Darstellen der Notiz ist ein Fehler aufgetreten.">
        <Render item={ item } { ...props } />
    </ErrorBoundary>
}

function Text({ item, ...props }: NotePublicPluginProps<any>): string{
    if (!item) return "..."
    return NotesManager.getPluginFor(item)?.RenderAsText({ item, ...props }) || "Can't handle " + item.type
}

function Editor({ item, onChange, create, ...props }: NoteEditorPublicPluginProps<any>) {
    /* This workaround was done to prevent React from throwing an
     * "Expected static flag was missing" error
     */
    const Render = NotesManager.getPluginFor(item)?.RenderEditor || Fallback
    if (!item) return <Loader />
    return <ErrorBoundary message="Beim Darstellen der Notiz ist ein Fehler aufgetreten.">
        <Render item={ item } onChange={ onChange } create={ create } { ...props } />
    </ErrorBoundary>
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