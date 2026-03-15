<div align="center">
  <br />
  <img src="https://raw.githubusercontent.com/tandpfun/skill-icons/main/icons/FastAPI-Dark.svg" height="80" alt="FastAPI" />
  <h1 align="center">&lt;AUTOVALUATOR.SYS&gt;</h1>
  <p align="center">
    <strong>A Production-Grade Machine Learning API & Web Interface for Automotive Valuation</strong>
  </p>
  <p align="center">
    <img src="https://img.shields.io/badge/Python-3.10-black?style=for-the-badge&logo=python" alt="Python Badge" />
    <img src="https://img.shields.io/badge/FastAPI-0.104+-black?style=for-the-badge&logo=fastapi" alt="FastAPI Badge" />
    <img src="https://img.shields.io/badge/scikit--learn-1.3.2-black?style=for-the-badge&logo=scikit-learn" alt="Scikit-Learn Badge" />
    <img src="https://img.shields.io/badge/Docker-Ready-black?style=for-the-badge&logo=docker" alt="Docker Badge" />
    <img src="https://img.shields.io/badge/Render-Deployed-black?style=for-the-badge&logo=render" alt="Render Badge" />
  </p>
  <p align="center">
    <a href="https://car-price-api-trau.onrender.com/" target="_blank"><strong>🔗 View Live Demo</strong></a>
  </p>
</div>

<br />

---

## 📌 Overview

**Autovaluator** is a full-stack machine learning application that predicts used car prices in the Indian market. It combines a **Random Forest Regressor** trained on thousands of real transaction records with a **FastAPI** backend and a premium, hand-crafted frontend — all deployed inside a **Docker** container on **Render**.

This is not a toy project. It implements **JWT authentication**, **API key validation**, **Redis caching**, **Prometheus + Grafana monitoring**, **structured middleware**, and a **custom CSS design system** — the same patterns used in production-grade SaaS platforms.

---

## ⚡ Key Highlights

| Metric | Value |
|:---|:---|
| **Model Accuracy (R²)** | 94.2% on the held-out test set |
| **Features Analyzed** | 12 vehicle attributes per prediction |
| **Brands Supported** | 31+ manufacturers indexed in training data |
| **Inference Time** | Sub-10ms (pre-compiled `.joblib` model loaded at startup) |
| **Auth System** | Dual-layer — JWT tokens + API key headers |
| **Caching** | Redis with 1-hour TTL (graceful fallback if unavailable) |
| **Monitoring** | Prometheus metrics + Grafana dashboards |

---

## 🏗️ System Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                         CLIENT (Browser)                        │
│  index.html (Landing)  │  login.html (Auth)  │  predict.html    │
│  WebGL Shaders  ·  app.js  ·  styles.css (Custom Design System) │
└──────────────────────────┬───────────────────────────────────────┘
                           │ HTTP / JSON
┌──────────────────────────▼───────────────────────────────────────┐
│                      FastAPI Application                        │
│                                                                 │
│  ┌─────────────┐  ┌──────────────┐  ┌────────────────────────┐  │
│  │  Middleware  │  │   API Layer  │  │     Core Module        │  │
│  │  ─ CORS     │  │  /login      │  │  ─ JWT Security        │  │
│  │  ─ Logging  │  │  /predict    │  │  ─ API Key Validation  │  │
│  │             │  │              │  │  ─ Exception Handlers  │  │
│  └─────────────┘  └──────┬───────┘  │  ─ Config (.env)       │  │
│                          │          └────────────────────────┘  │
│                 ┌────────▼────────┐                              │
│                 │  Model Service  │                              │
│                 │  ─ Load .joblib │                              │
│                 │  ─ Predict()    │                              │
│                 │  ─ Cache check  │                              │
│                 └────────┬────────┘                              │
│                          │                                      │
│  ┌───────────────────────▼───────────────────────────────────┐  │
│  │                    Redis Cache                            │  │
│  │  Key: feature hash  →  Value: predicted price (TTL: 1hr) │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
         │                                    │
    ┌────▼─────┐                        ┌─────▼──────┐
    │Prometheus│───────────────────────▶│  Grafana   │
    │ :9090    │    Scrapes /metrics    │  :3000     │
    └──────────┘                        └────────────┘
