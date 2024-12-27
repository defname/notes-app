import { ItemType } from "../notesmanager"
import { ContentType, ListItem } from "./ListPlugin.types"

export function replaceListItem(item: ItemType<ContentType>, idx: number, newListItem: ListItem): ItemType<ContentType> {
  return {
    ...item,
    content: {
      ...item.content,
      items: [
        ...item.content.items.slice(0, idx),
        newListItem,
        ...item.content.items.slice(idx+1)
      ]
    }
  }
}