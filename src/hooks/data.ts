import { useLiveQuery } from "dexie-react-hooks";
import db from "../lib/db";
import { NotesManager, ItemType } from "../lib/notes";
import { useCallback, useEffect, useState } from "react";

function queryItem(id: string|undefined) {
    if (id === undefined) return undefined
    return db.items.get(id)
}

export function useItem(itemId: string|undefined) {
    const item = useLiveQuery(() => queryItem(itemId), [itemId], undefined)
    return item
}

export function useAllItems() {
    const items = useLiveQuery(() => db.items.orderBy("lastChange").reverse().toArray(), [], [])
    return items
}

export function useItemIsValid(item: ItemType|undefined) {
    const [valid, setValid] = useState(false)

    const validate = useCallback(async function () {
        setValid(false)
        setValid(await NotesManager.validateContent(item))
    }, [item])

    useEffect(() => {
        validate()
    }, [item, validate])

    return valid
}

export function useAllItemsOfType(type: string|undefined) {
    const items = useLiveQuery(() => type ? db.items.where("type").equals(type).toArray() : [], [type], [])
    return items
}