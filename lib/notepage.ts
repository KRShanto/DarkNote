export function generateNotePath(noteId: string, notebookId: string) {
  return `/note/${notebookId}-${noteId}`;
}

// Get the note from the path
export function retrieveFromPath(path: string) {
  const pathWithoutNote = path.replace("/note/", "");
  const [notebookId, noteId] = pathWithoutNote.split("-");

  return {
    notebookId,
    noteId,
  };
}
