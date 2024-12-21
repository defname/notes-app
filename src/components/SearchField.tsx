import { ActionIcon, Stack, TextInput } from "@mantine/core"
import { FilterOpts } from "../hooks/filter"
import { IconSearch } from "@tabler/icons-react"
import Notes from "../lib/notes"

interface SearchFieldProps {
    value: FilterOpts
    onChange: (value: FilterOpts) => void
}


export default function SearchField({ value, onChange }: SearchFieldProps) {
    function toggleTypeFilterHandler(typeId: string) {
        return function () {
            if (value.filterTypes.includes(typeId)) {
                onChange({...value, filterTypes: value.filterTypes.filter(id => id !== typeId)})
            }
            else {
                onChange({...value, filterTypes: [...value.filterTypes, typeId]})
            }
        }
    }


    return (<>
        <Stack gap="xs">
            <TextInput value={ value.searchStr } onChange={ev => onChange({...value, searchStr: ev.target.value})} leftSection={<IconSearch />} />
            <ActionIcon.Group>
                { Notes.supportedTypes().map(type => (
                    <ActionIcon
                        key={type.id}
                        onClick={toggleTypeFilterHandler(type.id)}
                        radius="xl"
                        variant={value.filterTypes.includes(type.id) ? "default" : "filled"}
                    >
                        <type.icon style={{ width: '70%', height: '70%' }} stroke={1.5} />
                    </ActionIcon>)
                )}
            </ActionIcon.Group>
        </Stack>

    </>)
}