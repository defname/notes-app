import Dexie, { type EntityTable } from 'dexie'
import dexieCloud from "dexie-cloud-addon";

import { ItemType } from './notes'

interface DBItem extends ItemType<any> {
    id: string
}

interface Relations {
    id: string
    item1: string
    item2: string
}

export type NotesDB = Dexie & {
  items: EntityTable<DBItem, 'id'>
  relations: EntityTable<Relations, 'id'>
}

const db = new Dexie('NotesDB', {addons: [dexieCloud]}) as NotesDB

// Schema declaration:
/*
db.version(1).stores({
  items: '@id, type, content', // primary key "id" (for the runtime!)
  relations: '@id, item1, item2'
})

db.version(3).stores({
  items: '@id, type, content', // primary key "id" (for the runtime!)
  relations: '@id, item1, item2, [item1+item2]'
})
*/

db.version(4).stores({
  items: '@id, type, content, lastChange', // primary key "id" (for the runtime!)
  relations: '@id, item1, item2, [item1+item2]'
})

db.cloud.configure({
    databaseUrl: "https://z2xk8elxd.dexie.cloud",
    requireAuth: true // (optional. Block DB until authenticated)
  });

export type { DBItem, Relations }
export default db