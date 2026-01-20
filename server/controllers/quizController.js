import Quiz from "../models/Quiz.js";

/* --------------------------------------------------------
   CREATE QUIZ (Teacher)
-------------------------------------------------------- */
export const createQuiz = async (req, res) => {
  try {
    console.log("📝 Create Quiz - Request received");
    console.log("User:", req.user?.id, "Role:", req.user?.role);

    if (req.user.role !== "teacher") {
      console.log("❌ User is not a teacher");
      return res.status(403).json({ message: "Only teachers can create quizzes" });
    }

    const {
      title,
      subject,
      description,
      questions,
      timeLimit,
      enableQuestionTimeLimit,
      questionTimeLimit,
      allowMultipleAttempts,
      startDate,
      endDate,
    } = req.body;

    console.log("Quiz data:", {
      title,
      subject,
      description,
      questionsCount: questions?.length,
      timeLimit,
      enableQuestionTimeLimit,
      allowMultipleAttempts,
      startDate,
      endDate
    });

    if (!title || !subject || !questions || questions.length === 0) {
      console.log("❌ Missing required fields");
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Validate dates if provided
    if (startDate && endDate && new Date(startDate) >= new Date(endDate)) {
      return res.status(400).json({ message: "End date must be after start date" });
    }

    // Validate questions structure
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      console.log(`Question ${i + 1}:`, q);
      if (!q.question?.trim()) {
        console.log(`❌ Question ${i + 1} has no text`);
        return res.status(400).json({ message: `Question ${i + 1} is missing text` });
      }
      if (!q.options || q.options.length < 2) {
        console.log(`❌ Question ${i + 1} has insufficient options`);
        return res.status(400).json({ message: `Question ${i + 1} needs at least 2 options` });
      }
      if (q.correctAnswer === null || q.correctAnswer === undefined || q.correctAnswer < 0 || q.correctAnswer >= q.options.length) {
        console.log(`❌ Question ${i + 1} has invalid correct answer`);
        return res.status(400).json({ message: `Question ${i + 1} has invalid correct answer` });
      }
    }

    const quiz = await Quiz.create({
      title,
      subject,
      description,
      questions,
      timeLimit,
      enableQuestionTimeLimit,
      questionTimeLimit,
      allowMultipleAttempts: allowMultipleAttempts || false,
      startDate: startDate || null,
      endDate: endDate || null,
      createdBy: req.user.id,
    });

    console.log("✅ Quiz created successfully:", quiz._id);
    return res.status(201).json(quiz);
  } catch (error) {
    console.error("❌ Create Quiz Error:", error);
    console.error("Error details:", error.message);
    console.error("Error stack:", error.stack);
    return res.status(500).json({ message: error.message || "Server error" });
  }
};

/* --------------------------------------------------------
   GET ALL QUIZZES (Student + Teacher)
-------------------------------------------------------- */
export const getAllQuizzes = async (req, res) => {
  try {
    console.log("📚 Get All Quizzes - Request received");
    console.log("User:", req.user?.id, "Role:", req.user?.role);

    const quizzes = await Quiz.find()
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    console.log(`✅ Found ${quizzes.length} quizzes`);
    quizzes.forEach((quiz, index) => {
      console.log(`  ${index + 1}. ${quiz.title} (ID: ${quiz._id}) - Created by: ${quiz.createdBy?.name || quiz.createdBy}`);
    });

    return res.json(quizzes);
  } catch (error) {
    console.error("❌ Get All Quizzes Error:", error);
    console.error("Error stack:", error.stack);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

/* --------------------------------------------------------
   GET SINGLE QUIZ
-------------------------------------------------------- */
export const getQuizById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("📝 Get Quiz By ID - Request received");
    console.log("Quiz ID:", id);
    console.log("User:", req.user?.id, "Role:", req.user?.role);

    if (!id) {
      return res.status(400).json({ message: "Quiz ID is required" });
    }

    const quiz = await Quiz.findById(id)
      .populate("createdBy", "name email");

    if (!quiz) {
      console.log("❌ Quiz not found:", id);
      return res.status(404).json({ message: "Quiz not found" });
    }

    console.log("✅ Quiz found:", quiz.title);
    return res.json(quiz);
  } catch (error) {
    console.error("❌ Get Quiz Error:", error);
    console.error("Error stack:", error.stack);

    // Handle invalid ObjectId format
    if (error.name === 'CastError') {
      return res.status(400).json({ message: "Invalid quiz ID format" });
    }

    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

/* --------------------------------------------------------
   DELETE QUIZ (Teacher)
-------------------------------------------------------- */
export const deleteQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    if (quiz.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await quiz.deleteOne();
    return res.json({ message: "Quiz deleted successfully" });
  } catch (error) {
    console.error("Delete Quiz Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
