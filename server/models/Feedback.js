import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    category: {
      type: String,
      enum: ["bug", "feature", "praise", "help", "other"],
      default: "other"
    },
    rating: { type: Number, min: 1, max: 5, default: 5 },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { collection: "feedback", timestamps: true }
);

export default mongoose.model("Feedback", feedbackSchema);
