import { NoteType } from "./note";
import { NotebookType } from "./notebook";

export interface BookWithNotesType extends NotebookType {
  notes: NoteType[];
}
