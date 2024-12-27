/**
 * TextPlugin module to handle text-based notes.
 * Provides rendering, editing, and validation functionalities for text notes.
 */

import { type NotePluginProps, type ItemType, type TypeDescription, NotesManager } from "../notesmanager"
import { IconListCheck } from "@tabler/icons-react"
import { Checkbox, Text, Title } from "@mantine/core"
import { ContentType, ListItem } from "./ListPlugin.types"
import { DBItem } from "../../db"
import { ChangeEvent } from "react"
import { replaceListItem } from "./ListPlugin.utils"


export const forType: TypeDescription<ContentType> = {
    id: "list",
    text: "Liste",
    icon: IconListCheck,
    defaultContent: { title: "", items: [] }
}

export function Render({ item }: NotePluginProps<ContentType>) {
    function getOnItemChangeHandler(listItem: ListItem, idx: number) {
      return function (_: ChangeEvent<HTMLInputElement>) {
        NotesManager.db.updateItem(
          replaceListItem(
            item,
            idx,
            {
              ...listItem,
              checked: !listItem.checked
            }
          ) as DBItem
        )
      }
    }
    return (
        <>
            <Title order={2}>{item.content.title}</Title>
            {
              item.content.items.map((item, idx) => <Checkbox key={ idx } checked={ item.checked } onChange={ getOnItemChangeHandler(item, idx) } label={ item.text } />)
            }
        </>
    )
}

export function RenderSmall({ item }: NotePluginProps<ContentType>) {
    return (
        <>
            <Text>Liste: <Text span fw="bold">{ item.content.title }</Text></Text>
        </>
    )
}

export function RenderAsText({ item }: NotePluginProps<ContentType>) {
    return item.content.title
}

export function asSearchable(item: ItemType<ContentType>) {
    return [item.content.title]
}

export async function validateContent(item: ItemType<ContentType>) {
    if (item.content.title === "" ||  !item.content.items.find(item => item.text.trim() !== "") ) return false
    return true
}

export function finalize(item: ItemType<ContentType>|DBItem) {
    return {
        ...item,
        content: {
            ...item.content,
            items: item.content.items.filter((item: ListItem) => item.text.trim() !== "")
        }
    }
}