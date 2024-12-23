/**
 * Module to provide filtering, searching, and sorting functionalities for notes.
 * Uses Fuse.js for searching and filtering.
 */

import { DBItem } from "../lib/db"
import Fuse from "fuse.js"
import { NotesManager } from "../lib/notes"
import { useEffect, useMemo, useState } from "react"

export interface FilterOpts {
    searchStr: string
    filterTypes: string[]
    orderDesc?: boolean
}

/**
 * Custom hook to prefilter items based on filter options.
 * @param items The list of items to filter
 * @param filter The filter options
 * @returns The filtered list of items
 */
function usePrefilter(items: DBItem[], filter: FilterOpts) {
    const [filtered, setFiltered] = useState<DBItem[]>([])
    useEffect(() => {
        setFiltered(items.filter(item => !filter.filterTypes.includes(item.type)))
    }, [items, filter])

    return filtered
}

/**
 * Custom hook to search items based on a search string.
 * @param items The list of items to search
 * @param searchStr The search string
 * @returns The list of items that match the search string
 */
export function useSearch(items: DBItem[], searchStr: string) {
    const [results, setResults] = useState<DBItem[]>([])
    const searchables = useMemo(() => items.map(item => ({ item: item, searchable: NotesManager.asSearchable(item) })), [items])
    const fuse = new Fuse(searchables, {
        includeScore: true,
        keys: ["searchable"]
    })

    useEffect(() => {
        if (searchStr === "") {
            setResults(items)
            return
        }
        setResults(fuse.search(searchStr).map(result => result.item.item))
    }, [items, searchStr])

    return results
}

/**
 * Custom hook to filter items based on filter options.
 * @param items The list of items to filter
 * @param filter The filter options
 * @returns The filtered and searched list of items
 */
export function useFilter(items: DBItem[], filter: FilterOpts) {
    const prefilteredItems = usePrefilter(items, filter)
    //const sortedItems = useSort(prefilteredItems, "lastChange", filter.orderDesc || false)
    const results = useSearch(prefilteredItems, filter.searchStr)

    return results
}
