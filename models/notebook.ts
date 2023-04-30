import mongoose, { Schema } from "mongoose";
import { NotebookType } from "../types/data/notebook";

const notebookSchema = new Schema<NotebookType>({
  title: {
    type: String,
    required: true,
  },
  description: String,
  userId: {
    type: String,
    required: true,
  },
  locked: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  protectionToken: {
    type: String,
  },
});

const Notebook =
  mongoose.models.Notebook || mongoose.model("Notebook", notebookSchema);

export default Notebook;
