/**
 * TextPlugin module to handle text-based notes.
 * Provides rendering, editing, and validation functionalities for text notes.
 */

import type { NotePluginProps, NoteEditorPluginProps, ItemType, TypeDescription } from "../notesmanager"
import { NotePlugin } from "../notesmanager"
import { IconBlockquote } from "@tabler/icons-react"
import { Text as MText, PolymorphicComponentProps, Space, Textarea, TextInput, TextProps, Title } from "@mantine/core"
import Markdown from "react-markdown"
import { Fragment } from "react/jsx-runtime"

interface ContentType {
    title: string
    text: string
}

function FormatText({ children, ...props }: { children: string } & PolymorphicComponentProps<"p", TextProps>) {
    const sections = children.split("\n\n")
        .map((sec) => sec.trim())
        .filter((sec) => sec !== "")
        .map((sec) =>
            sec.split("\n")
                .map(line => <Fragment key={Math.random()}>{ line }<br /></Fragment>)
        )

    return (
        <>
            {sections.map((sec, n) => (
                <MText key={n} {...props} style={{ marginBottom: 20 }}>
                    {sec}
                </MText>
            ))}
        </>
    )
}

const forType: TypeDescription<ContentType> = {
    id: "text",
    text: "Text",
    icon: IconBlockquote,
    defaultContent: { title: "", text: "" }
}

function Render({ item }: NotePluginProps<ContentType>) {
    return (
        <>
            <Title order={2}>{item.content.title}</Title>
            <Markdown>{item.content.text}</Markdown>
        </>
    )
}

function RenderSmall({ item }: NotePluginProps<ContentType>) {
    return (
        <>
            <MText size="lg" fw="bold">
                {item.content.title}
            </MText>
            <div style={{maxHeight: 120, overflow: "hidden"}}>
                <FormatText>{item.content.text}</FormatText>
            </div>
        </>
    )
}

function RenderAsText({ item }: NotePluginProps<ContentType>) {
    return item.content.title
}

function RenderEditor({ item, onChange }: NoteEditorPluginProps<ContentType>) {
    function onContentChange(content: ContentType) {
        onChange({ ...item, content: content })
    }

    return (
        <>
            <TextInput
                label="Titel"
                error={item.content.title === ""}
                placeholder=""
                value={item.content.title}
                onChange={(ev) => onContentChange({ ...item.content, title: ev.target.value })}
            />
            <Space h="md" />
            <Textarea
                label="Text"
                autosize
                minRows={7}
                error={item.content.text === ""}
                placeholder=""
                value={item.content.text}
                onChange={(ev) => onContentChange({ ...item.content, text: ev.target.value })}
            />
        </>
    )
}

function asSearchable(item: ItemType<ContentType>) {
    return [item.content.title, item.content.text]
}

async function validateContent(item: ItemType<ContentType>) {
    if (item.content.title === "" || item.content.text === "") return false
    return true
}

const TextPlugin: NotePlugin<ContentType> = {
    forType,
    Render,
    RenderSmall,
    RenderAsText,
    RenderEditor,
    asSearchable,
    validateContent
}

export default TextPlugin