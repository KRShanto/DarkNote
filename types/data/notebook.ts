export interface NotebookType {
  _id?: string;
  title: string;
  description: string;
  userId: string;
  locked: boolean;
  createdAt?: Date;
  protectionToken?: string;
}
