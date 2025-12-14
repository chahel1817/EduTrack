import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import supabase from "./config/supabase.js";
import authRoutes from "./routes/authRoutes.js";
import quizRoutes from "./routes/quizRoutes.js";
import resultRoutes from "./routes/resultRoutes.js";

dotenv.config({ path: './.env' });

console.log("MONGO_URI:", process.env.MONGO_URI);

if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = "your_jwt_secret_key_here_make_it_very_secure_and_long_minimum_32_characters";
}

<<<<<<< HEAD
const seedDemoUsers = async () => {
  try {
    const User = (await import('./models/User.js')).default;
    const bcrypt = (await import('bcryptjs')).default;

    const demoUsers = [
      { name: 'Demo Student', email: 'student@demo.com', password: 'demo123', role: 'student' },
      { name: 'Demo Teacher', email: 'teacher@demo.com', password: 'demo123', role: 'teacher' }
    ];

    for (const user of demoUsers) {
      const existing = await User.findOne({ email: user.email });
      if (!existing) {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        await User.create({ ...user, password: hashedPassword });
        console.log(`✅ Created demo user: ${user.email}`);
      }
    }
  } catch (error) {
    console.error('❌ Error seeding demo users:', error);
  }
};

const seedDemoQuizzes = async () => {
  try {
    const Quiz = (await import('./models/Quiz.js')).default;
    const User = (await import('./models/User.js')).default;

    // Find the demo teacher
    const teacher = await User.findOne({ email: 'teacher@demo.com' });
    if (!teacher) {
      console.log('❌ Demo teacher not found, skipping quiz seeding');
      return;
    }

    const demoQuizzes = [
      {
        title: 'JavaScript Fundamentals',
        subject: 'Programming',
        description: 'Test your knowledge of JavaScript basics including variables, functions, and data types.',
        questions: [
          {
            question: 'What is the correct way to declare a variable in JavaScript?',
            options: ['var myVar;', 'variable myVar;', 'v myVar;', 'declare myVar;'],
            correctAnswer: 0,
            points: 1
          },
          {
            question: 'Which of the following is NOT a JavaScript data type?',
            options: ['string', 'boolean', 'integer', 'undefined'],
            correctAnswer: 2,
            points: 1
          },
          {
            question: 'What does the === operator do in JavaScript?',
            options: ['Assignment', 'Comparison with type coercion', 'Strict equality comparison', 'Logical AND'],
            correctAnswer: 2,
            points: 1
          }
        ],
        timeLimit: 10,
        enableQuestionTimeLimit: false,
        createdBy: teacher._id
      },
      {
        title: 'React Basics',
        subject: 'Web Development',
        description: 'Learn the fundamentals of React including components, props, and state.',
        questions: [
          {
            question: 'What is JSX?',
            options: ['A JavaScript framework', 'A syntax extension for JavaScript', 'A CSS preprocessor', 'A database query language'],
            correctAnswer: 1,
            points: 1
          },
          {
            question: 'Which hook is used to manage state in functional components?',
            options: ['useEffect', 'useState', 'useContext', 'useReducer'],
            correctAnswer: 1,
            points: 1
          },
          {
            question: 'What is the purpose of the key prop in React lists?',
            options: ['To style list items', 'To help React identify which items have changed', 'To set the list order', 'To make lists sortable'],
            correctAnswer: 1,
            points: 1
          }
        ],
        timeLimit: 15,
        enableQuestionTimeLimit: false,
        createdBy: teacher._id
      },
      {
        title: 'Database Design Principles',
        subject: 'Database Management',
        description: 'Understanding the core principles of database design and normalization.',
        questions: [
          {
            question: 'What is the primary goal of database normalization?',
            options: ['To make queries faster', 'To reduce data redundancy', 'To increase storage space', 'To complicate the schema'],
            correctAnswer: 1,
            points: 1
          },
          {
            question: 'Which normal form ensures that all non-key attributes are fully dependent on the primary key?',
            options: ['1NF', '2NF', '3NF', 'BCNF'],
            correctAnswer: 2,
            points: 1
          },
          {
            question: 'What is a foreign key?',
            options: ['A key that opens the database', 'A key that references a primary key in another table', 'A key used for encryption', 'A key that is always unique'],
            correctAnswer: 1,
            points: 1
          }
        ],
        timeLimit: 12,
        enableQuestionTimeLimit: false,
        createdBy: teacher._id
      }
    ];

    for (const quizData of demoQuizzes) {
      const existing = await Quiz.findOne({ title: quizData.title });
      if (!existing) {
        await Quiz.create(quizData);
        console.log(`✅ Created demo quiz: ${quizData.title}`);
      }
    }
  } catch (error) {
    console.error('❌ Error seeding demo quizzes:', error);
  }
};
=======
const testSupabaseConnection = async () => {
  try {
    const { data, error } = await supabase.from("users").select("count").limit(1);
    if (error && error.code !== 'PGRST116') {
      console.error("Supabase connection error:", error.message);
    } else {
      console.log("✓ Supabase database connected successfully");
    }
  } catch (err) {
    console.error("Failed to connect to Supabase:", err.message);
  }
};

testSupabaseConnection();
>>>>>>> b88a038d8fd3994e1d8e412b28adc53c774f02e5

const app = express();
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true
}));

app.use("/api/auth", authRoutes);
app.use("/api/quizzes", quizRoutes);
app.use("/api/results", resultRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "EduTrack API v2.0 - Powered by Supabase",
    status: "running",
    timestamp: new Date().toISOString()
  });
});

app.get("/api/health", (req, res) => {
  res.json({ status: "healthy", database: "supabase" });
});

app.use((err, req, res, next) => {
  console.error("Server error:", err);
  res.status(500).json({ message: "Internal server error" });
});

const PORT = process.env.PORT || 5000;
<<<<<<< HEAD

const startServer = async () => {
  await connectDB();
  await seedDemoUsers();
  await seedDemoQuizzes();
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
};

startServer();
=======
app.listen(PORT, () => {
  console.log(`\n🚀 EduTrack Server v2.0`);
  console.log(`📍 Running on port ${PORT}`);
  console.log(`🗄️  Database: Supabase PostgreSQL`);
  console.log(`✨ Ready to accept requests\n`);
});
>>>>>>> b88a038d8fd3994e1d8e412b28adc53c774f02e5
