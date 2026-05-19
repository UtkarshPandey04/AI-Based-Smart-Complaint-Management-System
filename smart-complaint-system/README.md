# 🏛️ AI-Based Smart Complaint Management System

> **B.Tech 4th Semester | AI Driven Full Stack Development (AI308B)**  
> Built with MERN Stack + Anthropic Claude AI

---

## 📌 Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Local Setup](#local-setup)
- [API Endpoints](#api-endpoints)
- [Postman Testing](#postman-testing)
- [Deployment on Render](#deployment-on-render)

---

## ✨ Features

| Feature | Description |
|---|---|
| 📝 Complaint Registration | Submit complaints with name, email, title, description, category, location |
| 📋 Complaint Tracking | View all complaints, filter by category, search by location |
| 🤖 AI Analysis | Priority detection, department routing, summary & auto-response via Anthropic Claude |
| 🔐 JWT Auth | Secure login/register with bcrypt password hashing |
| 🔄 Status Updates | Admin can update complaint status (Pending → In Progress → Resolved) |
| 🚀 Render Deployment | Fully deployed frontend + backend on Render |

---

## 🛠 Tech Stack

**Frontend:** React.js, React Router, Axios, React Toastify  
**Backend:** Node.js, Express.js, JWT, bcryptjs, express-validator  
**Database:** MongoDB Atlas (Mongoose ODM)  
**AI:** Anthropic Claude API (claude-sonnet-4-20250514)  
**Deployment:** Render.com

---

## 📁 Project Structure

```
smart-complaint-system/
├── backend/
│   ├── config/
│   │   └── db.js                    # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js        # Register, Login, Profile
│   │   ├── complaintController.js   # CRUD operations
│   │   └── aiController.js          # AI analysis with Anthropic
│   ├── middleware/
│   │   ├── authMiddleware.js        # JWT protect & admin guard
│   │   ├── errorMiddleware.js       # Global error handler
│   │   └── validationMiddleware.js  # express-validator rules
│   ├── models/
│   │   ├── User.js                  # User schema with bcrypt
│   │   └── Complaint.js             # Complaint schema + AI fields
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── complaintRoutes.js
│   │   └── aiRoutes.js
│   ├── .env.example
│   ├── package.json
│   └── server.js                    # Express app entry point
│
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   └── Navbar.js
│   │   ├── context/
│   │   │   └── AuthContext.js       # Auth state management
│   │   ├── pages/
│   │   │   ├── Home.js
│   │   │   ├── Login.js
│   │   │   ├── Register.js
│   │   │   ├── SubmitComplaint.js   # Complaint registration + AI pre-analysis
│   │   │   ├── ComplaintsList.js    # Listing, filter, search
│   │   │   └── ComplaintDetail.js  # Detail + status update + AI analysis
│   │   ├── services/
│   │   │   └── api.js               # Axios API service layer
│   │   ├── App.js
│   │   └── index.js
│   ├── .env.example
│   └── package.json
│
├── render.yaml                      # Render deployment config
└── README.md
```

---

## ⚙️ Local Setup

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (free tier)
- Anthropic API key

### 1. Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/smart-complaint-system.git
cd smart-complaint-system
```

### 2. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
```

Edit `backend/.env`:
```env
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster0.xxxxx.mongodb.net/complaint_db
JWT_SECRET=your_super_secret_key_minimum_32_characters
ANTHROPIC_API_KEY=sk-ant-api03-your-key-here
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

Start backend:
```bash
npm run dev    # development (nodemon)
npm start      # production
```

### 3. Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env
```

Edit `frontend/.env`:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

Start frontend:
```bash
npm start
```

App runs at: http://localhost:3000  
API runs at: http://localhost:5000

---

## 🔗 API Endpoints

### Auth Endpoints
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Register new user | Public |
| POST | `/api/auth/login` | Login and get token | Public |
| GET | `/api/auth/profile` | Get user profile | Private |

### Complaint Endpoints
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/complaints` | Add new complaint | Public |
| GET | `/api/complaints` | Get all complaints | Public |
| GET | `/api/complaints/:id` | Get complaint by ID | Public |
| PUT | `/api/complaints/:id` | Update complaint status | Private |
| DELETE | `/api/complaints/:id` | Delete complaint | Private |
| GET | `/api/complaints/search?location=X` | Search by location | Public |

### AI Endpoints
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/ai/analyze` | Analyze complaint with AI | Public |
| POST | `/api/ai/analyze/:id` | Analyze existing complaint | Private |

---


## 📋 Test Cases Summary

| Test Case | Expected Output |
|-----------|----------------|
| Add valid complaint | `201` - Complaint stored successfully |
| Missing title field | `400` - Validation error |
| Invalid email | `400` - Error message |
| Filter by location | `200` - Matching complaints displayed |
| Valid login | `200` - Token generated |
| Invalid password | `401` - Unauthorized error |
| Access without token | `401` - Access denied |
| Stored password | Bcrypt encrypted (visible in MongoDB Atlas) |
| Water leakage complaint AI | Water department suggestion, Medium/High priority |
| Electricity issue AI | High priority alert, Electricity Board |
| Garbage complaint AI | Sanitation department |

---

## 👥 Author
Utkarsh Pandey
B.Tech 4th Semester | AI Driven Full Stack Development (AI308B)  
Even Semester 2025-26
