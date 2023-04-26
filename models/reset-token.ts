import { ResetTokenType } from "./../types/data/reset-token";
import mongoose, { Schema } from "mongoose";
import crypto from "crypto";

const resetTokenSchema = new Schema<ResetTokenType>({
  email: {
    type: String,
    required: true,
  },
  token: String,
  expires: Date,
});

resetTokenSchema.pre("save", function (next) {
  // Generate random token
  const token = crypto.randomBytes(32).toString("hex");

  // Generate expiration date
  const expires = new Date();
  expires.setHours(expires.getHours() + 1);

  // Set token and expiration date
  this.token = token;
  this.expires = expires;

  next();
});

const ResetToken =
  mongoose.models.ResetToken || mongoose.model("ResetToken", resetTokenSchema);

export default ResetToken;
