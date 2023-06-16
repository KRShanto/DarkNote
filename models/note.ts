import { INote } from "@/types/data/note";
import mongoose, { Schema } from "mongoose";
import crypto from "crypto";

const NoteSchema = new Schema<INote>({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    default: "",
  },
  textContent: {
    type: String,
    default: "",
  },
  notebookId: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  iv: { type: String, required: false },
});

const Note = mongoose.models.Note || mongoose.model("Note", NoteSchema);

export default Note;
