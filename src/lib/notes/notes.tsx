/**
 * Module to display Items objects via plugins
 */

import { Loader } from "@mantine/core"
import { Icon, IconProps, IconXxx, TablerIcon } from "@tabler/icons-react"
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
        this.RenderSmall = this.RenderSmall.bind(this)
        this.RenderAsText = this.RenderAsText.bind(this)
        this.RenderEditor = this.RenderEditor.bind(this)
        this.Icon = this.Icon.bind(this)
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

    RenderSmall({ item, ...props }: NotePublicPluginProps<any>) {
        if (!item) return <Loader />
        if (!Object.hasOwn(this.plugins, item.type)) {
            return this._fallback({ item })
        }
        return this.plugins[item.type].RenderSmall({ item, ...props })
    }

    RenderAsText({ item, ...props }: NotePublicPluginProps<any>): string{
        if (!item) return "..."
        if (!Object.hasOwn(this.plugins, item.type)) {
            console.warn(`There is no plugin registered to handle items of type '${ item && item.type }'`)
            return "Can't handle " + item.type
        }
        return this.plugins[item.type].RenderAsText({ item, ...props })
    }

    RenderEditor({ item, onChange, create, ...props }: NoteEditorPublicPluginProps<any>) {
        if (!item) return <Loader />
        if (!Object.hasOwn(this.plugins, item.type)) {
            return this._fallback({ item })
        }
        return this.plugins[item.type].RenderEditor({ item, onChange, create, ...props })
    }

    Icon({item, ...props}: {item: ItemType<any>|undefined} & IconProps & React.RefAttributes<Icon>) : JSX.Element {
        if (!item) return <IconXxx {...props} />
        if (!Object.hasOwn(this.plugins, item.type)) {
            console.warn(`There is no plugin registered to handle items of type '${ item && item.type }'`)
            return <IconXxx {...props} />
        }
        const Icon = this.getTypeDescription(item.type)!.icon
        return <Icon {...props} />
    }
    
    asSearchable(item: ItemType<any>|undefined) : string[] {
        if (!item) return []
        if (!Object.hasOwn(this.plugins, item.type)) {
            console.warn(`There is no plugin registered to handle items of type '${ item && item.type }'`)
            return []
        }
        return this.plugins[item.type].asSearchable(item)
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

    async validateContent(item: ItemType<any>|DBItem|undefined): Promise<boolean> {
        if (!item || !Object.hasOwn(this.plugins, item.type)) {
            return false
        }
        return this.plugins[item.type].validateContent(item)
    }

    async finalize(item: ItemType<any>|DBItem) : Promise<typeof item> {
        if (!Object.hasOwn(this.plugins, item.type)) {
            console.warn(`There is no plugin registered to handle items of type '${ item && item.type }'`)
            return item
        }
        const plugin = this.plugins[item.type]
        if (Object.hasOwn(plugin, "finalize")) {
            return plugin.finalize!(item)
        }
        return item
    }
}

export const Notes = new _Notes(modules)
