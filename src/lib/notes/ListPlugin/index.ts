
import type { NotePlugin } from "../notesmanager"
import type { ContentType } from "./ListPlugin.types"
import { forType, asSearchable, validateContent, finalize, Render, RenderAsText, RenderSmall } from "./ListPlugin"
import RenderEditor from "./ListPlugin.Editor"

const ListPlugin: NotePlugin<ContentType> = {
  forType,
  Render,
  RenderSmall,
  RenderAsText,
  RenderEditor,
  asSearchable,
  validateContent,
  finalize
}

export default ListPlugin