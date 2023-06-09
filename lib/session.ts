const PROTECTION_TOKENS_KEY = "protectionTokens";

export type ProtectionToken = {
  id: string;
  token: string;
};

// Add the token to the session storage
// But if the token already exists, replace it
export function addProtectionToken(id: string, token: string): void {
  const tokens = getProtectionTokens();
  const tokenIndex = tokens.findIndex((token) => token.id === id);

  if (tokenIndex === -1) {
    tokens.push({ id, token });
  } else {
    tokens[tokenIndex].token = token;
  }

  sessionStorage.setItem(PROTECTION_TOKENS_KEY, JSON.stringify(tokens));
}

export function getProtectionTokens(): ProtectionToken[] {
  const tokensString = sessionStorage.getItem(PROTECTION_TOKENS_KEY);
  if (tokensString) {
    return JSON.parse(tokensString);
  } else {
    return [];
  }
}

export function getProtectionTokenById(id: string): string | null {
  const tokens = getProtectionTokens();
  const matchingToken = tokens.find((token) => token.id === id);
  return matchingToken ? matchingToken.token : null;
}
