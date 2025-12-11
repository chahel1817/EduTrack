import mongoose from "mongoose";

const answerSchema = new mongoose.Schema(
  {
    questionIndex: {
      type: Number,
      required: [true, "Question index is required"]
    },

    selectedAnswer: {
      type: Number,
      required: [true, "Selected answer index is required"]
    },

    isCorrect: {
      type: Boolean,
      required: true
    },

    points: {
      type: Number,
      default: 0,
      min: 0
    }
  },
  { _id: false }
);

const resultSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    quiz: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quiz",
      required: true,
      index: true
    },

    score: {
      type: Number,
      required: true,
      min: 0
    },

    total: {
      type: Number,
      required: true,
      min: 1
    },

    answers: {
      type: [answerSchema],
      default: []
    },

    submittedAt: {
      type: Date,
      default: Date.now
    },

    timeSpent: {
      type: Number,
      default: 0, // minutes
      min: 0
    },

    percentage: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

/* -------------------------------------------------------
   AUTO-CALCULATE PERCENTAGE BEFORE SAVE
-------------------------------------------------------- */
resultSchema.pre("save", function (next) {
  if (this.total > 0) {
    this.percentage = Number(((this.score / this.total) * 100).toFixed(1));
  } else {
    this.percentage = 0;
  }
  next();
});

/* -------------------------------------------------------
   PREVENT MULTIPLE SUBMISSIONS (optional but smart)
-------------------------------------------------------- */
resultSchema.index({ student: 1, quiz: 1 }, { unique: true });

/* -------------------------------------------------------
   EXPORT MODEL
-------------------------------------------------------- */
export default mongoose.model("Result", resultSchema);
