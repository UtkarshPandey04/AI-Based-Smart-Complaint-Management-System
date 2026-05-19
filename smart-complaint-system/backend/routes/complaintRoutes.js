const express = require("express");
const router = express.Router();
const {
  addComplaint,
  getAllComplaints,
  getComplaintById,
  updateComplaintStatus,
  deleteComplaint,
  searchByLocation,
} = require("../controllers/complaintController");
const { protect } = require("../middleware/authMiddleware");
const {
  complaintValidation,
  validate,
} = require("../middleware/validationMiddleware");

// GET /api/complaints/search?location=Ghaziabad  (must be before /:id)
router.get("/search", searchByLocation);

// GET /api/complaints
router.get("/", getAllComplaints);

// POST /api/complaints
router.post("/", complaintValidation, validate, addComplaint);

// GET /api/complaints/:id
router.get("/:id", getComplaintById);

// PUT /api/complaints/:id
router.put("/:id", protect, updateComplaintStatus);

// DELETE /api/complaints/:id
router.delete("/:id", protect, deleteComplaint);

module.exports = router;
