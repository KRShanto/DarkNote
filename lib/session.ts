const NOTES_PROTECTION_TOKENS_KEY = "notesProtectionTokens";
const NOTEBOOKS_PROTECTION_TOKENS_KEY = "notebooksProtectionTokens";

export type ProtectionToken = {
  id: string;
  token: string;
};

export function addNoteProtectionToken(id: string, token: string): void {
  const tokens = getNotesProtectionTokens();
  tokens.push({ id, token });
  sessionStorage.setItem(NOTES_PROTECTION_TOKENS_KEY, JSON.stringify(tokens));
}

export function addNotebookProtectionToken(id: string, token: string): void {
  const tokens = getNotebooksProtectionTokens();
  tokens.push({ id, token });
  sessionStorage.setItem(
    NOTEBOOKS_PROTECTION_TOKENS_KEY,
    JSON.stringify(tokens)
  );
}

export function getNotesProtectionTokens(): ProtectionToken[] {
  const tokensString = sessionStorage.getItem(NOTES_PROTECTION_TOKENS_KEY);
  if (tokensString) {
    return JSON.parse(tokensString);
  } else {
    return [];
  }
}

export function getNotebooksProtectionTokens(): ProtectionToken[] {
  const tokensString = sessionStorage.getItem(NOTEBOOKS_PROTECTION_TOKENS_KEY);
  if (tokensString) {
    return JSON.parse(tokensString);
  } else {
    return [];
  }
}

export function getNoteProtectionTokenById(id: string): string | null {
  const tokens = getNotesProtectionTokens();
  const matchingToken = tokens.find((token) => token.id === id);
  return matchingToken ? matchingToken.token : null;
}

export function getNotebookProtectionTokenById(id: string): string | null {
  const tokens = getNotebooksProtectionTokens();
  const matchingToken = tokens.find((token) => token.id === id);
  return matchingToken ? matchingToken.token : null;
}
