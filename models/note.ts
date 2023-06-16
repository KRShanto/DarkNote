import { INote } from "@/types/data/note";
import mongoose, { Schema } from "mongoose";
import crypto from "crypto";

const NoteSchema = new Schema<INote>({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    default: "",
  },
  textContent: {
    type: String,
    default: "",
  },
  notebookId: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  iv: { type: String, required: false },
});

/*

// encrypt textContent and content
NoteSchema.pre<INote>("save", function (next) {
  const content = this.content;
  const textContent = this.textContent;

  // Generate a random initialization vector
  const iv = crypto.randomBytes(16);
  
  // Encrypt the contents using AES-256-CBC encryption
  const cipher = crypto.createCipheriv(
    "aes-256-cbc",
    Buffer.from(process.env.PROTECTION_KEY as string),
    iv
    );
    
    let encryptedContent = cipher.update(content, "utf8", "hex");
    let encryptedTextContent = cipher.update(textContent, "utf8", "hex");
    
    encryptedContent += cipher.final("hex");
  encryptedTextContent += cipher.final("hex");
  
  // Store the encrypted contents
  this.content = encryptedContent;
  this.textContent = encryptedTextContent;
  this.iv = iv.toString("hex");
  
  next();
});
*/

const Note = mongoose.models.Note || mongoose.model("Note", NoteSchema);

export default Note;
