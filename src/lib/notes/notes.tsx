/**
 * Module to display Items objects via plugins
 */

import { Loader } from "@mantine/core"
import { TablerIcon } from "@tabler/icons-react"
import React from "react"

import { modules } from "./notes.config"


export interface ItemType<ContentType=any> {
    type: string
    content: ContentType
}

export interface NotePluginProps<ContentType> {
    item: ItemType<ContentType>
    [name: string]: any
}

export type NoteEditorPluginProps<ContentType> = NotePluginProps<ContentType> & {
    onChange: (content: ItemType<ContentType>) => void
}

type ItemOptional<Type extends {item: any}> = Omit<Type, "item"> & Partial<Pick<Type, "item">>
type NotePublicPluginProps<ContentType> = ItemOptional<NotePluginProps<ContentType>>
type NoteEditorPublicPluginProps<ContentType> = ItemOptional<NoteEditorPluginProps<ContentType>>

export interface TypeDescription<ContentType> {
    id: string
    text: string
    icon: TablerIcon
    defaultContent: Omit<ContentType, "type">
}

export interface NotePlugin<ContentType> {
    /* description of the content the plugin can handle */
    forType: TypeDescription<ContentType>
    
    Render: React.FC<NotePluginProps<ContentType>>
    RenderInline: React.FC<NotePluginProps<ContentType>>
    RenderEditor: React.FC<NoteEditorPluginProps<ContentType>>

    /* validator to check new item before it is written into the db */
    validateContent: (item: ItemType<ContentType>) => Promise<boolean>
    /* used to filter a list of items */
    match: (item: ItemType<ContentType>, searchString: string) => boolean
}


class _Notes {
    plugins: {[type: string]: NotePlugin<any>}

    constructor(plugins?: NotePlugin<any>[]) {
        this.plugins =  {}
        if (plugins) {
            for (const plugin of plugins) {
                this.register(plugin)
            }
        }

        this.Render = this.Render.bind(this)
        this.RenderInline = this.RenderInline.bind(this)
        this.RenderEditor = this.RenderEditor.bind(this)
    }

    register(plugin: NotePlugin<any>) {
        console.log(plugin.forType)
        this.plugins[plugin.forType.id] = plugin
    }

    _fallback({ item }: NotePluginProps<any>) {
        console.warn(`There is no plugin registered to handle items of type '${ item && item.type }'`)
        return <>There is no plugin registered to handle items of type '{ item && item.type }'</>
    }

    Render({ item, ...props }: NotePublicPluginProps<any>) {
        if (!item) return <Loader />
        if (!Object.hasOwn(this.plugins, item.type)) {
            return this._fallback({ item })
        }
        return this.plugins[item.type].Render({ item, ...props })
    }

    RenderInline({ item, ...props }: NotePublicPluginProps<any>) {
        if (!item) return <Loader />
        if (!Object.hasOwn(this.plugins, item.type)) {
            return this._fallback({ item })
        }
        return this.plugins[item.type].RenderInline({ item, ...props })
    }

    RenderEditor({ item, onChange, ...props }: NoteEditorPublicPluginProps<any>) {
        if (!item) return <Loader />
        if (!Object.hasOwn(this.plugins, item.type)) {
            return this._fallback({ item })
        }
        return this.plugins[item.type].RenderEditor({ item, onChange, ...props })
    }

    supportedTypes() : TypeDescription<any>[] {
        return Object.keys(this.plugins).map(key => this.plugins[key].forType)
    }
    
    getTypeDescription(type: string) : TypeDescription<any>|undefined {
        if (!Object.hasOwn(this.plugins, type)) {
            return undefined
        }
        return this.plugins[type].forType
    }

    async validateContent(item: ItemType<any>|undefined): Promise<boolean> {
        if (!item || !Object.hasOwn(this.plugins, item.type)) {
            return false
        }
        return this.plugins[item.type].validateContent(item)
    }

    match(item: ItemType<any>, searchStr: string): boolean {
        if (!Object.hasOwn(this.plugins, item.type)) return false
        return this.plugins[item.type].match(item, searchStr)
    }
}

export const Notes = new _Notes(modules)
