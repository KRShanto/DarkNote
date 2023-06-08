export interface NotebookType {
  _id?: string;
  title: string;
  description: string;
  userId: string;
  locked: boolean;
  unlocked: boolean;
  createdAt?: Date;
  protectionToken?: string;
}
