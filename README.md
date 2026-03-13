# 🧭 CareerCatalyst — Empowering Smarter Career Growth

**CareerCatalyst** is an AI-powered platform that helps students, freelancers, and professionals discover their ideal career paths and connect with opportunities that truly fit them.
It combines **Machine Learning** (FastAPI) with a **MENN stack** (MongoDB, Express.js, Node.js, Next.js) to deliver personalized dashboards, intelligent recommendations, and a modern networking experience — all in one place.

---

## 🚀 Features

✅ **AI-Based Role Classification**
Predicts whether a user is a *Student*, *Freelancer*, or *Employee* based on their interests using a FastAPI microservice with **TF-IDF + Multinomial Naive Bayes**.

✅ **Role-Specific Dashboards**
Each user gets a custom dashboard:

* 🎓 *Students* — internships, learning paths, and mentors
* 💼 *Employees / Startup Owners* — hiring and team projects
* 🧑‍💻 *Freelancers* — gigs, clients, and collaboration

✅ **Interest-Driven Recommendations**
Suggests projects, connections, and opportunities aligned with the user’s skills and interests.

✅ **JWT Authentication & Secure API**
Seamless login/register flow with token-based authentication and MongoDB data persistence.

✅ **Modern Frontend Experience**
Built with **Next.js + TailwindCSS**, offering a clean and intuitive interface.

✅ **Microservice Architecture**
Modular design with a separate FastAPI ML service for scalability and maintainability.

---

## 🧠 Tech Stack

| Layer                     | Technology                        |
| ------------------------- | --------------------------------- |
| **Frontend**              | Next.js (TypeScript, TailwindCSS) |
| **Backend**               | Express.js + Node.js              |
| **Database**              | MongoDB Atlas                     |
| **ML Microservice**       | FastAPI (Python, Scikit-Learn)    |
| **Auth**                  | JWT (JSON Web Tokens)             |
| **Deployment (optional)** | Docker, Render, Vercel, Railway   |

---

## 🧩 Folder Structure

```
CareerCatalyst/
│
├── api/              # Express.js backend
│   ├── src/routes/   # Auth, ML, User routes
│   ├── src/models/   # Mongoose models
│   └── .env
│
├── ml-service/       # FastAPI ML microservice
│   ├── app/
│   ├── data/
│   └── requirements.txt
│
├── web/              # Next.js frontend
│   ├── src/app/
│   └── tailwind.config.ts
│
└── infra/            # (optional) Docker & deployment configs
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/<your-username>/CareerCatalyst.git
cd CareerCatalyst
```

### 2️⃣ Start the ML Microservice

```bash
cd ml-service
python -m venv .venv
source .venv/bin/activate  # (or .venv\Scripts\activate on Windows)
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8001
```

### 3️⃣ Start the Express API

```bash
cd ../api
npm install
npm run dev
```

### 4️⃣ Start the Next.js Frontend

```bash
cd ../web
npm install
npm run dev
```

---

## 🧭 How It Works

1. A new user **registers** and enters their interests.
2. Interests are sent to the **FastAPI ML service** → predicts the user’s role.
3. The backend stores this role and user data in **MongoDB Atlas**.
4. The frontend **redirects** the user to their personalized dashboard.
5. Users can connect, post, collaborate, and grow their network.

---

## 📊 Example Classification Output

```json
{
  "role": "student",
  "probabilities": {
    "student": 0.51,
    "freelancer": 0.23,
    "employee": 0.26
  }
}
```

---

## 🧩 Roadmap

* [ ] Add connection & follow system
* [ ] Introduce chat and messaging
* [ ] Build AI-based skill recommendations
* [ ] Deploy Dockerized microservices

---

## 🤝 Contributing

Contributions, feedback, and ideas are always welcome!
Fork this repo, make your improvements, and open a pull request — let’s build smarter career tools together 💡

---

## 🧑‍💻 Author

**Charan Chinatalachervu**
🌐 [LinkedIn](https://linkedin.com/in/Charan-chintalachervu) • 🐙 [GitHub](https://github.com/CharanChintalachervu)

---

## ⭐ License

This project is open-source and available under the **MIT License**.
