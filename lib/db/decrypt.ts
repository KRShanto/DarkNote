import { INote } from "@/types/data/note";
import crypto from "crypto";

// Decrypt `content` and `textContent` of a note
export function decrypt(note: INote) {
  const key = process.env.PROTECTION_KEY as string;
  const content = note.content;
  const textContent = note.textContent;
  const iv = Buffer.from(note.iv, "hex");

  // Decrypt the content using AES-256-CBC decryption
  const contentDecipher = crypto.createDecipheriv(
    "aes-256-cbc",
    Buffer.from(key),
    iv
  );

  let decryptedContent = contentDecipher.update(content, "hex", "utf-8");
  decryptedContent += contentDecipher.final("utf-8");

  // Decrypt the text content using AES-256-CBC decryption
  const textContentDecipher = crypto.createDecipheriv(
    "aes-256-cbc",
    Buffer.from(key),
    iv
  );

  let decryptedTextContent = textContentDecipher.update(
    textContent,
    "hex",
    "utf8"
  );
  decryptedTextContent += textContentDecipher.final("utf8");

  return {
    decryptedContent,
    decryptedTextContent,
  };
}
