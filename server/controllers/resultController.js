import Result from "../models/Result.js";
import Quiz from "../models/Quiz.js";

/* --------------------------------------------------------
   SUBMIT QUIZ (Student)
-------------------------------------------------------- */
export const submitResult = async (req, res) => {
  try {
    if (req.user.role !== "student") {
      return res.status(403).json({ message: "Only students can submit quizzes" });
    }

    const { quiz, score, total, answers, timeSpent } = req.body;

    if (!quiz || !answers || total === undefined) {
      return res.status(400).json({ message: "Missing required data" });
    }

    // Prevent duplicate attempts
    const existing = await Result.findOne({
      quiz,
      student: req.user.id,
    });

    if (existing) {
      return res.status(400).json({ message: "Quiz already submitted" });
    }

    const percentage = Math.round((score / total) * 100);

    const result = await Result.create({
      quiz,
      student: req.user.id,
      score,
      total,
      percentage,
      timeSpent: Math.round(timeSpent / 60), // seconds → minutes
      answers,
    });

    return res.status(201).json(result);
  } catch (error) {
    console.error("Submit Result Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

/* --------------------------------------------------------
   GET RESULTS BY QUIZ (Teacher)
-------------------------------------------------------- */
export const getResultsByQuiz = async (req, res) => {
  try {
    console.log("📊 Get Results By Quiz - Request received");
    console.log("User:", req.user?.id, "Role:", req.user?.role);
    
    // Only teachers can view quiz results
    if (req.user.role !== "teacher") {
      console.log("❌ Access denied - Not a teacher");
      return res.status(403).json({ message: "Access denied. Only teachers can view quiz results." });
    }

    const { id } = req.params;
    console.log("Quiz ID:", id);

    if (!id) {
      return res.status(400).json({ message: "Quiz ID is required" });
    }

    // Check if the quiz exists and belongs to the teacher
    const quiz = await Quiz.findById(id).populate("createdBy", "_id");
    if (!quiz) {
      console.log("❌ Quiz not found:", id);
      return res.status(404).json({ message: "Quiz not found" });
    }
    
    console.log("Quiz found:", quiz.title);
    console.log("Quiz createdBy:", quiz.createdBy);
    console.log("User ID:", req.user.id);
    
    // Check ownership - handle both ObjectId and string comparisons
    const createdById = quiz.createdBy?._id?.toString() || quiz.createdBy?.toString();
    const userId = req.user.id?.toString() || req.user._id?.toString();
    
    console.log("CreatedBy ID:", createdById);
    console.log("User ID:", userId);
    console.log("Match:", createdById === userId);
    
    if (createdById !== userId) {
      console.log("❌ Unauthorized - Quiz doesn't belong to teacher");
      return res.status(403).json({ 
        message: "Unauthorized. You can only view results for quizzes you created." 
      });
    }

    const results = await Result.find({ quiz: id })
      .populate("student", "name email")
      .sort({ createdAt: -1 });

    console.log("✅ Results found:", results.length);
    return res.json(results);
  } catch (error) {
    console.error("❌ Get Results By Quiz Error:", error);
    console.error("Error stack:", error.stack);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

/* --------------------------------------------------------
   GET STUDENT RESULTS (Logged-in Student)
-------------------------------------------------------- */
export const getStudentResults = async (req, res) => {
  try {
   console.log("👤 Student ID:", req.user.id);

const results = await Result.find({ student: req.user.id })
  .populate("quiz", "title subject")
  .sort({ createdAt: -1 });

console.log("📊 Student results found:", results.length);

    return res.json(results);
  } catch (error) {
    console.error("Get Student Results Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

/* --------------------------------------------------------
   GET ALL RESULTS (Teacher Dashboard)
-------------------------------------------------------- */
export const getAllResults = async (req, res) => {
  try {
    if (req.user.role !== "teacher") {
      return res.status(403).json({ message: "Access denied" });
    }

    const results = await Result.find()
  .populate({
    path: "quiz",
    select: "title subject createdBy", // 🔥 createdBy is REQUIRED
  })
  .populate("student", "name email")
  .sort({ createdAt: -1 });

// 🔐 Filter ONLY quizzes created by this teacher
const teacherResults = results.filter(
  (r) => String(r.quiz?.createdBy) === String(req.user.id)
);

console.log("👨‍🏫 Teacher ID:", req.user.id);
console.log("📊 Total results in DB:", results.length);
console.log("✅ Teacher results found:", teacherResults.length);

return res.json(teacherResults);

  } catch (error) {
    console.error("Get All Results Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
