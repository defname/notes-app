import { ActionIcon } from "@mantine/core"
import { DBItem } from "../../lib/db"
import { IconDotsVertical, IconPlus, TablerIcon } from "@tabler/icons-react"

export type ActiveMenu = "context"|"add"|undefined

interface MainButtonProps {
  currentItem: DBItem|undefined
  activeMenu: ActiveMenu
  setActiveMenu: (active: ActiveMenu) => void
}

function MainButton({ currentItem, activeMenu, setActiveMenu }: MainButtonProps) {
  const actionIconProps = {
    variant: "filled",
    size: "input-xl",
    radius: "xl",
  }

  const iconProps = {
    style: { width: '70%', height: '70%' },
    stroke: 1.5
  }

  function getActionIcon(Icon: TablerIcon, menu: ActiveMenu|(() => void)) {
    const handler = typeof menu === "function" ? menu : (() => setActiveMenu(menu))
    return (<ActionIcon onClick={handler} {...actionIconProps}>
      <Icon {...iconProps} />
    </ActionIcon>)
  }

  return (<>
  { currentItem
    ? <>
      { !activeMenu && getActionIcon(IconDotsVertical, "context") }
      { activeMenu === "context" && getActionIcon(IconPlus, "add") }
      { activeMenu === "add" && getActionIcon(IconDotsVertical, undefined) }
    </>
    : <>
      { !activeMenu && getActionIcon(IconPlus, "add") }
      { activeMenu && getActionIcon(IconDotsVertical, undefined) }
    </>
  }
  </>)
}

export default MainButton  