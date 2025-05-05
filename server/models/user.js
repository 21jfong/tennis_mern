import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: false },
  imageURL: { type: String, required: false },
  googleId: { type: String, required: false },
  location: { type: String, required: false },
  racket: { type: String, required: false },
  utr: { type: Number, required: false },
  bio: { type: String, required: false, max_length: 500 },
});

export default mongoose.model("User", userSchema);
