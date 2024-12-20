import { useLiveQuery } from "dexie-react-hooks";
import db, { DBItem } from "../lib/db";
import Notes, { ItemType } from "../lib/notes";
import { useCallback, useEffect, useState } from "react";

function queryItem(id: string|undefined) {
    if (id === undefined) return undefined
    return db.items.get(id)
}

export function useItem(itemId: string|undefined) {
    const item = useLiveQuery(() => queryItem(itemId), [itemId], undefined)
    return item
}

function queryRelatedItems(id: string|undefined) {
    if (id === undefined) return []
    return db.relations
        .where("item1")
        .equals(id)
        .or("item2")
        .equals(id)
        .toArray()
        .then(relations => relations.map(rel => rel.item1 === id ? rel.item2 : rel.item1))
        .then(ids => db.items.bulkGet(ids))
        .then(items => items.filter(item => item !== undefined))
}

export function useRelatedItems(id: string|undefined) {
    const relItems = useLiveQuery(() => queryRelatedItems(id), [id], [])
    return relItems
}

export function useAllItems() {
    const items = useLiveQuery(() => db.items.toArray(), [], [])
    return items
}

export function useFilter(items: DBItem[], searchStr: string): DBItem[] {
    return items.filter(item => Notes.match(item, searchStr))
}

export function useItemIsValid(item: ItemType|undefined) {
    const [valid, setValid] = useState(false)

    const validate = useCallback(async function () {
        setValid(false)
        setValid(await Notes.validateContent(item))
    }, [item])

    useEffect(() => {
        validate()
    }, [item, validate])

    return valid
}

export function useAllItemsOfType(type: string) {
    const items = useLiveQuery(() => db.items.where("type").equals(type).toArray(), [type], [])
    return items
}