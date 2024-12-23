import { ActionIcon, Group, NumberInput, Stack, TextInput } from "@mantine/core"
import { FilterOpts } from "../hooks/filter"
import { IconRulerMeasure2, IconSearch } from "@tabler/icons-react"
import { NotesManager } from "../lib/notes"

interface SearchFieldProps {
    value: FilterOpts
    onChange: (value: FilterOpts) => void

    maxDistance?: number
    onMaxDistanceChange?: (distance: number) => void
}


export default function SearchField({ value, onChange, maxDistance, onMaxDistanceChange }: SearchFieldProps) {
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

    function onMaxDistanceChangeHandler(n: string|number) {
        if (!onMaxDistanceChange) return
        if (typeof n === "number")
            onMaxDistanceChange(n)
    }

    return (<>
        <Stack gap="xs">
            <TextInput value={ value.searchStr } onChange={ev => onChange({...value, searchStr: ev.target.value})} leftSection={<IconSearch />} />
            <Group justify="space-between">
                <ActionIcon.Group>
                    { NotesManager.supportedTypes().map(type => (
                        <ActionIcon
                            key={type.id}
                            onClick={toggleTypeFilterHandler(type.id)}
                            radius="sm"
                            variant={value.filterTypes.includes(type.id) ? "default" : "filled"}
                        >
                            <type.icon style={{ width: '70%', height: '70%' }} stroke={1.5} />
                        </ActionIcon>)
                    )}
                </ActionIcon.Group>
                { maxDistance !== undefined && onMaxDistanceChange !== undefined && 
                    <NumberInput
                        clampBehavior="strict"
                        min={1}
                        value={maxDistance}
                        onChange={onMaxDistanceChangeHandler}
                        w={70}
                        size="xs"
                        radius="sm"
                        leftSection={<IconRulerMeasure2 size={18} />}
                    />
                }
            </Group>
        </Stack>

    </>)
}