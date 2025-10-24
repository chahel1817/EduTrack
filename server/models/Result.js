import mongoose from "mongoose";

const resultSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  quiz: { type: mongoose.Schema.Types.ObjectId, ref: "Quiz", required: true },
  score: { type: Number, required: true },
  total: { type: Number, required: true },
  answers: [{
    questionIndex: { type: Number, required: true },
    selectedAnswer: { type: Number, required: true },
    isCorrect: { type: Boolean, required: true },
    points: { type: Number, default: 0 }
  }],
  submittedAt: { type: Date, default: Date.now },
  timeSpent: { type: Number, default: 0 }, // in minutes
  percentage: { type: Number, required: true }
}, {
  timestamps: true
});

// Calculate percentage before saving
resultSchema.pre('save', function(next) {
  this.percentage = Math.round((this.score / this.total) * 100);
  next();
});

export default mongoose.model("Result", resultSchema);
