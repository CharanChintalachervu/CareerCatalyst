# 🧭 CareerCatalyst — AI-Powered Career Growth Platform

**CareerCatalyst** is a full-stack AI-powered platform that classifies users by their interests, assigns them a professional role, and connects them with the right projects, people, and opportunities — all personalised to their career profile.

Built with the **MENN stack** (MongoDB, Express.js, Node.js, Next.js) and a **FastAPI ML microservice** using TF-IDF + Multinomial Naive Bayes.

> 🎓 Final Year Major Project — B.Tech CSE

---

## 🚀 Features

- 🧠 **AI Role Classification** — Predicts Student / Freelancer / Employee from user interests using TF-IDF + MultinomialNB
- 💼 **Professional Role System** — Users pick or define their professional role (SDE, DevOps Engineer, ML Engineer, etc.)
- 🎯 **2-Step Onboarding** — Interest selection → Professional role picker → AI-classified personalised dashboard
- 📊 **Role-Specific Dashboards** — Custom dashboards for Students, Freelancers, Employees, and Startup Founders
- 🤝 **Role-Based Project Collaboration** — Projects define open slots by professional role; users apply for specific roles
- 📬 **Apply / Accept / Reject Flow** — Users apply to projects; owners manage applications and build their team
- 👥 **People & Connections** — Discover and follow professionals, filter by professional role
- ⭐ **Ratings & Reviews** — Peer review system with average rating on profiles
- 🔐 **JWT Authentication** — Secure register/login with bcrypt password hashing
- 🗂️ **Tasks System** — Per-project task management with status tracking (todo / in-progress / done)

---

## 🧠 Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | Next.js 14 (TypeScript, TailwindCSS, App Router) |
| **Backend** | Express.js + Node.js (REST API) |
| **Database** | MongoDB (Mongoose ODM) |
| **ML Microservice** | FastAPI + scikit-learn (Python 3.10+) |
| **ML Algorithm** | TF-IDF Vectorizer + Multinomial Naive Bayes |
| **Auth** | JWT (JSON Web Tokens) + bcryptjs |
| **Fonts** | Syne (display) + DM Sans (body) |

---

## 🗂️ Folder Structure

```
CareerCatalyst/
│
├── api/                        # Express.js REST API
│   ├── src/
│   │   ├── middleware/auth.js   # JWT middleware
│   │   ├── models/             # Mongoose models (User, Project, Task, Review)
│   │   └── routes/             # Auth, Users, Projects, ML, Follow, Tasks, Reviews
│   ├── .env.example
│   └── package.json
│
├── ml-service/                 # FastAPI ML microservice
│   ├── app/
│   │   ├── main.py             # FastAPI app + /classify endpoint
│   │   ├── model.py            # TF-IDF + MultinomialNB pipeline
│   │   └── model.joblib        # Pre-trained model
│   ├── data/seed.csv           # Training data
│   └── requirements.txt
│
└── web/                        # Next.js 14 frontend
    └── src/
        ├── app/
        │   ├── page.tsx            # Landing page
        │   ├── (auth)/             # Login & Register
        │   ├── interests/          # 2-step onboarding
        │   ├── student/            # Student dashboard
        │   ├── freelancer/         # Freelancer dashboard
        │   ├── employee/           # Employee dashboard
        │   ├── startup/            # Startup founder dashboard
        │   ├── projects/           # Projects list, detail, new
        │   ├── people/             # People & connections
        │   └── profile/            # User profile & reviews
        ├── components/
        │   ├── Navbar.tsx
        │   └── DashboardLayout.tsx
        └── lib/
            └── api.ts              # Axios instance
```

---

## ⚙️ Installation & Setup

### Prerequisites
- Node.js 18+
- Python 3.10+
- MongoDB (local) or MongoDB Atlas

---

### 1️⃣ ML Microservice

```bash
cd ml-service

# Windows
python -m venv .venv
.venv\Scripts\activate

# Mac/Linux
python -m venv .venv
source .venv/bin/activate

pip install -r requirements.txt
uvicorn app.main:app --reload --port 8001
```

✅ Running at `http://localhost:8001/docs`

---

### 2️⃣ Express API

```bash
cd api
npm install
```

Create `api/.env`:
```env
MONGO_URI=mongodb://127.0.0.1:27017/careercatalyst
JWT_SECRET=your_secret_key_here
ML_BASE_URL=http://localhost:8001
PORT=8080
```

```bash
npm run dev
```

✅ Running at `http://localhost:8080/health`

---

### 3️⃣ Next.js Frontend

```bash
cd web
npm install
```

Create `web/.env.local`:
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
```

```bash
npm run dev
```

✅ Running at `http://localhost:3000`

---

## 🧭 How It Works

1. User **registers** and enters initial interests
2. **Onboarding** — selects detailed interests + picks their professional role (SDE, DevOps, Designer, etc.)
3. Interests are sent to **FastAPI ML service** → TF-IDF + MultinomialNB predicts the career category
4. Both the **career category** and **professional role** are saved on the user profile
5. User lands on their **personalised dashboard** (Student / Freelancer / Employee / Startup)
6. Users can **browse projects**, see open role slots, and **apply for a specific professional role**
7. Project owners **review applications** and accept or reject collaborators
8. Accepted users join the team with their role tagged on the project

---

## 📊 Example ML Classification

```json
{
  "role": "student",
  "probabilities": {
    "student": 0.61,
    "freelancer": 0.21,
    "employee": 0.18
  }
}
```

---

## 🔗 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/auth/register` | Register new user |
| POST | `/auth/login` | Login, returns JWT |
| GET | `/users/me` | Get logged-in user |
| PATCH | `/users/me/professional-role` | Update professional role |
| GET | `/users/suggestions` | Get matched user suggestions |
| POST | `/ml/classify` | Classify interests → role |
| GET | `/projects` | Get all projects |
| POST | `/projects` | Create project with role slots |
| GET | `/projects/:id` | Get project detail |
| POST | `/projects/:id/apply` | Apply for a role slot |
| PATCH | `/projects/:id/applications/:appId` | Accept / Reject application |
| POST | `/reviews` | Submit a peer review |
| GET | `/reviews/user/:userId` | Get reviews for a user |
| POST | `/follow` | Follow a user |
| DELETE | `/follow/:id` | Unfollow a user |

---

## ✅ Roadmap

- [x] AI role classification (TF-IDF + MultinomialNB)
- [x] Professional role system
- [x] Role-based project collaboration with apply/accept/reject
- [x] Personalised dashboards (Student, Freelancer, Employee, Startup)
- [x] People discovery with professional role filter
- [x] Ratings & reviews system
- [x] Follow / unfollow system
- [x] Tasks model per project
- [ ] Real-time chat & notifications
- [ ] CI/CD with GitHub Actions
- [ ] Docker Compose deployment

---

## 🧑‍💻 Author

**Charan Chintalachervu**
🌐 [LinkedIn](https://linkedin.com/in/Charan-chintalachervu) · 🐙 [GitHub](https://github.com/CharanChintalachervu)

---

## ⭐ License

MIT License — open source and free to use.
