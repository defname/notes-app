import { IconDeviceFloppy } from "@tabler/icons-react"
import { ActionIcon, Affix } from "@mantine/core"

interface SaveButtonProps {
    onClick: () => void
    hidden: boolean
}

export default function SaveButton({ onClick, hidden } : SaveButtonProps) {
    return (<>
        <Affix hidden={ hidden } position={{ bottom: 20, right: 20 }}>
            <ActionIcon onClick={ onClick } variant="filled" size="input-xl" radius="xl">
                <IconDeviceFloppy style={{ width: '70%', height: '70%' }} stroke={1.5} />
            </ActionIcon>
        </Affix>
    </>)
}