import { useEffect } from "react"
import { useSearchLocation } from "../hooks/location"
import { notifications } from "@mantine/notifications"
import { Container, Text, TextInput } from "@mantine/core"
import { GeoLocation } from "../lib/geolocation"
import { IconMapPin } from "@tabler/icons-react"

interface AddressSearchProps {
    value: string
    onChange: (value: string) => void
    onAddressSelected?: (loc: GeoLocation) => void
}

export default function AddressSearch({ value, onChange, onAddressSelected=() => undefined}: AddressSearchProps) {
    const [results, error] = useSearchLocation(value, {limit: "5"})

    function onInputChange(ev: React.ChangeEvent<HTMLInputElement>) {
        onChange(ev.target.value)
    }

    function getOnAddressClickHandler(result: GeoLocation) {
        return function () {
            onAddressSelected(result)
        }
    }

    useEffect(() => {
        if (error) notifications.show({ title: "Fehler", message: error })
    }, [results, error])


    return <>
        <TextInput leftSection={<IconMapPin />}value={value} onChange={onInputChange} />
        { 
            results.length > 0 && results[0].text !== value && <Container>
                {
                    results.map((result, i) => <Text key={i} onClick={getOnAddressClickHandler(result)}>{result.text}</Text>)
                }
            </Container>
        }
    </>
}