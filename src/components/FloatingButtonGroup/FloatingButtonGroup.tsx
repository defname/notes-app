import { DBItem } from "../../lib/db"
import { IconDotsVertical, IconEdit, IconPlus, IconX } from "@tabler/icons-react"
import { useNavigate } from "react-router"
import DeleteButton from "./DeleteButton"
import AddMenu from "./AddMenu"
import BubbleMenu, { BM } from "../BubbleMenu"

interface FloatingButtonGroupProps {
    currentItem: DBItem|undefined
    onEditClicked?: () => void
    onDeleteClicked?: () => void
}



export function FloatingButtonGroup({ currentItem, onEditClicked, onDeleteClicked }: FloatingButtonGroupProps) {
    const navigate = useNavigate()

    const iconProps = { style: { width: '70%', height: '70%' }, stroke: 1.5 }
    const actionIconProps = { variant: "filled", radius: "xl", size: "input-md" }
    const triggerIconProps = { ...actionIconProps, size: "input-xl" }

    return <BubbleMenu position={{ bottom: 20, left: 20 }}>
        <BM.Menu align="center">
            <BM.Trigger { ...triggerIconProps }>
                <IconDotsVertical { ...iconProps }/>
            </BM.Trigger>
        </BM.Menu>

        <BM.Menu align="center">
            <BM.Item component={ DeleteButton } onClick={ onDeleteClicked || (() => undefined) } { ...actionIconProps }>
            </BM.Item>
            <BM.Item onClick={ onEditClicked } { ...actionIconProps }>
                <IconEdit { ...iconProps } />
            </BM.Item>

            <BM.Trigger { ...triggerIconProps}>
                <IconPlus { ...iconProps } />
            </BM.Trigger>
        </BM.Menu>

        <BM.Menu align="center">
            <AddMenu
                currentItem={ currentItem }
                onEntryClick={ (type) => navigate(currentItem ? `/add/${currentItem.id}/${type.id}` : `/create/${type.id}`)}
                { ...actionIconProps }
                iconProps={ iconProps }/>
            <BM.Trigger { ...triggerIconProps }>
                <IconX { ...iconProps }/>
            </BM.Trigger>
        </BM.Menu>
    </BubbleMenu>
}