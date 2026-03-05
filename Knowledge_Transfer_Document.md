# AI Content Copilot — Knowledge Transfer Document

**Prepared for:** Client  
**Date:** February 27, 2026  
**Version:** 1.0  

---

## Table of Contents

1. [What Is This System?](#1-what-is-this-system)
2. [How the System Works (Big Picture)](#2-how-the-system-works-big-picture)
3. [Where Is Everything Hosted?](#3-where-is-everything-hosted)
4. [Accessing the Live Website (Vercel)](#4-accessing-the-live-website-vercel)
5. [Understanding the Website Pages](#5-understanding-the-website-pages)
6. [How the Backend Works (n8n)](#6-how-the-backend-works-n8n)
7. [Login System (Auth0)](#7-login-system-auth0)
8. [Environment Variables (Settings)](#8-environment-variables-settings)
9. [How to Make Updates to the Website](#9-how-to-make-updates-to-the-website)
10. [How Vercel Automatic Deployment Works](#10-how-vercel-automatic-deployment-works)
11. [The Code Repository (GitHub)](#11-the-code-repository-github)
12. [Common Tasks You May Need to Do](#12-common-tasks-you-may-need-to-do)
13. [Troubleshooting Guide](#13-troubleshooting-guide)
14. [Glossary of Terms](#14-glossary-of-terms)
15. [Contact & Credentials](#15-contact--credentials)

---

## 1. What Is This System?

The **AI Content Copilot** is an internal web-based platform that helps your team create high-quality written content using artificial intelligence (AI). 

Think of it as a **content production pipeline** with several steps:

1. **You type in a keyword** (a topic you want to write about)
2. **AI analyses the keyword** and gives it a score (called a PAVE score) to tell you if it's worth writing about
3. **You approve the keyword** and ask AI to create a detailed content plan (called an "Authority Brief")
4. **AI writes the full article** as a professional HTML web page with a cover image
5. **The article gets saved** for publishing

The whole system is automated — you just guide it by selecting keywords and approving content.

---

## 2. How the System Works (Big Picture)

The system has **three main parts** that work together:

| Part | What It Does | Where It Lives |
|------|-------------|----------------|
| **Website (Frontend)** | The visual interface you click and interact with | Hosted on **Vercel** (a web hosting service) |
| **Brain (Backend)** | The automation engine that talks to AI, searches the web, and stores data | Hosted on **n8n Cloud** (an automation platform) |
| **Data Storage** | Where all your content, brands, and scores are saved | **SharePoint** (your existing Microsoft setup) |

**How they talk to each other:**

```
You (User) → Website (Vercel) → Backend (n8n Cloud) → SharePoint + AI Services
```

When you click a button on the website, it sends a request to the n8n backend, which does the heavy lifting (calling AI, searching the web, reading/writing data in SharePoint) and sends the results back to the website for you to see.

---

## 3. Where Is Everything Hosted?

### 3.1 Website — Vercel

- **What is Vercel?** A cloud service that hosts websites. Your website is already live there.
- **Live Website URL:** `https://ai-content-swart.vercel.app`
- **How to access the Vercel dashboard:** Go to [vercel.com](https://vercel.com) and log in with the credentials stored in LastPass.

### 3.2 Backend — n8n Cloud

- **What is n8n?** A visual automation tool where all the "behind the scenes" logic runs.
- **n8n Cloud URL:** `https://vitcornu.app.n8n.cloud`
- **How to access:** Log in using the credentials stored in LastPass.

### 3.3 Code — GitHub

- **What is GitHub?** A place where all the source code for the website is stored and version-controlled.
- **Repository URL:** `https://github.com/ifrahimafzal808-sudo/AI_Content.git`

---

## 4. Accessing the Live Website (Vercel)

### 4.1 Visiting the Website

Simply open your web browser and go to:

```
https://ai-content-swart.vercel.app
```

You will see a landing page with the title **"AI-Powered Content Strategy Platform"** and a button that says **"🚀 Go to Dashboard"**.

### 4.2 Managing the Website on Vercel

If you need to check the status of the website, view error logs, or change settings:

1. Go to [https://vercel.com](https://vercel.com)
2. Log in using the credentials from LastPass
3. You will see your project listed — click on it
4. From here you can:
   - See if the website is up and running (green = healthy)
   - View recent deployments (every time code is updated, a new version is deployed)
   - Check error logs if something goes wrong
   - Manage environment variables (settings) — see Section 8

---

## 5. Understanding the Website Pages

The website has **7 pages**. Here's what each one does:

---

### 5.1 Home Page (`/`)

**What you see:** A beautiful landing page with the title "AI-Powered Content Strategy Platform" and three feature cards explaining PAVE Scoring, Authority Briefs, and Content Production.

**What to do here:** Click **"🚀 Go to Dashboard"** to enter the main application.

---

### 5.2 Dashboard (`/dashboard`)

**What you see:** An overview of your content production with statistics:
- Ideas Analyzed
- Approved for Briefing  
- In Production
- Published

Below the stats there is a **Recent Activity** feed showing the latest actions taken.

**What to do here:** Use this as your starting point to see the overall status of your content work.

---

### 5.3 Analyze Keyword (`/analyze`)

**What you see:** A form with two fields:
1. **Select Brand** — A dropdown to choose which brand you're writing for (e.g., "Vit Cornu")
2. **Keyword** — A text box where you type the topic you want to analyze (e.g., "best vitamin D supplements")

**How to use:**
1. Select a brand from the dropdown
2. Type your keyword
3. Click **"🤖 Analyze with AI"**
4. Wait while the AI searches the web and evaluates your keyword
5. You'll see **PAVE Scores** — four scores on a scale of 1 to 5:
   - **P** (Profitability) — How likely this topic is to generate revenue
   - **A** (Authority) — How well your brand can be authoritative on this topic
   - **V** (Volume) — How many people search for this topic (always 0 — requires manual check)
   - **E** (Effort) — How difficult it will be to compete on this topic
6. You can adjust the scores if you disagree with the AI
7. Click **"Save to Backlog"** to save the keyword with its scores

---

### 5.4 Content Backlog (`/backlog`)

**What you see:** A table listing all your saved keywords and their current status.

**Table columns:**
| Column | What It Means |
|--------|--------------|
| Title | The keyword/topic |
| Brand | Which brand it belongs to |
| P, A, V, E | The four PAVE scores |
| Total | Sum of all PAVE scores |
| Status | Where it is in the pipeline |
| Date | When it was added |

**Status filters:** You can filter the table by clicking status buttons at the top:
- **All** — Show everything
- **PAVE Scored** — Keywords that have been scored but not yet approved
- **Approved for Briefing** — Ready to have a brief created
- **Briefed** — Brief has been generated
- **In Production** — Article is being generated
- **Published** — Article is live

---

### 5.5 Create Brief (`/brief`)

**What you see:** A step-by-step wizard to create an "Authority Brief" (a detailed content plan):

**Step 1:** Select a keyword from the dropdown (only shows items with status "Approved for Briefing")

**Step 2:** Click **"🤖 Get Format Recommendation"** — The AI will recommend what type of article to write:
- Comparison Page
- In-Depth Guide
- Listicle
- Landing Page
- Research Report

**Step 3:** Optionally add:
- **Differentiator** — What makes your brand special
- **SME Input** — Expert notes or key talking points

**Step 4:** Click **"📄 Generate Authority Brief"** — The AI creates a detailed content plan

**Step 5:** Review the brief and click **"👍 Approve & Save Brief"** to save it

---

### 5.6 Produce Content (`/produce`)

**What you see:** A page to generate the full HTML article.

**How to use:**
1. Select a briefed item from the dropdown
2. Click **"🚀 Start Content Production"**
3. A progress indicator shows 5 steps:
   - Preparing Context
   - Generating HTML Article
   - Generating Cover Image
   - Assembling Final HTML
   - Saving to SharePoint
4. When complete, you'll see a success screen with a link to view the article

> **Note:** The "Saving to SharePoint" step (step 5) is **not yet fully implemented** in the backend. This is the remaining development work.

---

### 5.7 Published Gallery (`/published`)

**What you see:** A gallery-style grid showing all published articles with:
- Article title
- Brand name
- Published date
- PAVE total score

---

## 6. How the Backend Works (n8n)

The n8n backend contains **automated workflows** (think of them as recipes) that the website calls when you click buttons. Here are the main ones:

| Workflow Name | What It Does | Triggered When |
|--------------|-------------|----------------|
| `GetActiveBrands` | Fetches the list of brands from SharePoint | You open the Analyze Keyword page |
| `GetBrandDetails` | Gets full details for a specific brand | Creating a brief |
| `AnalyzeKeyword_Backend` | Searches the web + asks AI for PAVE scores | You click "Analyze with AI" |
| `SaveScoredIdea` | Saves the keyword + scores to SharePoint | You click "Save to Backlog" |
| `FetchAllItems` | Gets all items from the content pipeline | Opening the Content Backlog page |
| `FetchBriefedItem` | Gets items filtered by a specific status | Filtering by status in backlog |
| `FetchItemDetails` | Gets full details for one specific item | Selecting an item for briefing |
| `BriefRecommendation` | AI recommends a content format | You click "Get Format Recommendation" |
| `GenerateAuthorityBrief` | AI generates a full content brief | You click "Generate Authority Brief" |
| `UpdateBriefAndStatus` | Saves the approved brief to SharePoint | You click "Approve & Save Brief" |
| `ProduceContent` | Generates the full HTML article | You click "Start Content Production" |
| `UpdateContentStatus` | Changes the status of a content item | Publishing content |

### How to Access n8n

1. Go to `https://vitcornu.app.n8n.cloud`
2. Log in with the credentials from LastPass
3. You'll see a list of all workflows
4. Click any workflow to see its visual flowchart
5. **DO NOT modify workflows** unless you have a developer making changes

---

## 7. Login System (Auth0)

The website uses **Auth0** for user authentication (login system).

### Current State
Auth0 is currently **temporarily disabled** in the code for testing purposes. This means anyone with the website URL can access all pages without logging in.

### When Auth0 is Enabled
Users will need to log in with their email and password before accessing the dashboard and other internal pages. The Home page (`/`) will remain accessible without login.

### Managing Users in Auth0
1. Go to [https://manage.auth0.com](https://manage.auth0.com)
2. Log in with the credentials from LastPass
3. Navigate to **User Management → Users**
4. From here you can:
   - Add new users
   - Delete existing users
   - Reset passwords
   - View login history

### Auth0 Settings Currently in Use
- **Domain:** `dev-8znipkp78hn0i6pz.us.auth0.com`
- **Client ID:** `V2VfKrYFH8ii5fZBGv8d2fOEoLXFXDZJ`
- **Allowed redirect:** The live website URL

---

## 8. Environment Variables (Settings)

Environment variables are **settings** that the website uses to know where to connect. Think of them like an address book.

### Current Settings

| Setting Name | What It Controls | Current Value |
|-------------|-----------------|---------------|
| `VITE_AUTH0_DOMAIN` | Which Auth0 account to use for login | `dev-8znipkp78hn0i6pz.us.auth0.com` |
| `VITE_AUTH0_CLIENT_ID` | Identifies your app in Auth0 | `V2VfKrYFH8ii5fZBGv8d2fOEoLXFXDZJ` |
| `VITE_N8N_API_URL` | Where the website sends requests to the backend | `/api/n8n` (Vercel routes this to n8n Cloud) |
| `VITE_N8N_API_KEY` | A secret key to authenticate with n8n | Stored in the `.env` file |
| `VITE_USE_MOCK_DATA` | If set to `true`, the website shows fake test data instead of real data | Currently `false` (using real data) |

### Where These Settings Live
- **In the code:** In a file called `.env` inside the `frontend` folder
- **On Vercel:** In the Vercel dashboard under **Settings → Environment Variables**

> **Important:** The settings in Vercel must match the settings in the `.env` file. If you need to change a setting, you must update it **in both places**.

### How to Change Settings on Vercel

1. Go to [https://vercel.com](https://vercel.com) and log in
2. Click on your project
3. Go to **Settings** (tab at the top)
4. Click **Environment Variables** in the left sidebar
5. You'll see a list of all settings — you can edit, add, or remove them
6. After making changes, you need to **redeploy** (see Section 10) for changes to take effect

---

## 9. How to Make Updates to the Website

If you or a developer needs to make changes to the website:

### Step 1: Edit the Code

The code lives in the GitHub repository. A developer would:
1. Download (clone) the code from GitHub
2. Make the necessary changes on their computer
3. Test the changes locally by running the development server
4. Push the changes back to GitHub

### Step 2: Automatic Deployment

Once changes are pushed to GitHub, **Vercel automatically detects the update** and deploys a new version of the website. This usually takes 1-2 minutes.

### For a Developer — Running the Website Locally

If a developer needs to run the website on their own computer for testing:

1. **Download the code:**
   ```
   git clone https://github.com/ifrahimafzal808-sudo/AI_Content.git
   ```

2. **Go to the frontend folder:**
   ```
   cd frontend
   ```

3. **Install required software:**
   ```
   npm install
   ```

4. **Start the development server:**
   ```
   npm run dev
   ```

5. **Open the website:** The terminal will show a local URL (usually `http://localhost:5173`)

> **Tip:** For testing without needing the n8n backend, change `VITE_USE_MOCK_DATA` to `true` in the `.env` file. This shows fake data so you can test the interface.

---

## 10. How Vercel Automatic Deployment Works

Vercel is connected to the GitHub repository. Here's what happens when code is updated:

```
Developer pushes code to GitHub
         ↓
Vercel detects the change automatically
         ↓
Vercel builds the new version (compiles the code)
         ↓
Vercel deploys the new version to the live URL
         ↓
The website is updated (usually within 1-2 minutes)
```

### How to See Deployment History

1. Go to your project in the Vercel dashboard
2. Click the **Deployments** tab
3. You'll see a list of all deployments with:
   - Date and time
   - Status (✅ Ready, ❌ Error, 🔄 Building)
   - Which code change triggered the deployment
4. Click any deployment to see details and logs

### How to Manually Redeploy

If you need to force a new deployment (e.g., after changing environment variables):

1. Go to your project in the Vercel dashboard
2. Click the **Deployments** tab
3. Find the most recent successful deployment
4. Click the three-dot menu (**⋮**) next to it
5. Select **Redeploy**
6. Confirm the action

---

## 11. The Code Repository (GitHub)

### Repository URL
`https://github.com/ifrahimafzal808-sudo/AI_Content.git`

### Important Files and Folders

```
frontend/
├── .env                  ← Settings file (Auth0, n8n URL, API key)
├── vercel.json           ← Vercel routing configuration
├── package.json          ← List of software dependencies
├── vite.config.js        ← Build tool configuration
├── index.html            ← The main HTML shell
└── src/                  ← All the source code
    ├── App.jsx           ← Defines all the pages and their web addresses
    ├── main.jsx          ← The application entry point
    ├── index.css         ← All visual styling (colours, fonts, spacing)
    ├── auth/             ← Login system configuration
    ├── components/       ← Reusable visual building blocks
    ├── hooks/            ← Helper code used across pages
    ├── pages/            ← The 7 individual pages (see Section 5)
    └── services/
        └── api.js        ← Code that talks to the n8n backend
```

### The Vercel Routing File (`vercel.json`)

This file tells Vercel how to route requests. Currently it contains one important rule:

> Any request to `/api/n8n/...` gets forwarded to `https://vitcornu.app.n8n.cloud/...`

This means the website never talks directly to n8n — Vercel acts as a middleman, which is more secure.

---

## 12. Common Tasks You May Need to Do

### Task 1: "The website is down"

1. Go to Vercel dashboard → Check if the last deployment failed
2. If it shows an error, click on it to see the error logs
3. Try redeploying the last successful version (see Section 10)
4. If that doesn't work, check if n8n Cloud is running at `https://vitcornu.app.n8n.cloud`

### Task 2: "I need to add a new user"

1. Go to Auth0 dashboard (see Section 7)
2. Navigate to **User Management → Users**
3. Click **+ Create User**
4. Enter their email and set a password
5. Click **Create**

### Task 3: "Data isn't showing on the website"

1. Check if `VITE_USE_MOCK_DATA` is set to `false` (should be for real data)
2. Go to n8n Cloud and check if the workflows are active (turned on)
3. Check if SharePoint is accessible and has data

### Task 4: "I need to change the n8n backend URL"

1. Update the `VITE_N8N_API_URL` in the `.env` file
2. Also update it in Vercel dashboard → Settings → Environment Variables
3. Update the `vercel.json` file to point the proxy to the new URL
4. Redeploy on Vercel

### Task 5: "I need to connect to a different Auth0 account"

1. Get the new Domain and Client ID from the new Auth0 dashboard
2. Update `VITE_AUTH0_DOMAIN` and `VITE_AUTH0_CLIENT_ID` in:
   - The `.env` file in the code
   - Vercel Environment Variables
3. Redeploy on Vercel

### Task 6: "I want to test the website without the live backend"

1. Change `VITE_USE_MOCK_DATA` to `true` in the `.env` file
2. The website will show sample/fake data so you can explore the interface

---

## 13. Troubleshooting Guide

| Problem | Likely Cause | Solution |
|---------|-------------|----------|
| Website shows a blank page | JavaScript error or build failure | Check Vercel deployment logs for errors |
| "Analysis failed" when analyzing a keyword | n8n workflow isn't running, or API key is wrong | Check n8n Cloud — make sure the `AnalyzeKeyword_Backend` workflow is active |
| No brands appear in the dropdown | n8n can't reach SharePoint, or the `GetActiveBrands` workflow is off | Check n8n Cloud workflows are active and SharePoint is accessible |
| Backlog table is empty | No data in SharePoint, or mock mode is on | Make sure `VITE_USE_MOCK_DATA` is `false` and that there is data in SharePoint |
| "API request failed" error appears | Network issue or wrong API URL | Check that `VITE_N8N_API_URL` is correctly set and n8n Cloud is online |
| Website loads but buttons don't work | JavaScript error | Open the browser's developer tools (press F12), go to the Console tab, and check for red error messages |
| Changes pushed to GitHub but website didn't update | Vercel auto-deploy might have failed | Go to Vercel dashboard → Deployments tab to check the build status |
| Login page appears but won't accept credentials | Auth0 misconfiguration | Check Auth0 dashboard for the correct client ID, and verify the redirect URL matches your website URL |

---

## 14. Glossary of Terms

| Term | What It Means |
|------|--------------|
| **Frontend** | The visual part of the website — what you see and click on |
| **Backend** | The "behind  the scenes" logic that processes data, calls AI, and manages your content pipeline |
| **Vercel** | The cloud service that hosts and serves the website to users on the internet |
| **n8n** | The automation platform that runs all the backend logic (workflows) |
| **GitHub** | Where the source code for the website is stored and tracked |
| **Auth0** | The service that handles user login and authentication |
| **SharePoint** | Microsoft's cloud storage where all your brand configurations and content data is saved |
| **Deployment** | The process of putting a new version of the website online |
| **Environment Variables** | Settings that tell the website where to connect (like addresses and passwords) |
| **PAVE Score** | A scoring system — **P**rofitability, **A**uthority, **V**olume, **E**ffort — used to evaluate keyword quality |
| **Authority Brief** | A detailed written plan created by AI to guide the content production for a specific keyword |
| **Webhook** | A web address that triggers a specific backend workflow when the website sends a request |
| **Repository (Repo)** | The online "folder" on GitHub that contains all the code files |
| **Clone** | Downloading a copy of the code from GitHub to a local computer |
| **Mock Data** | Fake sample data used for testing the website without connecting to the real backend |
| **API** | A set of rules that allows the website to communicate with the backend |
| **HTML** | The code language used to structure web pages |
| **React** | The software framework used to build the website's user interface |
| **Vite** | A tool that helps developers build and test React websites quickly |
| **LastPass** | A password management tool where all shared credentials are stored securely |
| **npm** | A tool used by developers to install software packages needed by the website |

---


**— End of Document —**