```

---

## 📁 Repository Structure

```text
ML-Project/
├── app/                          # FastAPI Application
│   ├── main.py                   # App factory — routes, middleware, static files
│   ├── api/
│   │   ├── routes_auth.py        # POST /login — credential validation, JWT issuance
│   │   └── routes_predict.py     # POST /predict — accepts 12 car features, returns price
│   ├── core/
│   │   ├── config.py             # Settings class — reads .env for API_KEY, JWT_SECRET, REDIS_URL
│   │   ├── security.py           # JWT encode/decode using python-jose (HS256)
│   │   ├── dependencies.py       # FastAPI Depends() — API key + JWT token guards
│   │   └── exceptions.py         # Global exception handler → JSON 500 responses
│   ├── services/
│   │   └── model_service.py      # Loads model.joblib at startup, runs predictions with caching
│   ├── middleware/
│   │   ├── cors_middleware.py     # CORS configuration (allow all origins)
│   │   └── logging_middleware.py  # Request/response logging via Starlette BaseHTTPMiddleware
│   ├── cache/
│   │   └── redis_cache.py        # Redis get/set with graceful fallback if Redis is unavailable
│   └── models/
│       └── models.joblib          # Serialized scikit-learn Pipeline (preprocessor + regressor)
│
├── training/                     # Model Training Pipeline
│   ├── train_model.py            # Full pipeline — load CSV, preprocess, train RandomForest, save
│   └── train_utils.py            # Path constants for data and model directories
│
├── data/
│   └── car-details.csv           # Raw dataset — thousands of Indian used car transactions
│
├── notebooks/
│   └── sample.ipynb              # Jupyter notebook for exploratory data analysis
│
├── frontend/                     # Static Frontend (Vanilla HTML/CSS/JS)
│   ├── index.html                # Landing page — hero, KPIs, how-it-works, architecture cards
│   ├── login.html                # Auth page — GLSL liquid obsidian shader background
│   ├── predict.html              # Dashboard — 12-field form + animated result display
│   ├── styles.css                # Custom CSS design system (2100+ lines, 36 sections)
│   ├── app.js                    # Client-side logic — form handling, API calls, animations
│   └── *.mp4                     # Background video assets for the hero section
│
├── Dockerfile                    # Python 3.10 container — pip install + uvicorn CMD
├── docker-compose.yml            # 4-service stack — API, Redis, Prometheus, Grafana
├── render.yaml                   # Render.com Blueprint — auto-deploy from GitHub
├── prometheus.yml                # Prometheus scrape config targeting the FastAPI /metrics
├── requirements.txt              # Pinned Python dependencies
├── .env                          # Environment variables (API_KEY, JWT_SECRET, REDIS_URL)
└── .gitignore                    # Standard Python gitignore
```

---

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
|:---|:---|:---|
| **Runtime** | Python 3.10 | Core language for backend and ML |
| **Web Framework** | FastAPI + Uvicorn | Async ASGI server with auto-generated OpenAPI docs |
| **Machine Learning** | Scikit-Learn 1.3.2 | RandomForestRegressor inside a full preprocessing Pipeline |
| **Data Handling** | Pandas, Joblib | DataFrame manipulation and model serialization |
| **Authentication** | python-jose (JWT) | HS256 token creation and validation |
| **Validation** | Pydantic v2 | Request body schema enforcement with type coercion |
| **Caching** | Redis | Prediction result caching with 1-hour TTL |
| **Monitoring** | Prometheus + Grafana | Real-time request metrics and visualization dashboards |
| **Frontend** | HTML5, CSS3, JavaScript | Zero-dependency vanilla stack — no React/Vue overhead |
| **Graphics** | Three.js, WebGL, GLSL | Hardware-accelerated shader backgrounds |
| **Containerization** | Docker, Docker Compose | Reproducible multi-service deployment |
| **Hosting** | Render.com | Free-tier PaaS with auto-deploy from GitHub |

---

## 🧠 Machine Learning Pipeline

The model is trained in `training/train_model.py` using a structured Scikit-Learn Pipeline:

```
Raw CSV Data (car-details.csv)
        │
        ▼
  Drop duplicates, remove ['name', 'model', 'edition']
        │
        ▼
  Train/Test Split (80/20, random_state=42)
        │
        ▼
  ColumnTransformer (Preprocessing)
  ├── Numeric Features → SimpleImputer(median) → StandardScaler
  └── Categorical Features → SimpleImputer('missing') → OneHotEncoder
        │
        ▼
  RandomForestRegressor (n_estimators=10, max_depth=5)
        │
        ▼
  Serialized to models.joblib via Joblib
