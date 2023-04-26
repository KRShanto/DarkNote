export interface NoteType {
  _id: string;
  title: string;
  content: string;
  createdAt: string;
  userId: string;
  notebookId: string;
  locked: boolean;
}
