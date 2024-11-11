import mongoose from "mongoose";

const ProjectSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  likeCount: {
    type: Number,
    default: 0,
  },
});

export const Project =
  mongoose.models.Project || mongoose.model("Project", ProjectSchema);
