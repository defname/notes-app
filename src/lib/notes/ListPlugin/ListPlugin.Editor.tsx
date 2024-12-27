import { ActionIcon, TextInput } from "@mantine/core"
import { NoteEditorPluginProps } from "../notesmanager"
import { ContentType, ListItem } from "./ListPlugin.types"
import { ChangeEvent, useEffect } from "react"
import { IconSquare, IconSquareCheck, IconTrash } from "@tabler/icons-react"


export function RenderEditor({ item, onChange }: NoteEditorPluginProps<ContentType>) {

  useEffect(() => {
    if (item.content.items.length === 0) {
      addItem()
    }
  })

  function onContentChange(content: ContentType) {
    onChange({...item, content: content})
  }

  function addItem() {
    onContentChange({
      ...item.content,
      items: [
        ...item.content.items,
        { text: "", checked: false }
      ]
    })
  }

  function getOnItemChangeHandler(listItem: ListItem, idx: number) {
    return function (ev: ChangeEvent<HTMLInputElement>) {
      let addItem: ListItem[] = []

      if (idx === item.content.items.length-1 && ev.target.value.trim() !== "") {
        addItem = [{ checked: false, text: "" }]
      }
      onContentChange({
        ...item.content,
        items: [
          ...item.content.items.slice(0, idx),
          { ...listItem, text: ev.target.value },
          ...item.content.items.slice(idx+1),
          ...addItem
        ]
      })
    }
  }
  
  function getDeleteItemHandler(idx: number) {
    return function () {
      onContentChange({
        ...item.content,
        items: [
          ...item.content.items.slice(0, idx),
          ...item.content.items.slice(idx+1),
        ]
      })
    }
  }

  return <>
    <TextInput mb="lg" label="Titel" value={ item.content.title } onChange={ ev => onContentChange({ ...item.content, title: ev.target.value }) } />
    {
      item.content.items.map((item, idx) => <TextInput
        key={ idx }
        mb="md"
        leftSection={ item.checked ? <IconSquareCheck /> : <IconSquare /> }
        value={ item.text }
        onChange={ getOnItemChangeHandler(item, idx) }
        rightSection={ <ActionIcon onClick={ getDeleteItemHandler(idx) }><IconTrash /></ActionIcon> }
      />)
    }
  </>
}

export default RenderEditor