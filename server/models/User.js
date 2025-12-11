import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [50, "Name cannot exceed 50 characters"]
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Please provide a valid email address"
      ]
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"]
      // NOTE: hashed password is stored here
    },

    role: {
      type: String,
      enum: ["student", "teacher"],
      default: "student"
    },

    age: {
      type: Number,
      min: [10, "Age must be at least 10"],
      max: [100, "Age must be under 100"]
    },

    phone: {
      type: String,
      trim: true,
      match: [
        /^[0-9]{10}$/,
        "Phone must be a valid 10-digit number"
      ]
    }
  },

  {
    timestamps: true
  }
);

// Index is already created by unique: true on email field

// Export model
export default mongoose.model("User", userSchema);
