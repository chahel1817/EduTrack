# TODO: Implement Forgot Password Flow

## Steps to Complete

- [ ] Modify src/pages/Login.jsx: Remove OTP login logic (otp state, step state, sendOTP, verifyOTP functions), replace "Forgot password? Login with OTP" with a Link to "/forgot-password"
- [ ] Add forgotPassword controller in server/controllers/authController.js: Generate 6-digit OTP, set resetOTP and resetOTPExpiry (10 minutes), send email via sendEmail.js
- [ ] Add verifyOTP controller in server/controllers/authController.js: Check if OTP matches and not expired, generate JWT token, clear resetOTP and resetOTPExpiry
- [ ] Add routes in server/routes/authRoutes.js: POST /forgot-password -> forgotPassword, POST /verify-otp -> verifyOTP

## Followup Steps
- [ ] Test the flow: Navigate to login, click Forgot Password, enter email, submit, check email for OTP, enter OTP on verify page, redirect to dashboard
- [ ] Ensure OTP emails are sent correctly (check console for preview URL)
