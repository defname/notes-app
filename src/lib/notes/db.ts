import type { ItemType, NotesManager } from "./notesmanager"
import { DBItem, NotesDB } from "../db"


export class NotesDbWrapper {
    nm: typeof NotesManager
    db: NotesDB

    constructor(nm: typeof NotesManager, db: NotesDB) {
        this.nm = nm
        this.db = db
    }

    /**
     * Check for a relation between two items.
     * @param id1 The id of the first item
     * @param id2 The id of the second item
     * @returns A promise that resolves to the relation id if found, otherwise undefined
     */
    async checkForRelation(id1: string, id2: string): Promise<string|undefined> {
        return this.db.relations.where("[item1+item2]").anyOf([[id1, id2], [id2, id1]]).toArray()
            .then(relations => relations.length === 0 ? undefined : relations[0].id)
    }

    /**
     * Delete an item and all its relations from the db.
     * @param id Id of the item to delete
     * @returns A Promise that resolves on success
     */
    async deleteItem(id: string): Promise<void> {
        this.db.items.delete(id)
            .then(() => {
                this.db.relations.where("item1").equals(id).or("item2").equals(id).delete()
                    .then(() => {
                        return
                    })
            })
    }

    /**
     * Delete the relation between item with id1 and item with id2 from db. Order doesnt matter.
     * @param id1 If of one item in the relation
     * @param id2 Id of the other item
     * @returns A promise that resolves on success
     */
    async deleteRelation(id1: string, id2: string): Promise<void> {
        return this.db.relations.where("[item1+item2]").anyOf([[id1, id2], [id2, id1]]).delete()
            .then(() => undefined)
    }

    /**
     * Update an item in the database.
     * @param item The item to update
     * @returns A promise that resolves to the id of the updated item
     * @throws An error if the item content is not valid
     */
    async updateItem(item: DBItem): Promise<string> {
        if (!this.nm.validateContent(item)) {
            throw "Die Angaben sind nicht vollständig oder nicht korrekt."
        }
        const finalizedItem = (await this.nm.finalize(item)) as DBItem
        return this.db.items.update(finalizedItem.id, {"content": finalizedItem.content, "lastChange": finalizedItem.lastChange})
            .then(() => finalizedItem.id)
    }

    /**
     * Save an item to the database and add a relation to the parent item.
     * 
     * @param newItem The item to save
     * @param parentId The id of the parent item
     * @param notify A callback function to notify the user
     * @returns A promise that resolves to the id of the saved item and a boolean that is true if a new item was added and false if the item already exists
     */
    async saveItem(newItem: ItemType<any>|undefined, parentId: string|null): Promise<[string, string|undefined]>  {
        if (!newItem) throw "Kein Item zum Speichern vorhanden."
        
        /* validate the new item
            * the plugin's RenderEditor method is in charge of showing hints what exactly
            * is not ok */
        if (!await this.nm.validateContent(newItem)) {
            throw "Die Angaben sind nicht vollständig oder nicht korrekt."
        }
        
        const newItemFinalized = await this.nm.finalize(newItem)
        
        
        /* Check if the returned item already exists (in this case it has an id) and if so
         * just create a relation between the parent item and the returned item */
        if (Object.hasOwn(newItemFinalized, "id") && (newItemFinalized as DBItem).id! !== undefined) {
            console.log("Item already exists")
            if (parentId === null) {
                throw "Die Notiz existiert bereits."
            }
        
            if (parentId === (newItemFinalized as DBItem).id) {
                throw "Eine Notiz kann nicht mit sich selbst verknüpft werden."
            }
            const existingItemId = (newItemFinalized as DBItem).id
            if (await this.checkForRelation(parentId, existingItemId)) {
                //notify("Die Verbindung existiert bereits.")
                return [existingItemId, undefined]
            }
            return this.db.relations.add({item1: existingItemId, item2: parentId})
                .then(relId => [existingItemId, relId])
        }
        
        /* If the item is actually a new one add it to the database and create a relation
            * to the parent item, if a parent item is specified */
        return this.db.items.add(newItemFinalized)
            .then(newId => {
                if (parentId !== null) {
                    return this.db.relations.add({item1: newId, item2: parentId})
                    .then(relId => [newId, relId])
                }
                else {
                    return [newId, undefined]
                }
            })
    }

    /**
     * Add a relation between items with id1 and id2. If the relation already exists
     * return undefined.
     * @param id1 Id of one item
     * @param id2 Id of the other item
     * @returns A Promise that resolves in the id of the relation or undefined if the
     *          relation already exists
     */
    async addRelation(id1: string, id2: string): Promise<string|undefined> {
        if (id1 === id2 || await this.checkForRelation(id1, id2)) return
        return this.db.relations.add({item1: id1, item2: id2})
    }

}