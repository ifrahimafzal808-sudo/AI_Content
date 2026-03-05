# AI Content Project Documentation

## 1. Project Overview
This project is an automation pipeline built with n8n, Power Automate, and a React frontend to produce, format, and publish AI-generated content. The project development is structured into three distinct phases.

## 2. Phase Status
*   **Phase 0 (Foundation Setup):** Completed. This phase handled deploying the initial infrastructure (n8n, React/Vite front-end), setting up the secured API credentials (Azure OpenAI, Bing Search, and SharePoint OAuth), and verifying the SharePoint Brand Configuration and Content Pipeline list schemas.
*   **Phase 1 (Backend Development):** Completed. This phase focused on constructing the data and content workflows inside n8n, such as the REST API authentication, retrieving brand details, the logic-heavy PAVE Scorer (analyzing search keywords using Bing and GPT-4), saving scored ideas, and the automatic AI Brief Generation.
*   **Phase 2 (Content Production & Frontend):** Underway (Mostly Completed). This phase focuses on the final content production, HTML article generation, and publishing workflows, alongside assembling the complete React Dashboard.

## 3. Phase 2 Details (Current Working Phase)
Phase 2 focuses heavily on the master "Produce Content" flow and its integration.

### Completed Workflows (Minor tweaks pending)
1.  **Produce Content Workflow:** Handles the core investigative writer AI generation, validating the produced HTML, generating cover images with DALL-E, and string assembly of the final HTML against the proper CSS wrapper.

### Pending Implementation (Action Required)
*   **SharePoint Upload:** The final assembled HTML article needs to be pushed up to the SharePoint `/Master Assets/` directory. This specific node integration is currently missing in Phase 2 and is the primary next step once development resumes.

## 4. Backend Architecture (n8n)
The core logic and automation are handled by cloud-based n8n workflows. The credentials for accessing the n8n cloud instance are securely stored in LastPass.
*   **Workflow File:** You can review the structure by importing the provided `AI Content (2).json` file into your local or cloud n8n instance. 
*   **Nodes Count:** There are currently 96 nodes configured inside the exported n8n workflow file, establishing the data logic for the project.

## 5. Frontend Details
The project includes a frontend interface built using React and Vite.

*   **GitHub Repository:** `https://github.com/ifrahimafzal808-sudo/AI_Content.git`
*   **Tech Stack:** React 19, Vite, React Router, Auth0.
*   **Local Setup Instructions:**
    1. Clone the repository: `git clone https://github.com/ifrahimafzal808-sudo/AI_Content.git`
    2. Navigate to the frontend directory: `cd frontend`
    3. Install dependencies: `npm install`
    4. Run the development server: `npm run dev`

## 6. Credentials & Access
All access details are centralized and secured. 
**Credentials Link:** [Google Docs Link](https://docs.google.com/document/d/10ft7sjxjXSmz1JJPT7vM7cSifzWQdbvrUGCYbDB8EiE/edit?usp=sharing)

The document contains:
*   **Gmail Account:** Dedicated email for the project (Ibrahim's account).
*   **LastPass Account:** The email and master password to access the project's LastPass vault.
*   **Vault Contents:** Inside LastPass, you will find all individual service credentials, including:
    *   n8n access
    *   Power Automate access
    *   SharePoint access
    *   ...and any other shared team accounts.

## 7. Handover Instructions
At this onboarding stage, the goal is solely to understand the project architecture:
1.  Review the n8n JSON file.
2.  Run the frontend locally.
3.  Verify your access via LastPass. 

