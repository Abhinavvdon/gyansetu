# 🚀 GyanSetu (ज्ञानसेतु) - Render Deployment Guide

This guide provides end-to-end instructions for deploying the **GyanSetu** platform (React 19 + TypeScript frontend, Spring Boot 3.3.4 + Java 17 backend, and PostgreSQL database) to **[Render.com](https://render.com)**.

---

## 🌟 Architecture Options

GyanSetu is configured to support two deployment models on Render:

| Architecture | Description | Benefits | Render Services Used |
| :--- | :--- | :--- | :--- |
| **Option A: Unified Fullstack Container** *(Recommended)* | Spring Boot serves the pre-built React frontend bundle alongside the REST API from a single container. | • Zero CORS issues<br>• Single public URL (`https://gyansetu-app.onrender.com`)<br>• Fits perfectly in Render Free Tier | 1 Web Service + 1 PostgreSQL DB |
| **Option B: Split Decoupled Deployment** | Frontend deployed as a Render **Static Site**, backend as a Docker **Web Service**. | • Independent frontend deploys<br>• Edge CDN caching for static assets | 1 Static Site (Free) + 1 Web Service + 1 PostgreSQL DB |

---

## ⚡ Method 1: Automated 1-Click Deployment (Render Blueprint)

We have bundled `render.yaml` in the repository root. This allows Render to configure both the PostgreSQL database and the fullstack Web Service automatically.

### Step 1: Push Code to GitHub
Ensure your latest changes are pushed to your GitHub repository:
```bash
git add .
git commit -m "feat: render deployment configuration"
git push origin main
```
*Repository URL: `https://github.com/Abhinavvdon/gyansetu.git`*

### Step 2: Connect Blueprint on Render
1. Log in to [Render Dashboard](https://dashboard.render.com).
2. Click the **New +** button in the top navigation bar and select **Blueprint**.
3. Connect your GitHub account and select the **`Abhinavvdon/gyansetu`** repository.
4. Render will scan `render.yaml` and display the resources to create:
   - **`gyansetu-db`** (PostgreSQL Database, Free Tier)
   - **`gyansetu-app`** (Docker Web Service, Free Tier)
5. Under **Environment Variables**, you will see:
   - `DATABASE_URL`: Automatically linked to `gyansetu-db`.
   - `PORT`: Set to `10000`.
   - `SPRING_JPA_HIBERNATE_DDL_AUTO`: Set to `update`.
   - `GEMINI_API_KEY`: *(Optional)* Enter your Google Gemini API key if you want backend AI opportunity generation enabled.
6. Click **Apply**.
7. Render will provision the database, build the Docker container (building React with Vite and packaging Spring Boot with Maven), and deploy the application live!

---

## 🛠️ Method 2: Manual Dashboard Setup

If you prefer configuring services individually through the Render Web UI:

### Step 1: Create PostgreSQL Database on Render
1. In Render Dashboard, click **New +** -> **PostgreSQL**.
2. Fill in the details:
   - **Name**: `gyansetu-db`
   - **Database**: `gyansetu`
   - **User**: `gyansetu`
   - **Region**: Choose closest to you (e.g., `Singapore` or `Oregon`).
   - **Plan**: **Free**
3. Click **Create Database**.
4. Once created, scroll down to **Connections** and copy the **Internal Database URL** (e.g. `postgres://gyansetu:pass@dpg-xxx:5432/gyansetu`).

---

### Step 2: Deploy Unified Web Service (Spring Boot + React)
1. Click **New +** -> **Web Service**.
2. Select **Build and deploy from a Git repository** -> choose **`Abhinavvdon/gyansetu`**.
3. Configure the service:
   - **Name**: `gyansetu-app`
   - **Region**: Choose the **same region** as your database.
   - **Branch**: `main`
   - **Runtime**: **Docker**
   - **Dockerfile Path**: `./Dockerfile`
   - **Plan**: **Free**
4. Expand **Advanced** and configure:
   - **Health Check Path**: `/api/auth/status`
5. Add **Environment Variables**:
   | Key | Value | Description |
   | :--- | :--- | :--- |
   | `DATABASE_URL` | *(Paste Internal Database URL from Step 1)* | Automatically parsed and converted to JDBC by `DatabaseConfig.java` |
   | `PORT` | `10000` | Render HTTP routing port |
   | `SPRING_JPA_HIBERNATE_DDL_AUTO` | `update` | Auto-creates user, opportunities, documents, notifications tables |
   | `GEMINI_API_KEY` | *(Your Gemini API Key - Optional)* | For backend opportunity generator |
6. Click **Create Web Service**.

---

### Step 3 (Optional): Deploy Frontend as a Static Site (Split Mode)
If you prefer hosting the React frontend separately as a Render Static Site:
1. Click **New +** -> **Static Site**.
2. Connect `Abhinavvdon/gyansetu`.
3. Set:
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Publish Directory**: `dist`
4. In **Environment Variables**:
   - `VITE_API_URL`: `https://your-backend-app.onrender.com` (URL of your backend Web Service)
5. In **Redirects / Rewrites**:
   - `_redirects` file is already included in `client/public/_redirects` (`/* /index.html 200`).
6. Click **Create Static Site**.

---

## 🔍 Verification & Testing

Once Render finishes deploying (marked by a green **Live** badge):

1. **Test API Health**:
   Open:
   ```
   https://<your-render-url>.onrender.com/api/auth/status
   ```
   Expected response:
   ```json
   {
     "database": "PostgreSQL",
     "status": "ACTIVE",
     "encryption": "BCrypt Hashing (10 rounds)"
   }
   ```

2. **Test User Registration & Persistence**:
   - Open `https://<your-render-url>.onrender.com` in your browser.
   - Click **Login / Register**.
   - Register a new student account. Credentials are automatically hashed with BCrypt and stored in your Render PostgreSQL database.

3. **Test Opportunity Explorer & Features**:
   - Browse opportunities across Government Exams, Scholarships, and Higher Studies.
   - Toggle saved opportunities and verify document checklists.
   - Test **Exam Clash Warning** and **Scam Shield Verifier**.

---

## 💡 Key Optimizations for Render Free Tier

1. **Automatic Port Dynamic Binding**:
   Spring Boot binds to `${PORT:8085}`, seamlessly adapting to Render's dynamic `$PORT` (typically 10000).
2. **Cloud Database URL Auto-Translation**:
   Render provides `postgres://user:pass@host:port/db`. Spring Boot normally requires `jdbc:postgresql://...`.
   `DatabaseConfig.java` intercepts cloud URLs, extracts credentials, and creates a tuned `HikariDataSource` pool automatically.
3. **RAM & Container Protection**:
   The Dockerfile specifies `-XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0` to keep JVM memory well within Render Free Tier's 512MB RAM cap.
4. **Cold Start Grace Period**:
   Render free Web Services sleep after 15 minutes of inactivity. The Axios client timeout is set to 15s to allow smooth initial wake-ups.
