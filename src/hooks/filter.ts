import { DBItem } from "../lib/db"
import Fuse from "fuse.js"
import Notes from "../lib/notes"
import { useEffect, useState } from "react"


interface FilterProps {
    searchStr: string
    filterCategories: string[]
}

function usePrefilter(items: DBItem[], filter: FilterProps) {
    return items.filter(item => filter.filterCategories.includes(item.type))
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

export function useFilter(items: DBItem[], filter: FilterProps) {
    const prefilteredItems = usePrefilter(items, filter)
    const results = useSearch(prefilteredItems, filter.searchStr)

    return results
}