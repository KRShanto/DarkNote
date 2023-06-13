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
