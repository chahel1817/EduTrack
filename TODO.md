# Quiz Generation Fix - TODO List

## Current Issue
- Quiz creation generates placeholder questions like "Js (Medium) – Question 1?" instead of real-world questions
- AI is falling back to FALLBACK_QUESTIONS due to API failures

## Tasks Completed
- [x] Created new server/.env template file
- [x] Updated AI prompt to generate real-world, practical questions

## Remaining Tasks
- [ ] User needs to add OPENROUTER_API_KEY to server/.env
- [ ] Test AI quiz generation after API key is configured
- [ ] Improve error handling and fallback logic if needed
- [ ] Verify questions are generating properly in teacher portal

## Next Steps
1. User: Add your OpenRouter API key to server/.env
2. Test: Try creating a quiz with AI generation
3. If issues persist: Check server logs for AI errors
4. Optional: Consider upgrading to a more reliable AI model
