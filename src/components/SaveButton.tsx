import { IconDeviceFloppy } from "@tabler/icons-react"
import { Button } from "@mantine/core"
import { ButtonProps, PolymorphicComponentProps } from "@mantine/core"

export default function SaveButton({ children, ...props } : PolymorphicComponentProps<"button", ButtonProps>) {
    return <Button leftSection={<IconDeviceFloppy size={14} />} { ...props }>{ children }</Button>
}