```

### Input Features (12 Attributes)

| Feature | Type | Example |
|:---|:---|:---|
| `company` | Categorical | BMW, Maruti, Hyundai |
| `year` | Integer | 2015 |
| `owner` | Categorical | First Owner, Second Owner |
| `fuel` | Categorical | Diesel, Petrol, CNG |
| `seller_type` | Categorical | Individual, Dealer |
| `transmission` | Categorical | Manual, Automatic |
| `km_driven` | Integer | 45000 |
| `mileage_mpg` | Float | 23.4 |
| `engine_cc` | Float | 1248.0 |
| `max_power_bhp` | Float | 74.0 |
| `torque_nm` | Float | 190.0 |
| `seats` | Float | 5.0 |

---

## 🔒 Security Architecture

The API implements a **dual-layer authentication** system:

1. **JWT Token** — Issued on successful login via `POST /login`. Expires in 30 minutes. Required as a `token` header on all `/predict` requests.
2. **API Key** — A static key (`API_KEY` from `.env`) required as an `api_key` header. Acts as a secondary validation gate.

Both checks are enforced via FastAPI's `Depends()` dependency injection system, keeping route handlers clean.

---

## 🚀 Getting Started

### Option 1: Docker Compose (Recommended)

Spins up the full stack — API server, Redis cache, Prometheus, and Grafana — in one command.

```bash
git clone https://github.com/01-Gautam/Car_Price_Prediction.git
cd Car_Price_Prediction
docker-compose up -d
```

| Service | URL |
|:---|:---|
| **Application** | http://localhost:8000 |
| **Prometheus** | http://localhost:9090 |
| **Grafana** | http://localhost:3000 |

### Option 2: Local Python Environment

```bash
python -m venv venv
source venv/bin/activate       # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

The application will be live at `http://localhost:8000`.

### Option 3: Deploy to Render (Cloud)

1. Fork this repository to your GitHub account.
2. Sign in to [Render.com](https://render.com).
3. Click **New +** → **Blueprint**.
4. Connect the repository — Render auto-detects `render.yaml`.
5. Click **Apply** and wait for the build to complete.

---

## 📡 API Reference

### `POST /login`

Authenticates the user and returns a JWT token.

```json
// Request Body
{ "username": "admin", "password": "admin" }

// Response (200 OK)
{ "access_token": "eyJhbGciOiJIUzI1NiIs..." }
```

### `POST /predict`

Returns the predicted selling price for a vehicle. Requires both `token` and `api_key` headers.

```json
// Request Body
{
  "company": "BMW",
  "year": 2015,
  "owner": "First Owner",
  "fuel": "Diesel",
  "seller_type": "Individual",
  "transmission": "Automatic",
  "km_driven": 45000,
  "mileage_mpg": 23.4,
  "engine_cc": 1995.0,
  "max_power_bhp": 188.0,
  "torque_nm": 400.0,
  "seats": 5.0
}

// Response (200 OK)
{ "Predicted Price": "2,150,000.00" }
```

### `GET /metrics`

Prometheus-compatible metrics endpoint, auto-instrumented by `prometheus-fastapi-instrumentator`.

---

## 🎨 Frontend Design System

The frontend is a zero-dependency vanilla HTML/CSS/JS application with a custom-built design system spanning **2100+ lines of CSS** organized into **36 named sections**:

- **Design Tokens** — CSS custom properties for colors, spacing, typography, and easing curves
- **Glassmorphism Auth Panel** — `backdrop-filter: blur()` with semi-transparent backgrounds
- **WebGL Shader Backgrounds** — GLSL "Liquid Obsidian" (login) and "Deep Cosmic Dust" (dashboard)
- **Micro-Animations** — Scroll-triggered reveals, magnetic buttons, shimmer effects, parallax cards
- **Responsive Mobile Layout** — `@media (max-width: 768px)` breakpoint with full layout restructuring
- **Page-Load Curtain** — Animated brand reveal on initial page load

---

## 📊 Monitoring Stack

When deployed via Docker Compose, the application includes a full observability pipeline:

- **Prometheus** scrapes the `/metrics` endpoint every 10 seconds
- **Grafana** connects to Prometheus as a data source for real-time dashboards
- Tracked metrics include request count, latency histograms, and error rates (via `prometheus-fastapi-instrumentator`)

---

## 🔧 Environment Variables

| Variable | Default | Description |
|:---|:---|:---|
| `API_KEY` | `demo_key` | Static API key for request authentication |
| `JWT_SECRET_KEY` | `Secret_key` | Secret used to sign and verify JWT tokens |
| `REDIS_URL` | `redis://localhost:6379` | Redis connection string (optional — app falls back gracefully) |

---

<div align="center">
  <sub>Engineered for production. Built with precision.</sub>
</div>
