import type { NotePluginProps, NoteEditorPluginProps, ItemType } from "../notes"
import { NotePlugin } from "../notes"
import { IconBlockquote } from "@tabler/icons-react"
import { Text as MText, PolymorphicComponentProps, Space, Spoiler, Textarea, TextInput, TextProps, Title } from "@mantine/core"
import Markdown from "react-markdown"

interface ContentType {
    title: string
    text: string
}

function FormatText({children, ...props}: {children: string} & PolymorphicComponentProps<"p", TextProps>) {
    const sections = children.split("\n\n").map(sec => sec.trim()).filter((sec) => sec !== "")

    return (<>
        { sections.map((sec, n) => <MText key={n} {...props} style={{marginBottom: 20}}>{sec}</MText>) }
    </>)
}

const TextPlugin: NotePlugin<ContentType> = {
    forType: { id: "text", text: "Text", icon: IconBlockquote, defaultContent: { title: "", text: "" } },
    
    Render: ({ item }: NotePluginProps<ContentType>) => {
        return (<>
            <Title order={2}>{ item.content.title }</Title>
            <Markdown>{ item.content.text }</Markdown>
        </>)
    },

    RenderSmall: ({ item }: NotePluginProps<ContentType>) => {
        return (<>
            <MText size="lg" fw="bold">{ item.content.title }</MText>
            <Spoiler showLabel="mehr" hideLabel="weniger">
                <FormatText>{ item.content.text }</FormatText>
            </Spoiler>
        </>)
    },

    RenderAsText: ({ item }: NotePluginProps<ContentType>) => {
        return item.content.title
    },

    RenderEditor: ({ item, onChange } : NoteEditorPluginProps<ContentType>) => {
        function onContentChange(content: ContentType) {
            onChange({...item, content: content})
        }
        return (<>
            <TextInput label="Titel" error={item.content.title === ""} placeholder="" value={ item.content.title } onChange={ev => onContentChange({...item.content, title: ev.target.value})} />
            <Space h="md" />
            <Textarea label="Text" autosize minRows={7} error={item.content.text === ""} placeholder="" value={ item.content.text } onChange={ev => onContentChange({...item.content, text: ev.target.value})}  />
        </>)
    },
    
    asSearchable: (item: ItemType<ContentType>) => {
        return [item.content.title, item.content.text]
    },

    validateContent: async (item: ItemType<ContentType>) => {
        if (item.content.title === "" || item.content.text === "") return false
        return true
    },
}

export default TextPlugin