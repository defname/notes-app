import { ActionIcon, ActionIconProps, PolymorphicComponentProps } from "@mantine/core"
import { NotesManager } from "../../lib/notes"
import { DBItem } from "../../lib/db"
import React from "react"
import { Icon, IconProps } from "@tabler/icons-react"
import { TypeDescription } from "../../lib/notes/notesmanager"

interface AddMenuProps {
  currentItem: DBItem|undefined
  onEntryClick: (type: TypeDescription<any>) => void
  iconProps?: IconProps & React.RefAttributes<Icon>
}

function AddMenu({ currentItem, onEntryClick, children, iconProps, ...props }: AddMenuProps & PolymorphicComponentProps<"button", ActionIconProps>) {

   /* Code */
  return (<>
    {
      NotesManager.supportedTypes().map(type => (
          <ActionIcon onClick={ () => onEntryClick(type) } key={type.id} {...props}>
            <type.icon {...iconProps} />
          </ActionIcon>
      ))
    }
  </>)
}

export default AddMenu