/**
 * Module to display Items objects via plugins
 */

import { TablerIcon } from "@tabler/icons-react"
import React from "react"

import { modules } from "./notes.config"
import { DBItem } from "../db"


export interface ItemType<ContentType=any> {
    type: string
    content: ContentType
}

export interface NotePluginProps<ContentType> {
    item: ItemType<ContentType>
    [name: string]: any
}

export type NoteEditorPluginProps<ContentType> = NotePluginProps<ContentType> & {
    /* callback to update the item.
     * item might be of type ItemType (without an id) or of type DBItem (with an id).
     * If item has no id it should be an new object, if it has an id it is an
     * existing object. */
    onChange: (item: ItemType<ContentType>|DBItem) => void
    /* is the component rendered to create a new item or to edit an existing one */
    create?: boolean
    /* id of the parent item */
    parentId?: string
}

export type ItemOptional<Type extends {item: any}> = Omit<Type, "item"> & Partial<Pick<Type, "item">>
export type NotePublicPluginProps<ContentType> = ItemOptional<NotePluginProps<ContentType>>
export type NoteEditorPublicPluginProps<ContentType> = ItemOptional<NoteEditorPluginProps<ContentType>>

export interface TypeDescription<ContentType> {
    id: string
    text: string
    icon: TablerIcon
    defaultContent: Omit<ContentType, "type">
}

export interface NotePlugin<ContentType=any> {
    /* description of the content the plugin can handle */
    forType: TypeDescription<ContentType>
    
    Render: React.FC<NotePluginProps<ContentType>>
    RenderSmall: React.FC<NotePluginProps<ContentType>>
    RenderAsText: (props: NotePluginProps<ContentType>) => string
    RenderEditor: React.FC<NoteEditorPluginProps<ContentType>>

    /* Return a list of strings that can be used to search for this item.
     * First strings in the list have a higher priority */
    asSearchable: (item: ItemType<ContentType>) => string[]

    /* validator to check new item before it is written into the db */
    validateContent: (item: ItemType<ContentType>|DBItem) => Promise<boolean>

    /* finalize item before it is written into the db, after validation */
    finalize?: (item: ItemType<ContentType>|DBItem) => typeof item | Promise<typeof item>

}

class _NotesManager {
    plugins: {[type: string]: NotePlugin<any>}

    constructor(plugins?: NotePlugin<any>[]) {
        this.plugins =  {}
        if (plugins) {
            for (const plugin of plugins) {
                this.register(plugin)
            }
        }
    }

    register(plugin: NotePlugin<any>) {
        console.log(plugin.forType)
        this.plugins[plugin.forType.id] = plugin
    }

    getPluginForType(type: string): NotePlugin|undefined {
        if (!Object.hasOwn(this.plugins, type)) {
            console.warn(`There is no plugin registered to handle items of type '${ type }'`)
            return undefined
        }
        return this.plugins[type]
    }

    getPluginFor(item: ItemType<any>|string|undefined) : NotePlugin|undefined {
        if (!item) return undefined
        if (typeof item === 'string') {
            return this.getPluginForType(item)
        }
        return this.getPluginForType(item.type)
    }
    
    asSearchable(item: ItemType<any>|undefined) : string[] {
        return this.getPluginFor(item)?.asSearchable(item!) || []
    }

    supportedTypes() : TypeDescription<any>[] {
        return Object.keys(this.plugins).map(key => this.plugins[key].forType)
    }
    
    getTypeDescription(type: string) : TypeDescription<any>|undefined {
        return this.getPluginForType(type)?.forType
    }

    async validateContent(item: ItemType<any>|DBItem|undefined): Promise<boolean> {
        return this.getPluginFor(item)?.validateContent(item!) || false
    }

    async finalize(item: ItemType<any>|DBItem) : Promise<typeof item> {
        const plugin = this.getPluginFor(item)
        if (!plugin || !Object.hasOwn(plugin, "finalize")) {
            return item
        }
        return plugin.finalize!(item)
    }
}

export const NotesManager = new _NotesManager(modules)
