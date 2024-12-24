import { ActionIcon, Affix, Stack } from "@mantine/core"
import { DBItem } from "../../lib/db"
import { IconEdit } from "@tabler/icons-react"
import { useState } from "react"
import { useClickOutside } from "@mantine/hooks"
import { useNavigate } from "react-router"
import MainButton, { ActiveMenu } from "./MainButton"
import DeleteButton from "./DeleteButton"
import AddMenu from "./AddMenu"

interface FloatingButtonGroupProps {
    currentItem: DBItem|undefined
    onEditClicked?: () => void
    onDeleteClicked?: () => void
}

export function FloatingButtonGroup({ currentItem, onEditClicked, onDeleteClicked }: FloatingButtonGroupProps) {
    const navigate = useNavigate()
    const [activeMenu, setActiveMenu] = useState<ActiveMenu>()
    const clickOutsideRef = useClickOutside(() => {
        setActiveMenu(undefined)
    })

    return(<>
        <Affix position={{ bottom: 20, right: 20 }}>
            <Stack align="center" ref={clickOutsideRef}>
                { activeMenu === "add" &&
                    <AddMenu
                        currentItem={currentItem}
                        onEntryClick={ (type) => navigate(currentItem ? `/add/${currentItem.id}/${type.id}` : `/create/${type.id}`)}
                        variant="filled"
                        size="input-md"
                        radius="xl"
                        iconProps={{ style: { width: '70%', height: '70%' }, stroke: 1.5 }}/>
                }
                {
                    activeMenu === "context" &&
                    <>
                        <DeleteButton onClick={onDeleteClicked || (() => undefined)} variant="filled" size="input-md" radius="xl" />

                        <ActionIcon variant="filled" size="input-md" radius="xl" onClick={ onEditClicked }>
                            <IconEdit style={{ width: '70%', height: '70%' }} stroke={1.5} />
                        </ActionIcon>
                    </>
                }
                
                <MainButton currentItem={ currentItem } activeMenu={ activeMenu } setActiveMenu={ setActiveMenu } />
            </Stack>
        </Affix>
        
    </>)
}