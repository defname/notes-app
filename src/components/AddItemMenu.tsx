import { ActionIcon, Affix, Menu, NavLink, rem } from "@mantine/core"
import { IconPlus } from "@tabler/icons-react"

import Notes from "../lib/notes"

interface AddItemMenuProps {
    parentId?: string
}

export default function AddItemMenu({ parentId }: AddItemMenuProps) {
  const parentIdUrlStr = parentId === undefined ? "" : `?parent=${parentId}`

  return (
    <Menu shadow="md">
      <Menu.Target>
          <Affix position={{ bottom: 20, right: 20 }}>
          <ActionIcon variant="filled" size="xl" radius="xl" aria-label="Settings">
              <IconPlus style={{ width: '70%', height: '70%' }} stroke={1.5} />
          </ActionIcon>
          </Affix>
      </Menu.Target>
      <Menu.Dropdown>
          <Menu.Label>Neues Item</Menu.Label>
          {
          Notes.supportedTypes().map(type => (
              <NavLink key={ type.id } href={ `${import.meta.env.BASE_URL}/create/${type.id}${parentIdUrlStr}` } leftSection={ <type.icon style={{ width: rem(14), height: rem(14) }} /> } label={ type.text } />
          ))
          }
      </Menu.Dropdown>
    </Menu>
  )
}
