import type { NotePluginProps, NoteEditorPluginProps, ItemType } from "../notes"
import { NotePlugin } from "../notes"
import { IconPhoto } from "@tabler/icons-react"
import { Button, FileButton, Image, Text, Space, TextInput, Center } from "@mantine/core"

interface ContentType {
    description: string
    base64: string
}

const ImagePlugin: NotePlugin<ContentType> = {
    forType: { id: "image", text: "Bild", icon: IconPhoto, defaultContent: { description: "", base64: "" } },
    
    Render: ({ item }: NotePluginProps<ContentType>) => {
        return (<>
            <Center>
            <Image src={item.content.base64} alt={item.content.description} radius="md" />
            </Center>
            <Text>{ item.content.description }</Text>
        </>)
    },

    RenderSmall: ({ item }: NotePluginProps<ContentType>) => {
        return (<Center>
            <Image src={item.content.base64} h={120} w="auto" alt={item.content.description} radius="md" />
        </Center>)
    },

    RenderAsText: ({ item }: NotePluginProps<ContentType>) => {
        return item.content.description
    },

    RenderEditor: ({ item, onChange } : NoteEditorPluginProps<ContentType>) => {
        function setImage(file: File|null) {
            const reader = new FileReader()
            reader.onloadend = () => {
                onContentChange({...item.content, base64: reader.result as string})
            }
            if (file) reader.readAsDataURL(file)
        }

        function onContentChange(content: ContentType) {
            onChange({...item, content: content})
        }
        return (<>
            <TextInput label="Beschreibung" error={item.content.description === ""} placeholder="" value={ item.content.description } onChange={ev => onContentChange({...item.content, description: ev.target.value})} />
            <Space h="md" />
            <FileButton onChange={setImage} accept="image/png,image/jpeg">
                {(props) => <Button {...props}>Bild hochladen</Button>}
            </FileButton>
            {
                item.content.base64 && <Image src={item.content.base64} />
            }
        </>)
    },
    
    asSearchable: (item: ItemType<ContentType>) => {
        return [item.content.description]
    },

    validateContent: async (item: ItemType<ContentType>) => {
        if (item.content.base64 === "") return false
        return true
    },
}

export default ImagePlugin