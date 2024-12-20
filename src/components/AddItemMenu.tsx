import { ActionIcon, Affix, Menu, rem } from "@mantine/core"
import { IconPlus } from "@tabler/icons-react"

import Notes from "../lib/notes"
import { Link } from "react-router"



interface Position {
  left?: number|string
  top?: number|string
  right?: number|string
  bottom?: number|string
}

interface AddItemMenuProps {
    parentId?: string
}


export default function AddItemMenu({ parentId }: AddItemMenuProps) {
  const parentIdUrlStr = parentId === undefined ? "" : `?parent=${parentId}`

  return (
    <Menu shadow="md">
      <Menu.Target>
            <ActionIcon variant="filled" size="input-xl" radius="xl" aria-label="Settings">
                <IconPlus style={{ width: '70%', height: '70%' }} stroke={1.5} />
            </ActionIcon>
      </Menu.Target>
      <Menu.Dropdown>
          <Menu.Label>Neues Item</Menu.Label>
          {
          Notes.supportedTypes().map(type => (
              <Link key={type.id} to={`/create/${type.id}${parentIdUrlStr}`}>
                <Menu.Item leftSection={ <type.icon style={{ width: rem(14), height: rem(14) }} /> }>{type.text}</Menu.Item>
              </Link>
              
          ))
          }
      </Menu.Dropdown>
    </Menu>
  )
}
