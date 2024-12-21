import { useEffect, useState } from "react"
import db, { DBItem } from "../lib/db"
import { useAllItems, useItem } from "./data"
import { useLiveQuery } from "dexie-react-hooks"
import Notes from "../lib/notes"


export class Node {
    item: DBItem
    parent: Node|null
    children: Node[]
    distance?: number

    constructor(item: DBItem, parent: Node|null, children?: Node[]) {
        this.item = item
        this.parent = parent
        this.children = children !== undefined ? children : []
    }
}

export function useGraph(parentId?: string) {
    const parent = useItem(parentId)
    const items = useAllItems()
    const relations: [string, string][] = useLiveQuery(() => db.relations.toArray().then(relations => relations.map(rel => ([rel.item1, rel.item2]))), [], [])

    function createGraph(rootItem: DBItem, items: DBItem[], relations: [string, string][]) {    
        const done: string[] = []

        function createNode(item: DBItem|undefined, parentNode: Node|null, distance: number = 0) {
            if (!item || done.includes(item.id)) return
            done.push(item.id)

            const node = new Node(item, parentNode)
            const childrenIds = relations
                                .filter(([id1, id2]) => id1 === item.id || id2 === item.id)
                                .map(([id1, id2]) => id1 === item.id ? id2 : id1)
            node.children = childrenIds.map(id => createNode(
                items.find(item => item.id === id),
                node,
                distance+1
            )).filter(child => child !== undefined)

            node.children.sort((a, b) =>  b.children.length - a.children.length)

            return node
        }
        return createNode(rootItem, null)
    }

    const [root, setRoot] = useState<Node|undefined>()

    useEffect(() => {
        if (!parent) return
        setRoot(createGraph(parent, items, relations))
        console.log(root)
    }, [parent, items, relations])

    function asList() : Node[] {
        if (!root) return []
        const todo = [...root.children]
        const list = []
        while (todo.length > 0) {
            const current = todo.shift()!
            list.push(current)
            if (current?.children) {
                todo.push(...current.children)
            }
        }
        return list
    }


    return [root, asList] as [typeof root, typeof asList]
}