import { Document } from "mongoose";

export interface NotebookType {
  _id?: string;
  title: string;
  userId: string;
  locked: boolean;
  unlocked: boolean;
  createdAt?: Date;
  protectionToken?: string;
}

export interface INotebook extends Document {
  _id?: string;
  title: string;
  userId: string;
  locked: boolean;
  createdAt?: Date;
  protectionToken?: string;
}
