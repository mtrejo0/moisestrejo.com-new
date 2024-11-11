import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  comment: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  likes: {
    type: Number,
    default: 0,
  },
});

export const Comment =
  mongoose.models.Comment || mongoose.model("Comment", CommentSchema);
