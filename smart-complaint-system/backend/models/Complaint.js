const mongoose = require("mongoose");

const ComplaintSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false, // allow guest submissions too
    },
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
      lowercase: true,
      trim: true,
    },
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      minlength: [5, "Title must be at least 5 characters"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      minlength: [10, "Description must be at least 10 characters"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: [
        "Water Supply",
        "Electricity",
        "Roads & Infrastructure",
        "Sanitation & Garbage",
        "Public Safety",
        "Healthcare",
        "Education",
        "Transportation",
        "Other",
      ],
    },
    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
    },
    status: {
      type: String,
      enum: ["Pending", "In Progress", "Resolved", "Rejected"],
      default: "Pending",
    },
    // AI-generated fields
    aiAnalysis: {
      priority: {
        type: String,
        enum: ["Low", "Medium", "High", "Critical"],
        default: null,
      },
      department: { type: String, default: null },
      summary: { type: String, default: null },
      autoResponse: { type: String, default: null },
      analyzedAt: { type: Date, default: null },
    },
  },
  { timestamps: true }
);

// Indexes for efficient querying
ComplaintSchema.index({ location: 1 });
ComplaintSchema.index({ category: 1 });
ComplaintSchema.index({ status: 1 });
ComplaintSchema.index({ createdAt: -1 });

module.exports = mongoose.model("Complaint", ComplaintSchema);
