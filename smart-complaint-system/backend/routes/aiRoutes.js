const express = require("express");
const router = express.Router();
const { analyzeComplaint, analyzeComplaintById } = require("../controllers/aiController");
const { protect } = require("../middleware/authMiddleware");

// POST /api/ai/analyze
router.post("/analyze", analyzeComplaint);

// POST /api/ai/analyze/:id  (analyze existing complaint by ID)
router.post("/analyze/:id", protect, analyzeComplaintById);

module.exports = router;
