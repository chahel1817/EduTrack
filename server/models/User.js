import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: { type: String, required: true },

    role: {
      type: String,
      enum: ["student", "teacher"],
      default: "student",
    },

    age: { type: Number, default: null },
    phone: { type: String, default: "" },
    photo: { type: String, default: "" },
    linkedin: { type: String, default: "" },
    github: { type: String, default: "" },
    location: { type: String, default: "" },
    skills: { type: [String], default: [] },
    bio: { type: String, default: "" },

    /* OTP RESET */
    resetOTP: { type: String, default: null },
    resetOTPExpiry: { type: Date, default: null },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
