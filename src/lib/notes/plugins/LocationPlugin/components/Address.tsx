import { PolymorphicComponentProps, Text, TextProps } from "@mantine/core"

interface AddressProps {
    address: string
}

export default function Address({ address, ...props }: AddressProps & PolymorphicComponentProps<"p", TextProps>) {
    return <>
        {
            address.split(",").map(line => <Text {...props}>{line}</Text>)
        }
    </>
}