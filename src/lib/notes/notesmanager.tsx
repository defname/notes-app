/**
 * Module to display Items objects via plugins
 */

import { TablerIcon } from "@tabler/icons-react"
import React from "react"

import { modules } from "./notes.config"
import db, { DBItem } from "../db"
import { NotesDbWrapper } from "./db"


export interface ItemType<ContentType=any> {
    type: string
    content: ContentType
    lastChange: number
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

    /* Props to hand up to the main layout on the display page */
    bubbleUpProps?: Record<string, any>
}

class _NotesManager {
    plugins: {[type: string]: NotePlugin<any>}
    db: NotesDbWrapper

    constructor(plugins?: NotePlugin<any>[]) {
        this.plugins =  {}
        if (plugins) {
            for (const plugin of plugins) {
                this.register(plugin)
            }
        }

        this.db = new NotesDbWrapper(this, db)
    }

    /**
     * Register a plugin
     * @param plugin The plugin to register
     */
    register(plugin: NotePlugin<any>) {
        this.plugins[plugin.forType.id] = plugin
    }

    /**
     * Return the plugin that handles items of the given types.
     * @param type id of the type (as in NotePlugin.forType.id)
     * @returns the correct plugin or undefined if not found
     */
    getPluginForType(type: string): NotePlugin|undefined {
        if (!Object.hasOwn(this.plugins, type)) {
            console.warn(`There is no plugin registered to handle items of type '${ type }'`)
            return undefined
        }
        return this.plugins[type]
    }

    /**
     * As getPluginForType() but takes an item or an item type
     * @param item an item or item type
     * @returns the plugin to handle item or undefined if not found
     */
    getPluginFor(item: ItemType<any>|string|undefined) : NotePlugin|undefined {
        if (!item) return undefined
        if (typeof item === 'string') {
            return this.getPluginForType(item)
        }
        return this.getPluginForType(item.type)
    }
    
    /**
     * Return a list of strings that can be used to search for this item.
     * @param item The item to be searched
     * @returns A list of searchable strings
     */
    asSearchable(item: ItemType<any>|undefined) : string[] {
        return this.getPluginFor(item)?.asSearchable(item!) || []
    }

    /**
     * Get the list of supported types.
     * @returns An array of TypeDescription objects
     */
    supportedTypes() : TypeDescription<any>[] {
        return Object.keys(this.plugins).map(key => this.plugins[key].forType)
    }
    
    /**
     * Get the description of a type.
     * @param type The type id
     * @returns The TypeDescription object or undefined if not found
     */
    getTypeDescription(type: string) : TypeDescription<any>|undefined {
        return this.getPluginForType(type)?.forType
    }

    /**
     * Validate the content of an item.
     * @param item The item to validate
     * @returns A promise that resolves to true if the content is valid, otherwise false
     */
    async validateContent(item: ItemType<any>|DBItem|undefined): Promise<boolean> {
        return this.getPluginFor(item)?.validateContent(item!) || false
    }

    /**
     * Finalize the item before it is written into the database.
     * @param item The item to finalize
     * @returns A promise that resolves to the finalized item
     */
    async finalize(item: ItemType<any>|DBItem) : Promise<typeof item> {
        console.log("FINALIZED", Date.now())
        const itemWithTime: DBItem|ItemType<any> = {...item, lastChange: Date.now() }
        console.log(new Date(itemWithTime.lastChange).toString())
        const plugin = this.getPluginFor(item)
        if (!plugin || !Object.hasOwn(plugin, "finalize")) {
            return itemWithTime
        }
        return plugin.finalize!(itemWithTime)
    }

    /**
     * Get a default (empty) item object to use on the create page.
     * @param type The type for which the default object is needed
     * @returns The default object for type
     */
    getDefaultItem(type: string): ItemType {
        const plugin = this.getPluginForType(type)
        if (!plugin) {
            throw "No plugin for type"
        }
        return {content: plugin.forType.defaultContent, type: type, lastChange: Date.now() }
    }

    getBubbleUpProps(type: string): Record<string, any> {
        return this.getPluginForType(type)?.bubbleUpProps || {}
    }
}

export const NotesManager = new _NotesManager(modules)
