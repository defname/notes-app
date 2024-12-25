import { ActionIcon, ActionIconProps, PolymorphicComponentProps } from "@mantine/core"
import { NotesManager } from "../../lib/notes"
import { DBItem } from "../../lib/db"
import React, { ComponentProps } from "react"
import { Icon, IconProps } from "@tabler/icons-react"
import { TypeDescription } from "../../lib/notes/notesmanager"
import { BM } from "../BubbleMenu"

interface AddMenuProps {
  currentItem: DBItem|undefined
  onEntryClick: (type: TypeDescription<any>) => void
  iconProps?: IconProps & React.RefAttributes<Icon>
}

function AddMenu({ currentItem, onEntryClick, children, iconProps, ...props }: AddMenuProps & ComponentProps<typeof BM.Item>) {

   /* Code */
  return (<>
    {
      NotesManager.supportedTypes().map(type => (
          <BM.Item  onClick={ () => onEntryClick(type) } key={type.id} {...props}>
            <type.icon {...iconProps} />
          </BM.Item>
      ))
    }
  </>)
}

export default AddMenu