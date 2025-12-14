# EduTrack v2.0 - Complete Setup Guide

Welcome to EduTrack v2.0, a fully functional educational platform with quiz management, real-time results, and leaderboards!

## What's New in v2.0

### Backend Improvements
- **Supabase PostgreSQL Database** - Migrated from MongoDB to Supabase for better performance and scalability
- **Enhanced Security** - Row Level Security (RLS) policies for all tables
- **Better Validation** - Express-validator for input validation
- **Improved Error Handling** - Comprehensive error messages and logging
- **New API Endpoints** - Leaderboard, profile updates, and more

### Frontend Enhancements
- **Enhanced Dark Mode** - Consistent dark/light mode across all components
- **Leaderboard Feature** - View top performers for each quiz
- **Better UI Components** - Improved cards, tables, and interactive elements
- **Profile Editing** - Students and teachers can update their profiles
- **Responsive Design** - Works perfectly on all devices

### Database Schema
- `users` - User accounts with role-based access
- `quizzes` - Quiz metadata with difficulty levels
- `questions` - Individual quiz questions with multiple options
- `results` - Student quiz submissions and scores
- `answer_details` - Detailed answer tracking for review

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Supabase account (database is already configured)

### Backend Setup

1. **Navigate to server directory:**
   ```bash
   cd server
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Variables:**
   The `.env` file is already configured with:
   - `JWT_SECRET` - For authentication tokens
   - `PORT` - Server port (default: 5000)
   - Supabase credentials are automatically available

4. **Start the server:**
   ```bash
   npm start
   ```

   Or for development with auto-reload:
   ```bash
   npm run dev
   ```

5. **Verify server is running:**
   - Visit `http://localhost:5000`
   - You should see: "EduTrack API v2.0 - Powered by Supabase"

### Frontend Setup

1. **Navigate to project root:**
   ```bash
   cd ..
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

4. **Access the application:**
   - Open `http://localhost:5173` in your browser
   - The development server runs on port 5173 by default

### Building for Production

1. **Build the frontend:**
   ```bash
   npm run build
   ```

2. **Preview production build:**
   ```bash
   npm run preview
   ```

## Default User Accounts

To get started quickly, create test accounts:

### Teacher Account
- Email: `teacher@edutrack.com`
- Password: `teacher123`
- Role: teacher

### Student Account
- Email: `student@edutrack.com`
- Password: `student123`
- Role: student

## Features Guide

### For Teachers

1. **Create Quizzes**
   - Navigate to "Create Quiz" from the navbar
   - Add title, subject, description, and questions
   - Set difficulty level and time limit
   - Save and publish

2. **View Results**
   - Click "Results" in the navbar
   - See all student submissions
   - Filter by quiz or student
   - Export results as CSV

3. **Manage Quizzes**
   - View all your created quizzes
   - Edit or delete quizzes
   - Toggle quiz active status
   - View submission statistics

### For Students

1. **Take Quizzes**
   - Browse available quizzes
   - Click "Take Quiz" to start
   - Answer questions within time limit
   - Submit when complete

2. **View Results**
   - See your quiz history
   - Review correct/incorrect answers
   - Track your progress over time
   - View detailed performance analytics

3. **Leaderboard**
   - View top performers for each quiz
   - See your ranking
   - Compare scores with peers

### Shared Features

1. **Profile Management**
   - Update name, age, phone number
   - View account statistics
   - See achievements

2. **Dark Mode**
   - Toggle between light and dark themes
   - Consistent across all pages
   - Preference saved automatically

3. **Responsive Design**
   - Works on desktop, tablet, and mobile
   - Optimized touch interactions
   - Adaptive layouts

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new account
- `POST /api/auth/login` - Login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update profile

### Quizzes
- `GET /api/quiz` - Get all quizzes
- `GET /api/quiz/:id` - Get quiz by ID
- `POST /api/quiz` - Create quiz (teacher only)
- `PUT /api/quiz/:id` - Update quiz (teacher only)
- `DELETE /api/quiz/:id` - Delete quiz (teacher only)

### Results
- `POST /api/results` - Submit quiz result
- `GET /api/results/student` - Get student's results
- `GET /api/results/all` - Get all results (teacher only)
- `GET /api/results/quiz/:quizId` - Get results for specific quiz
- `GET /api/results/leaderboard/:quizId` - Get leaderboard

## Database Structure

### Users Table
```sql
- id (uuid)
- name (text)
- email (text, unique)
- password (text, hashed)
- role (student/teacher)
- age (integer, optional)
- phone (text, optional)
- created_at (timestamp)
- updated_at (timestamp)
```

### Quizzes Table
```sql
- id (uuid)
- title (text)
- subject (text)
- description (text)
- difficulty (easy/medium/hard)
- time_limit (integer, minutes)
- is_active (boolean)
- total_points (integer)
- created_by (uuid, foreign key)
- created_at (timestamp)
- updated_at (timestamp)
```

### Questions Table
```sql
- id (uuid)
- quiz_id (uuid, foreign key)
- question_text (text)
- options (jsonb array)
- correct_answer (integer)
- points (integer)
- order_index (integer)
```

### Results Table
```sql
- id (uuid)
- student_id (uuid, foreign key)
- quiz_id (uuid, foreign key)
- score (integer)
- total (integer)
- percentage (numeric)
- time_spent (integer, seconds)
- submitted_at (timestamp)
```

## Security Features

1. **Authentication**
   - JWT tokens with 7-day expiry
   - Bcrypt password hashing
   - Secure token storage

2. **Row Level Security (RLS)**
   - Students can only view their own results
   - Teachers can only modify their own quizzes
   - Proper access control on all tables

3. **Input Validation**
   - Server-side validation with express-validator
   - Client-side form validation
   - SQL injection prevention

4. **CORS Configuration**
   - Restricted to frontend origin
   - Credentials support enabled
   - Secure headers

## Troubleshooting

### Server won't start
- Check if port 5000 is available
- Verify Supabase environment variables
- Check Node.js version (v18+)

### Frontend can't connect to backend
- Ensure backend server is running
- Check API base URL in `src/utils/api.js`
- Verify CORS settings

### Database errors
- Check Supabase console for connection status
- Verify migrations have been applied
- Check RLS policies are correctly set

### Build errors
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Clear build cache: `rm -rf dist`
- Check for TypeScript errors

## Performance Tips

1. **Database Optimization**
   - Indexes are already created on frequently queried columns
   - Use pagination for large result sets
   - Cache frequently accessed data

2. **Frontend Optimization**
   - Code splitting is enabled by default
   - Images are optimized
   - Lazy loading for routes

3. **API Optimization**
   - Use select statements to fetch only needed fields
   - Implement request debouncing
   - Use proper HTTP caching headers

## Contributing

To contribute to EduTrack:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Write tests
5. Submit a pull request

## Support

For issues or questions:
- Open an issue on GitHub
- Contact: support@edutrack.com
- Documentation: docs.edutrack.com

## License

MIT License - see LICENSE file for details

## Credits

Built with:
- React & Vite
- Express.js
- Supabase PostgreSQL
- Lucide Icons
- And many other amazing open-source libraries

---

**EduTrack v2.0** - Transforming education through technology
