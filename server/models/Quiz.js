import mongoose from "mongoose";

/* -------------------------------------------------------
   QUESTION SCHEMA
-------------------------------------------------------- */
const questionSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: [true, "Question text is required"],
      trim: true,
      minlength: [5, "Question must be at least 5 characters"]
    },

    options: {
      type: [String],
      required: true,
      validate: {
        validator: (arr) => arr.length >= 2,
        message: "At least two options are required"
      }
    },

    correctAnswer: {
      type: Number,
      required: true,
      min: [0, "Correct answer index cannot be negative"],
    },

    points: {
      type: Number,
      default: 1,
      min: [1, "Minimum 1 point is required"],
    }
  },
  { _id: false }
);

/* -------------------------------------------------------
   QUIZ SCHEMA
-------------------------------------------------------- */
const quizSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Quiz title is required"],
      trim: true,
      minlength: [3, "Title must be at least 3 characters"]
    },

    subject: {
      type: String,
      required: [true, "Subject is required"],
      trim: true,
    },

    description: {
      type: String,
      trim: true,
      default: ""
    },

    questions: {
      type: [questionSchema],
      validate: {
        validator: (arr) => arr.length > 0,
        message: "A quiz must have at least one question"
      }
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    timeLimit: {
      type: Number,
      default: 30,
      min: [1, "Minimum time is 1 minute"],
      max: [180, "Time cannot exceed 3 hours"]
    },

    isActive: {
      type: Boolean,
      default: true
    },

    totalPoints: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

/* -------------------------------------------------------
   AUTO-CALCULATE TOTAL POINTS
-------------------------------------------------------- */
quizSchema.pre("save", function (next) {
  this.totalPoints = this.questions.reduce(
    (sum, q) => sum + (q.points || 1),
    0
  );
  next();
});

/* -------------------------------------------------------
   INDEXES FOR PERFORMANCE
-------------------------------------------------------- */
quizSchema.index({ createdBy: 1 });
quizSchema.index({ subject: 1 });
quizSchema.index({ isActive: 1 });

export default mongoose.model("Quiz", quizSchema);
