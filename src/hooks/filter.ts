import { DBItem } from "../lib/db"
import Fuse from "fuse.js"
import Notes from "../lib/notes"
import { useEffect, useState } from "react"


export interface FilterOpts {
    searchStr: string
    filterTypes: string[]
}

function usePrefilter(items: DBItem[], filter: FilterOpts) {
    const [filtered, setFiltered] = useState<DBItem[]>([])
    useEffect(() => {
        setFiltered(items.filter(item => !filter.filterTypes.includes(item.type)))
    }, [items, filter])

    return filtered
}

export function useSearch(items: DBItem[], searchStr: string) {
    const [results, setResults] = useState<DBItem[]>([])
    const searchables = items.map(item => ({ item: item, searchable: Notes.asSearchable(item) }))
    const fuse = new Fuse(searchables, {
        includeScore: true,
        keys: ["searchable"]
    })

    useEffect(() => {
        console.log("searching")
        if (searchStr === "") {
            setResults(items)
            return
        }
        setResults(fuse.search(searchStr).map(result => result.item.item))
    }, [items, searchStr])

    return results
}

export function useFilter(items: DBItem[], filter: FilterOpts) {
    const prefilteredItems = usePrefilter(items, filter)
    const results = useSearch(prefilteredItems, filter.searchStr)

    return results
}