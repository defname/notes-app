/**
 * ImagePlugin module to handle image-based notes.
 * Provides rendering, editing, and validation functionalities for image notes.
 */

import type { NotePluginProps, NoteEditorPluginProps, ItemType, TypeDescription } from "../notesmanager"
import { NotePlugin } from "../notesmanager"
import { IconPhoto } from "@tabler/icons-react"
import { Button, FileButton, Image, Text, Space, TextInput, Center } from "@mantine/core"

interface ContentType {
    description: string
    base64: string
}

const forType: TypeDescription<ContentType> = {
    id: "image",
    text: "Bild",
    icon: IconPhoto,
    defaultContent: { description: "", base64: "" }
}

function Render({ item }: NotePluginProps<ContentType>) {
    return (
        <>
            <Center>
                <Image src={item.content.base64} alt={item.content.description} radius="md" />
            </Center>
            <Text>{item.content.description}</Text>
        </>
    )
}

function RenderSmall({ item }: NotePluginProps<ContentType>) {
    return (
        <Center>
            <Image src={item.content.base64} h={120} w="auto" alt={item.content.description} radius="md" />
        </Center>
    )
}

function RenderAsText({ item }: NotePluginProps<ContentType>) {
    return item.content.description
}

function RenderEditor({ item, onChange }: NoteEditorPluginProps<ContentType>) {
    function setImage(file: File | null) {
        const reader = new FileReader()
        reader.onloadend = () => {
            onContentChange({ ...item.content, base64: reader.result as string })
        }
        if (file) reader.readAsDataURL(file)
    }

    function onContentChange(content: ContentType) {
        onChange({ ...item, content: content })
    }

    return (
        <>
            <TextInput
                label="Beschreibung"
                error={item.content.description === ""}
                placeholder=""
                value={item.content.description}
                onChange={(ev) => onContentChange({ ...item.content, description: ev.target.value })}
            />
            <Space h="md" />
            <FileButton onChange={setImage} accept="image/png,image/jpeg">
                {(props) => <Button {...props}>Bild hochladen</Button>}
            </FileButton>
            {item.content.base64 && <Image src={item.content.base64} />}
        </>
    )
}

function asSearchable(item: ItemType<ContentType>) {
    return [item.content.description]
}

async function validateContent(item: ItemType<ContentType>) {
    if (item.content.base64 === "") return false
    return true
}

const ImagePlugin: NotePlugin<ContentType> = {
    forType,
    Render,
    RenderSmall,
    RenderAsText,
    RenderEditor,
    asSearchable,
    validateContent
}

export default ImagePlugin