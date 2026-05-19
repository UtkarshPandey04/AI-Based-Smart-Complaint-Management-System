const axios = require("axios");
const Complaint = require("../models/Complaint");

// Call Anthropic Claude API
const callAnthropicAI = async (prompt) => {
  const response = await axios.post(
    "https://api.anthropic.com/v1/messages",
    {
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      messages: [{ role: "user", content: prompt }],
    },
    {
      headers: {
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
        "Content-Type": "application/json",
      },
    }
  );
  return response.data.content[0].text;
};

// Parse AI JSON response safely
const parseAIResponse = (text) => {
  try {
    // Strip markdown fences if present
    const cleaned = text.replace(/```json|```/g, "").trim();
    return JSON.parse(cleaned);
  } catch {
    return null;
  }
};

// @desc    Analyze complaint with AI
// @route   POST /api/ai/analyze
// @access  Public
const analyzeComplaint = async (req, res, next) => {
  try {
    const { title, description, category, location, complaintId } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: "Title and description are required for AI analysis",
      });
    }

    const prompt = `You are an AI assistant for a government complaint management system in India. Analyze the following complaint and respond ONLY with a valid JSON object (no markdown, no extra text).

Complaint Details:
- Title: ${title}
- Category: ${category || "General"}
- Location: ${location || "Not specified"}
- Description: ${description}

Return this exact JSON structure:
{
  "priority": "<Low|Medium|High|Critical>",
  "department": "<exact department name responsible>",
  "summary": "<2-3 sentence summary of the complaint>",
  "autoResponse": "<professional response message to the complainant, 3-4 sentences>",
  "estimatedResolutionDays": <number>,
  "tags": ["<tag1>", "<tag2>", "<tag3>"]
}

Priority guidelines:
- Critical: life threatening, major infrastructure failure, medical emergency
- High: significant disruption affecting many people, urgent safety issue
- Medium: moderate inconvenience, affects a neighborhood
- Low: minor issue, cosmetic problems`;

    const aiText = await callAnthropicAI(prompt);
    const analysis = parseAIResponse(aiText);

    if (!analysis) {
      return res.status(500).json({
        success: false,
        message: "AI returned invalid response. Please try again.",
      });
    }

    // Save AI analysis to complaint if complaintId is provided
    if (complaintId) {
      await Complaint.findByIdAndUpdate(complaintId, {
        aiAnalysis: {
          priority: analysis.priority,
          department: analysis.department,
          summary: analysis.summary,
          autoResponse: analysis.autoResponse,
          analyzedAt: new Date(),
        },
      });
    }

    res.json({
      success: true,
      message: "Complaint analyzed successfully",
      data: analysis,
    });
  } catch (error) {
    if (error.response?.status === 401) {
      return res.status(500).json({
        success: false,
        message: "Invalid Anthropic API key. Check your .env configuration.",
      });
    }
    next(error);
  }
};

// @desc    Analyze complaint by existing complaint ID
// @route   POST /api/ai/analyze/:id
// @access  Private
const analyzeComplaintById = async (req, res, next) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res
        .status(404)
        .json({ success: false, message: "Complaint not found" });
    }

    req.body = {
      title: complaint.title,
      description: complaint.description,
      category: complaint.category,
      location: complaint.location,
      complaintId: complaint._id,
    };

    return analyzeComplaint(req, res, next);
  } catch (error) {
    next(error);
  }
};

module.exports = { analyzeComplaint, analyzeComplaintById };
