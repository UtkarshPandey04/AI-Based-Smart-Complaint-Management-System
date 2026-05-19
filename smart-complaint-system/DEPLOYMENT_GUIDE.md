# 🚀 Deployment Guide — Smart Complaint Management System

## Step 1: MongoDB Atlas Setup

1. Go to https://mongodb.com/atlas → Sign Up (free)
2. Create a **Free Cluster** (M0 Sandbox)
3. Go to **Database Access** → Add Database User
   - Username: `complaintadmin`
   - Password: (generate a strong password)
   - Role: `Atlas admin`
4. Go to **Network Access** → Add IP Address → `0.0.0.0/0` (allow all IPs for Render)
5. Go to **Database** → Connect → **Connect your application**
6. Copy the URI: `mongodb+srv://complaintadmin:<password>@cluster0.xxxxx.mongodb.net/`
7. Replace `<password>` with your actual password, and add database name:
   `mongodb+srv://complaintadmin:yourpassword@cluster0.xxxxx.mongodb.net/complaint_db`

---

## Step 2: Get Anthropic API Key

1. Go to https://console.anthropic.com
2. Sign in / Create account
3. Go to **API Keys** → Create Key
4. Copy the key (starts with `sk-ant-api03-...`)

---

## Step 3: Push Code to GitHub

```bash
# In project root
git init
git add .
git commit -m "feat: AI Smart Complaint Management System"

# Create repo on github.com, then:
git remote add origin https://github.com/YOUR_USERNAME/smart-complaint-system.git
git branch -M main
git push -u origin main
```

---

## Step 4: Deploy Backend on Render

1. Go to https://render.com → Sign Up with GitHub
2. Click **New +** → **Web Service**
3. Connect your GitHub repository
4. Configure:
   - **Name:** `smart-complaint-backend`
   - **Root Directory:** `backend`
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
   - **Plan:** Free
5. Add Environment Variables (click **Add Environment Variable** for each):
   ```
   MONGODB_URI     = mongodb+srv://complaintadmin:...
   JWT_SECRET      = mySuper$ecretKey2024ForJWT_min32chars!
   ANTHROPIC_API_KEY = sk-ant-api03-your-key-here
   NODE_ENV        = production
   PORT            = 5000
   FRONTEND_URL    = https://smart-complaint-frontend.onrender.com
   ```
6. Click **Create Web Service**
7. Wait for deployment (3-5 minutes)
8. Copy your backend URL: `https://smart-complaint-backend.onrender.com`
9. Test: Open `https://smart-complaint-backend.onrender.com` → should show JSON health response

---

## Step 5: Deploy Frontend on Render

1. Click **New +** → **Static Site**
2. Connect same GitHub repository
3. Configure:
   - **Name:** `smart-complaint-frontend`
   - **Root Directory:** `frontend`
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `build`
4. Add Environment Variable:
   ```
   REACT_APP_API_URL = https://smart-complaint-backend.onrender.com/api
   ```
5. Add Redirect/Rewrite Rule:
   - Source: `/*`
   - Destination: `/index.html`
   - Action: `Rewrite`
6. Click **Create Static Site**
7. Wait for build (5-8 minutes)
8. Your live URL: `https://smart-complaint-frontend.onrender.com`

---

## Step 6: Update Backend CORS

Once frontend is deployed:
1. Go to backend service on Render
2. Update `FRONTEND_URL` = `https://smart-complaint-frontend.onrender.com`
3. Backend will automatically redeploy

---

## Step 7: Test Live APIs with Postman

Update Postman collection variable:
```
base_url = https://smart-complaint-backend.onrender.com/api
```

Run all tests against the live deployment!

---

## ✅ Deployment Checklist

- [ ] MongoDB Atlas cluster created and user added
- [ ] Network access set to 0.0.0.0/0
- [ ] Anthropic API key obtained
- [ ] Code pushed to GitHub with proper commits
- [ ] Backend deployed on Render with all env vars
- [ ] Frontend deployed on Render with API URL pointing to backend
- [ ] Live backend URL responds with health JSON
- [ ] Frontend loads in browser
- [ ] Can register/login on live site
- [ ] Can submit complaint on live site
- [ ] AI analysis works on live site
- [ ] All Postman tests pass against live URLs

---

## 🛠 Troubleshooting

| Issue | Solution |
|-------|----------|
| MongoDB connection failed | Check URI format, whitelist 0.0.0.0/0 in Atlas |
| JWT errors | Ensure JWT_SECRET is set in Render env vars |
| AI analysis fails | Verify ANTHROPIC_API_KEY is valid and has credits |
| CORS error | Set FRONTEND_URL correctly in backend env vars |
| React build fails | Check REACT_APP_API_URL points to backend URL |
| Routes return 404 | Add `/* → /index.html` rewrite rule in Render |

---

## 📁 Submission Requirements

Include in PDF report:
1. **Code** - All source files (backend + frontend)
2. **Screenshots** - Code output, UI pages
3. **Postman** - All HTTP request/response screenshots  
4. **MongoDB** - Atlas collections showing stored documents
5. **Render** - Deployment success screenshots
6. **Live URLs** - Test each endpoint URL in screenshots

### Live URL Format:
- Frontend: `https://smart-complaint-frontend.onrender.com`
- Backend API: `https://smart-complaint-backend.onrender.com/api`
- All Complaints: `https://smart-complaint-backend.onrender.com/api/complaints`
- Health Check: `https://smart-complaint-backend.onrender.com/api/health`
