import { useEffect, useState } from "react"
import { ItemType, NotesManager } from "../lib/notes"

export function useBubbleUpProps(item: ItemType|undefined) {
    const [props, setProps] = useState<Record<string, any>>({})

    useEffect(() => {
        if (!item) {
            setProps({})
        }
        else {
            setProps(NotesManager.getBubbleUpProps(item.type))
        }
    }, [item])

    return props
}