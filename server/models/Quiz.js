import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
  },
  options: {
    type: [String],
    required: true,
    validate: (v) => v.length >= 2,
  },
  correctAnswer: {
    type: Number, // index of option
    required: true,
  },
  points: {
    type: Number,
    default: 1,
  },
  timeLimit: {
    type: Number, // seconds (optional per question)
    default: null,
  },
  category: {
    type: String,
    default: "General",
  },
});

const quizSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    subject: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    questions: {
      type: [questionSchema],
      required: true,
    },
    timeLimit: {
      type: Number, // minutes (whole quiz)
      default: null,
    },
    enableQuestionTimeLimit: {
      type: Boolean,
      default: false,
    },
    questionTimeLimit: {
      type: Number, // seconds (default for all questions)
      default: null,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    allowMultipleAttempts: {
      type: Boolean,
      default: false,
    },
    allowBack: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Quiz", quizSchema);
