import { NoteType } from "@/types/data/note";
import mongoose, { Schema } from "mongoose";

const NoteSchema = new Schema<NoteType>({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
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
  locked: {
    type: Boolean,
    default: false,
  },
  protectionToken: {
    type: String,
  },
});

const Note = mongoose.models.Note || mongoose.model("Note", NoteSchema);

export default Note;
