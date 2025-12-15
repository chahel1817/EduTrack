# TODO: Remove Supabase and Switch to MongoDB Only

## Tasks
- [x] Remove @supabase/supabase-js from server/package.json
- [x] Update server/index.js: remove Supabase import and update health check
- [x] Update server/routes/authRoutes.js: replace Supabase with User model
- [x] Update server/routes/quizRoutes.js: replace Supabase with Quiz model
- [ ] Update server/routes/resultRoutes.js: replace Supabase with Result model
- [ ] Remove supabase folder
- [ ] Run npm install in server directory
- [ ] Test the application
