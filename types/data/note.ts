export interface NoteType {
  _id: string;
  title: string;
  content: string;
  createdAt: Date;
  userId: string;
  notebookId: string;
  locked: boolean;
  protectionToken?: string;
}
