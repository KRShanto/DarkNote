import { Document } from "mongoose";

// TODO: color,
export interface NoteType {
  _id: string;
  title: string;
  content: string;
  textContent: string;
  createdAt: Date;
  userId: string;
  notebookId: string;
}

export interface INote extends Document {
  _id: string;
  title: string;
  content: string;
  textContent: string;
  createdAt: Date;
  userId: string;
  notebookId: string;
}
