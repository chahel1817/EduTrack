import Feedback from "../models/Feedback.js";
import asyncHandler from "../utils/asyncHandler.js";

/**
 * @desc    Submit user feedback
 * @route   POST /api/feedback
 * @access  Public (Optional User)
 */
export const submitFeedback = asyncHandler(async (req, res) => {
  const { name, email, userId, category, rating, subject, message } = req.body;

  // Manual validation for core fields
  if (!name || !email || !subject || !message) {
    return res.status(400).json({
      success: false,
      message: "Please fill in all core fields (name, email, subject, message)"
    });
  }

  const feedback = await Feedback.create({
    name,
    email,
    userId: userId || null,
    category: category || 'other',
    rating: Number(rating) || 5,
    subject,
    message,
  });

  res.status(201).json({
    success: true,
    message: "Feedback submitted successfully! Thank you for your help.",
    data: feedback,
  });
});
