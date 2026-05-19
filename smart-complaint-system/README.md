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

## 🧪 Postman Testing Guide

### Collection Setup
1. Open Postman → Create new Collection: `Smart Complaint API`
2. Add Variable: `base_url = http://localhost:5000/api`
3. Add Variable: `token = ` (fill after login)

---

### Test 1: Register User
```
POST {{base_url}}/auth/register
Content-Type: application/json

{
  "name": "Rahul Kumar",
  "email": "rahul@gmail.com",
  "password": "password123"
}
```
**Expected:** `201` with token in response

---

### Test 2: Login
```
POST {{base_url}}/auth/login
Content-Type: application/json

{
  "email": "rahul@gmail.com",
  "password": "password123"
}
```
**Expected:** `200` with JWT token. Copy token → set as `token` variable.

---

### Test 3: Add Complaint (valid)
```
POST {{base_url}}/complaints
Content-Type: application/json

{
  "name": "Rahul Kumar",
  "email": "rahul@gmail.com",
  "title": "Water Leakage Issue",
  "description": "Water pipeline has been damaged near the market area causing road flooding and inconvenience to residents.",
  "category": "Water Supply",
  "location": "Ghaziabad"
}
```
**Expected:** `201` - Complaint stored successfully. Save the `_id`.

---

### Test 4: Add Complaint - Missing Title (validation error)
```
POST {{base_url}}/complaints
Content-Type: application/json

{
  "name": "Rahul Kumar",
  "email": "rahul@gmail.com",
  "description": "No title provided",
  "category": "Electricity",
  "location": "Noida"
}
```
**Expected:** `400` - Validation error: Title is required

---

### Test 5: Add Complaint - Invalid Email
```
POST {{base_url}}/complaints
Content-Type: application/json

{
  "name": "Rahul Kumar",
  "email": "not-an-email",
  "title": "Road pothole issue",
  "description": "There is a large pothole on the main road causing accidents near sector 14.",
  "category": "Roads & Infrastructure",
  "location": "Noida"
}
```
**Expected:** `400` - Validation error: Please enter a valid email

---

### Test 6: Get All Complaints
```
GET {{base_url}}/complaints
```
**Expected:** `200` with list of complaints and pagination info

---

### Test 7: Filter by Category
```
GET {{base_url}}/complaints?category=Water Supply
```
**Expected:** `200` with complaints filtered by Water Supply

---

### Test 8: Search by Location
```
GET {{base_url}}/complaints/search?location=Ghaziabad
```
**Expected:** `200` with matching complaints for Ghaziabad

---

### Test 9: Get Complaint by ID
```
GET {{base_url}}/complaints/{{complaint_id}}
```
**Expected:** `200` with complaint details

---

### Test 10: AI Analysis
```
POST {{base_url}}/ai/analyze
Content-Type: application/json

{
  "title": "Water Leakage Issue",
  "description": "Water pipeline has been severely damaged near the central market area. Water is flooding the road and causing major disruption to traffic and daily life of hundreds of residents.",
  "category": "Water Supply",
  "location": "Ghaziabad"
}
```
**Expected:** `200` with priority, department, summary, autoResponse, estimatedResolutionDays

---

### Test 11: Update Complaint Status (needs token)
```
PUT {{base_url}}/complaints/{{complaint_id}}
Authorization: Bearer {{token}}
Content-Type: application/json

{
  "status": "In Progress"
}
```
**Expected:** `200` - Updated status shown

---

### Test 12: Access Protected Route Without Token
```
PUT {{base_url}}/complaints/{{complaint_id}}
Content-Type: application/json

{
  "status": "Resolved"
}
```
**Expected:** `401` - Access denied. No token provided.

---

### Test 13: Delete Complaint (needs token)
```
DELETE {{base_url}}/complaints/{{complaint_id}}
Authorization: Bearer {{token}}
```
**Expected:** `200` - Complaint removed successfully

---

### Test 14: Invalid Login (wrong password)
```
POST {{base_url}}/auth/login
Content-Type: application/json

{
  "email": "rahul@gmail.com",
  "password": "wrongpassword"
}
```
**Expected:** `401` - Invalid email or password

---

## 🚀 Deployment on Render

### Step 1: Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit: AI Smart Complaint System"
git remote add origin https://github.com/YOUR_USERNAME/smart-complaint-system.git
git push -u origin main
```

### Step 2: Deploy Backend on Render
1. Go to [render.com](https://render.com) → New → Web Service
2. Connect your GitHub repo
3. Settings:
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
4. Add Environment Variables:
   - `MONGODB_URI` = your MongoDB Atlas URI
   - `JWT_SECRET` = your secret key
   - `ANTHROPIC_API_KEY` = your Anthropic API key
   - `NODE_ENV` = `production`
   - `FRONTEND_URL` = (add after frontend is deployed)
5. Click Deploy

### Step 3: Deploy Frontend on Render
1. Go to Render → New → Static Site
2. Connect same GitHub repo
3. Settings:
   - **Root Directory:** `frontend`
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `build`
4. Add Environment Variable:
   - `REACT_APP_API_URL` = `https://your-backend-url.onrender.com/api`
5. Add Rewrite Rule: `/* → /index.html` (for React Router)
6. Click Deploy

### Step 4: Update Backend FRONTEND_URL
- Go back to backend service on Render
- Update `FRONTEND_URL` to your Render frontend URL

---

## 🔐 MongoDB Atlas Setup

1. Go to [mongodb.com/atlas](https://mongodb.com/atlas) → Create free cluster
2. Create database user (remember password)
3. Whitelist IP: `0.0.0.0/0` (for Render)
4. Get connection string: `mongodb+srv://user:pass@cluster.mongodb.net/complaint_db`

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
B.Tech 4th Semester | AI Driven Full Stack Development (AI308B)  
Even Semester 2025-26
