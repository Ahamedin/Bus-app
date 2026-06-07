<div align="center">

<h1>🚌 BusApp</h1>
<p><em>Bus Seat Tracking &amp; Trip Management Platform</em></p>

[![Typing SVG](https://readme-typing-svg.demolab.com?font=JetBrains+Mono&weight=600&size=18&duration=3000&pause=800&color=F5A623&center=true&vCenter=true&width=700&lines=Real-time+Bus+Seat+Tracking;Trip+Creation+%26+Management;Google+Maps+Route+Visualization;JWT-based+Authentication;React+%2B+Express+%2B+MongoDB)](https://git.io/typing-svg)

<br/>

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev)
[![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://mongodb.com)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org)
[![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)](https://jwt.io)
[![Google Maps](https://img.shields.io/badge/Google_Maps-4285F4?style=for-the-badge&logo=googlemaps&logoColor=white)](https://developers.google.com/maps)

</div>

---

## What is BusApp?

**BusApp** is a full-stack web application for real-time **bus seat tracking** and **trip management**. It combines a React (Create React App) frontend with an Express backend and a MongoDB database — giving passengers and operators a seamless way to book seats, track trips, and manage routes.

> Built with React · Express.js · MongoDB · JWT Auth · Google Maps API

---

## Features

<table>
<tr>
<td width="50%">

### 🪑 Seat Tracking
- Real-time seat availability per bus
- Book and cancel seats instantly
- Live occupancy monitoring
- Seat reservation management

### 🗺️ Trip Management
- Create and manage trips
- Route and schedule configuration
- Departure times and stop management
- Trip history and records

</td>
<td width="50%">

### 📍 Google Maps Integration
- Visual route display on map
- Stop location pinning
- Route path visualization
- Distance and ETA info

### 🔐 Authentication & Security
- JWT-based secure login
- User registration & sessions
- Protected API routes
- CORS-controlled access

</td>
</tr>
</table>

---

## Tech Stack

| Layer | Technology |
|:---|:---|
| **Frontend** | React.js (Create React App) |
| **Backend** | Express.js · Node.js 16+ |
| **Database** | MongoDB (local or MongoDB Atlas) |
| **Authentication** | JSON Web Tokens (JWT) · bcrypt |
| **Maps** | Google Maps JavaScript API |
| **Deployment** | Vercel · Railway · Netlify · Heroku |

---

## Project Structure

```bash
bus-app/
├── src/                    # React frontend source
│   ├── components/         # Reusable UI components
│   ├── pages/              # Route-level page views
│   ├── App.js              # Root component & routing
│   └── index.js            # Entry point
├── backend/                # Express API server
│   ├── routes/             # API route handlers
│   ├── models/             # Mongoose data models
│   ├── middleware/         # Auth & CORS middleware
│   ├── server.js           # Server entry point
│   └── .env                # Backend env (gitignored)
├── public/                 # Static assets
├── .env                    # Frontend env (gitignored)
└── package.json
```

---

## Getting Started

### Prerequisites

- Node.js 16+
- A [MongoDB Atlas](https://cloud.mongodb.com) database (or local MongoDB)
- A [Google Maps API Key](https://developers.google.com/maps)
- npm or yarn

### 1. Clone the repository

```bash
git clone https://github.com/your-username/bus-app.git
```

### 2. Move into the project directory

```bash
cd bus-app
```

### 3. Install frontend dependencies

```bash
npm install
```

### 4. Install backend dependencies

```bash
cd backend
npm install
```

---

## Environment Variables

> ⚠️ **Never commit `.env` files to source control.** Add both `.env` and `backend/.env` to your `.gitignore`.

### Frontend — `.env` (project root)

Create React App requires all variables to be prefixed with `REACT_APP_`:

```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
REACT_APP_OTHER_FLAG=true
```

Usage in React:
```javascript
const apiUrl = process.env.REACT_APP_API_URL;
```

### Backend — `backend/.env`

```env
PORT=5000
MONGO_URI=mongodb+srv://user:password@cluster0.mongodb.net/bus-app?retryWrites=true&amp;w=majority
JWT_SECRET=your_jwt_secret_here
CLIENT_ORIGIN=http://localhost:3000
NODE_ENV=development
```

Usage in Node/Express:
```javascript
const port = process.env.PORT || 5000;
const mongoUri = process.env.MONGO_URI;
```

> For production, provide environment variables via your hosting provider (Railway, Heroku, Vercel, etc.) — never hardcode secrets.

---

## Running the App

### Development Workflow

**Terminal 1 — Start backend** (from `backend/` folder):

```bash
cd backend
npm run dev    # uses nodemon for hot reload
# or
node server.js
```

Server listens on `process.env.PORT` (default: `5000`).

**Terminal 2 — Start frontend** (from project root):

```bash
npm start
```

Open [http://localhost:3000](http://localhost:3000) — the frontend calls the backend at `REACT_APP_API_URL`.

### Production Build

```bash
npm run build
```

Builds the app for production to the `build/` folder. Optimized for best performance.

---

## Available Scripts (Frontend)

In the project root directory:

| Script | Description |
|:---|:---|
| `npm start` | Runs the app in development mode at `http://localhost:3000` |
| `npm test` | Launches the test runner in interactive watch mode |
| `npm run build` | Builds the app for production to the `build/` folder |
| `npm run eject` | One-way operation — ejects Create React App configuration |

---

## Deployment

### Frontend

Build and deploy the static `build/` folder:

| Platform | Guide |
|:---|:---|
| **Netlify** | Connect repo → set build command `npm run build` → output dir `build` |
| **Vercel** | Import project → auto-detects CRA settings |
| **Express (serve static)** | `app.use(express.static(path.join(__dirname, '../build')))` |

### Backend

Deploy to your preferred Node.js host:

| Platform | Notes |
|:---|:---|
| **Railway** | Connect GitHub repo, set env vars in dashboard |
| **Heroku** | `git push heroku main`, set config vars via CLI or dashboard |
| **Render** | Connect repo, set env vars under Environment |

> ✅ Ensure `CLIENT_ORIGIN` in `backend/.env` is updated to your deployed frontend URL so CORS allows requests.

### Environment Variables for Production

Set these on your server/hosting platform:

```
MONGO_URI       → Your Atlas production URI
JWT_SECRET      → A long, random secret string
CLIENT_ORIGIN   → https://your-deployed-frontend.com
NODE_ENV        → production
PORT            → (usually set automatically by host)
```

---

## Roadmap

- [x] Bus seat tracking & real-time availability
- [x] Trip creation & management
- [x] JWT-based authentication system
- [x] Google Maps route visualization
- [x] REST API with Express & MongoDB
- [x] CORS & protected routes middleware
- [ ] Real-time updates with WebSockets
- [ ] Admin dashboard for operators
- [ ] Mobile-responsive UI improvements
- [ ] Notification system for booking confirmations

---

## Authors

<table>
<tr>
<td align="center">
<b>Member 1</b><br/>
<sub>Role / Contribution</sub><br/>
<a href="https://github.com/username1">
<img src="https://img.shields.io/badge/GitHub-181717?style=flat-square&amp;logo=github&amp;logoColor=white" />
</a>
<a href="https://linkedin.com/in/username1">
<img src="https://img.shields.io/badge/LinkedIn-0A66C2?style=flat-square&amp;logo=linkedin&amp;logoColor=white" />
</a>
</td>
<td align="center">
<b>Member 2</b><br/>
<sub>Role / Contribution</sub><br/>
<a href="https://github.com/username2">
<img src="https://img.shields.io/badge/GitHub-181717?style=flat-square&amp;logo=github&amp;logoColor=white" />
</a>
<a href="https://linkedin.com/in/username2">
<img src="https://img.shields.io/badge/LinkedIn-0A66C2?style=flat-square&amp;logo=linkedin&amp;logoColor=white" />
</a>
</td>
<td align="center">
<b>Member 3</b><br/>
<sub>Role / Contribution</sub><br/>
<a href="https://github.com/username3">
<img src="https://img.shields.io/badge/GitHub-181717?style=flat-square&amp;logo=github&amp;logoColor=white" />
</a>
<a href="https://linkedin.com/in/username3">
<img src="https://img.shields.io/badge/LinkedIn-0A66C2?style=flat-square&amp;logo=linkedin&amp;logoColor=white" />
</a>
</td>
</tr>
</table>

---

## Conclusion

**BusApp** streamlines bus seat tracking and trip management with a clean full-stack architecture — making it easy for operators to manage routes and for passengers to book with confidence.

---

<div align="center">

![Footer](https://capsule-render.vercel.app/api?type=waving&color=0:0F0C29,50:1A1A2E,100:F5A623&height=100&section=footer&animation=fadeIn)

*If this project helped you, consider giving it a ⭐ — it means a lot!*

</div>
