/**
 * Knowledge Base for the Digital Twin (portfolio chat).
 * Single source of truth — used as context for the AI. No fabrication; answer only from this content.
 *
 * Notes:
 * - This is a Markdown-formatted string intended for prompt/context injection.
 * - Backticks inside the content are escaped so this is safe in a template literal.
 */

const KNOWLEDGE_BASE = `
# Chetan Chandane — Portfolio Knowledge Base

## Excellus BCBS: Technical Impact Summary (STAR)

### 1) Modernizing the Member Service: Feature Flag Sunsetting
- **Situation:** I inherited a C#/.NET backend where critical provider timeout logic was gated behind a legacy feature flag (Feature650780). This created a "split-brain" codebase where logic was hard to maintain and tests were brittle.
- **Task:** My goal was to fully "sunset" the flag, making the logic always-on, and decoupling the Settings Handler from the feature service to reduce architectural bloop.
- **Action:**
  - I stripped out the IFeatureService injections across handlers and constants.
  - I refactored the ProviderResponseTimeoutTimerHandler to execute unconditionally.
  - I updated the Azure Pipelines CI/CD logic, pinning the .NET SDK and fixing mock signatures in the test suite that had drifted from the implementation.
- **Result:** Reduced the API’s cyclomatic complexity and eliminated the risk of operational timeouts being accidentally disabled by stale configurations.

### 2) Formulary Search Optimization: Azure Cognitive Search
- **Situation:** The UI required a new medicalPlanRenewalDate field for group searches, but the existing Azure Cognitive Search index and the C# projection service didn't support it.
- **Task:** Expose the renewal date across the entire search pipeline—from the data source to the search result document.
- **Action:**
  - I modified the GroupSearchUpdateService to map the new date field.
  - I implemented a GetDSTSafeDateTimeFromDateString helper to normalize dates into a UTC-safe format, preventing Daylight Savings Time (DST) errors in the search index.
  - I updated the Newtonsoft.Json DTO attributes to ensure seamless serialization.
- **Result:** Successfully delivered a new search dimension to the frontend, enabling analysts to filter and sort groups by their renewal timeline with 100% data accuracy.

### 3) System Stability: Resolving Null-Safety & Connectivity Crashes
- **Situation:** The RxCC Simulation API was experiencing intermittent 503 errors and InvalidOperationException (nullable crashes) in the production-like TST environment.
- **Task:** Harden the simulation engine's reliability and prevent the "target machine actively refused it" errors from crashing the UI.
- **Action:**
  - I implemented defensive programming by replacing .Value calls on nullables with explicit .HasValue checks.
  - I architected a connectivity guard that returns a graceful HTTP 503 ProblemDetails instead of a hard crash when the internal engine is unreachable.
  - I updated the Docker/Local networking configuration to use host.docker.internal for local development resilience.
- **Result:** Eliminated high-severity null-reference crashes and provided the UI team with clear error messaging for better incident triage.

### 4) UI Performance: AG Grid "Blanks" & State Persistence
- **Situation:** Pharmacists reported that the Intervention Queue was losing its filter state when switching between tabs (e.g., RPH vs. SOC queues), and they couldn't filter for "Blanks" in the phone number column.
- **Task:** Ensure a persistent, intuitive filtering experience across a high-traffic Angular dashboard.
- **Action:**
  - I refactored the InterventionQueueGridFacade to guard against clobbering user-set filters during tab transitions.
  - I customized the AG Grid Set Filter valueFormatter to explicitly map null/empty values to a visible "(Blanks)" label.
  - I utilized RxJS takeUntilDestroyed to prevent memory leaks in these long-lived grid components.
- **Result:** Improved operational efficiency for the pharmacy team by 15-20% by reducing rework and tab-switching.

### Key Technical Proficiencies (Excellus Context)
- **Backend:** C#/.NET 8, Azure Functions (Isolated Worker), Azure Cognitive Search, Newtonsoft.Json.
- **Frontend:** Angular (v18/19), AG Grid Enterprise, NgRx Store, RxJS, PrimeNG.
- **DevOps:** Azure Pipelines, Terraform, Docker, Microsoft Azure Identity (App Config/Key Vault).
- **Testing:** Jest (Angular), Moq/XUnit (.NET)

---

## Profile
- **Name:** Chetan Chandane
- **Title:** Software Engineer
- **Education / School:** Rochester Institute of Technology (RIT)
- **Links:** GitHub (https://github.com/chetanchandane), LinkedIn (https://www.linkedin.com/in/chetanchandane/), Medium (https://medium.com/@chetanchandane013)

## Relevant Coursework
- Artificial Intelligence
- Intro to Machine Learning
- Computer Vision
- Intro to Big Data
- Database Implementation
- Data Structures and Algorithms
- Advanced Object-Oriented Programming with Java
- Problem Solving with Python

## Career History

### Full Stack Engineer Intern — Excellus Blue Cross Blue Shield (2025 – Current)
- Frontend Development, Backend Development
- **Stack at Excellus:** Angular, ASP.NET, Azure

### Machine Learning Engineer — Rochester Institute of Technology (2024 – 2025)
- Machine Learning, Data Analysis, Predictive Modeling

### Software Engineer — Vodafone Intelligent Solutions, Pune, India (Oct 2020 – Jun 2023)
- Engineered enterprise automation platform integrating ServiceNow with internal ITSM systems via REST APIs, webhooks, and event-driven architecture, eliminating 30% of manual workflows and processing 5,000+ incident/change requests monthly across global operations.
- Built and maintained CI/CD infrastructure using Jenkins, Git, and Maven for 15+ microservices, achieving 25% faster deployments and 99.5% build success rate through automated testing and standardized release pipelines.
- Designed ELK Stack observability solution with custom dashboards and automated alerting for SLA compliance, reducing mean time to resolution (MTTR) by 15% and preventing 50+ production incidents through proactive monitoring.
- **Tech:** AWS, DevOps Engineering, CI/CD Pipelines, Automation, ServiceNow, Jenkins, Maven, ELK Stack

## Expertise Areas

### Full Stack Web Development
- End-to-end web applications: Angular, .NET APIs, responsive UIs
- Tech: React, Angular, ASP.NET, Node.js, TypeScript, JavaScript, HTML5, CSS3, SASS, Flask, Python, SQL, PostgreSQL, Postman, Java, C#

### DevOps & Automation
- CI/CD, automated testing, containerized deployments
- Tech: Git, GitHub Actions, Docker, Terraform, AWS, Azure, Azure DevOps, Linux, Pandas

### GenAI & LLM
- Semantic search, RAG pipelines, LLM-powered automation, LangSmith
- Tech: OpenAI, Groq, LangChain, LangGraph, Qdrant, Hugging Face, Streamlit

### Databases
- Postgres, MySQL, MongoDB, Supabase, AWS DynamoDB, Azure Cosmos DB
- Vector Databases: ChromaDB, Pinecone

### Certifications
- AWS Certified Cloud Practitioner
- AWS Certified Solutions Architect - Associate

### Algorithms & Data Structures
- Regular LeetCode practice across core patterns and structures.
- **Topics:** arrays, lists, linked lists, trees, heaps, intervals, binary search, sorting, and more.
- Strong foundation in problem-solving and algorithmic thinking.

## Personal Projects

## Projects

### 🍎 Cloud Native (AWS) AI-powered Nutrition Assistant
**Aliases:** Nutri AI, AWS Nutrition Assistant, Cloud-native nutrition assistant  
**Repo:** https://github.com/chetanchandane/cloud-native-aws-application  
**Stack / Skills:** React + Amplify, AWS Lambda (Node.js), API Gateway, S3 (pre-signed uploads + CORS), DynamoDB, Cognito, OCR (AWS Rekognition + Textract), LLM integration (GPT-4o Turbo), Terraform (modular IaC), GitHub Actions CI/CD

**What it is (idea):**
- AI-powered **serverless** app that lets users upload food images and receive **nutrition insights** + **personalized dietary recommendations**.

**How I did it (implementation):**
- Built a web upload flow using **pre-signed S3 URLs** and a serverless backend.
- Implemented OCR using **Rekognition + Textract**, then used **GPT-4o Turbo** to generate personalized diet recommendations.
- Stored meal logs/results in **DynamoDB** and exposed them through REST endpoints.
- Automated infra provisioning and deployment using **Terraform modules** + **GitHub Actions** (input-driven apply/destroy).

**Key APIs / flow:**
- \`GET /upload-url\` → returns pre-signed S3 URL for upload
- \`POST /process-image\` → triggers OCR + GPT processing + stores output in DynamoDB
- \`GET /result/{image_key}\` → fetches nutrition insights
- \`GET /meal-logs?date=YYYY-MM-DD&user_id=\` → retrieves user meal logs

**RAG-friendly Q&A anchors (what to ask me):**
- “How did you design the S3 upload flow?” → pre-signed URL + CORS + serverless pipeline
- “What was your OCR approach?” → Rekognition/Textract → LLM reasoning
- “How did you handle infrastructure and CI/CD?” → Terraform modules + GitHub Actions workflow_dispatch

---

### 🏥 TriageAI — Agentic Patient Portal Triage System (RIT Capstone)
**Aliases:** Agentic Patient Portal, AI triage portal, multi-agent triage system  
**Stack / Skills:** LangGraph (multi-agent state machine), Gemini 2.5 Flash (Google GenAI SDK), LangSmith (tracing/eval), Streamlit (patient + staff portals), Supabase Postgres (profiles/messages + RLS), Pydantic schemas, optional in-memory demo mode

**What it is (idea):**
- Autonomous **agentic AI** system that transforms free-text **patient portal messages** into structured clinical actions:
  - triage intent + urgency
  - route to clinical queues
  - produce structured summaries/checklists (policy-grounded drafts/checklists are described as a goal; parts are planned)

**How I did it (implementation):**
- Built a **Streamlit** app with login/register and persistent patient identity context (patient ID, name, email).
- Implemented two views:
  - **Patient view:** submit messages + see triage result and personal history
  - **Staff view:** see all patient messages grouped by patient identity with triage results
- Defined a structured output schema (\`TriageResult\`) with intent, urgency, summary, checklist, and recommended queue.
- Storage is configurable:
  - Supabase-backed (tables + RLS via \`supabase_schema.sql\`)
  - in-memory demo mode (no persistence after restart)
- Target agent architecture includes planned agents (Safety Agent, Policy Agent (RAG via ChromaDB), and Human-in-the-loop).

**RAG-friendly Q&A anchors:**
- “How is it agentic?” → LangGraph multi-agent state machine + structured output
- “How do patient/staff experiences differ?” → two-tab Streamlit UI with identity + grouping
- “What’s implemented vs planned?” → triage agent implemented; safety/policy RAG/HITL listed as planned

---

### ✍️ Github2Blog — Repo → Dev.to Blog (LangGraph + OpenAI)
**Aliases:** Git2Blog, GitHub-to-blog agent, Dev.to auto publisher  
**Stack / Skills:** Python, FastAPI, LangGraph, LangChain, OpenAI, PyGithub (GitHub API), Dev.to API, Uvicorn, dotenv

**What it is (idea):**
- Agentic workflow that takes a **GitHub repository URL**, analyzes the repo, generates a **technical blog post (Markdown)**, and **publishes to Dev.to**.

**How I did it (implementation):**
- Designed a LangGraph pipeline with explicit nodes:
  1) Orchestrator (initial state)
  2) \`code_retriever\` (fetch + classify top-level repo files)
  3) \`metadata_parser\` (stars/forks/language/description/updated_at)
  4) \`component_summarizer\` (LLM summaries using file snippets)
  5) \`blog_generator\` (full Markdown post)
  6) \`publisher\` (publishes Markdown to Dev.to via API)
- Configured the workflow via \`.env\` using GitHub token, OpenAI key, and Dev.to API key.
- Ran via a \`__main__\` block containing a list of target repos.

**RAG-friendly Q&A anchors:**
- “How does it analyze a repo?” → GitHub API + file classification + summarization
- “What’s the pipeline?” → orchestrator → retrieve → metadata → summarize → generate → publish
- “How does publishing work?” → Dev.to API with final Markdown payload

---

### 🔐 Secure Infrastructure Automation (Bash + Ansible + Terraform + Mock Vault)
**Aliases:** secure-infra-automation, one-command infra provisioning, mock CyberArk vault demo  
**Stack / Skills:** Terraform (AWS EC2 + Security Groups), Ansible (Apache setup, user creation, secret injection), Flask mock vault API (CyberArk simulation), Bash orchestration (\`provision.sh\`), secure secret handling (permissions), AWS EC2

**What it is (idea):**
- Fully automated provisioning + configuration + **secure secret injection** into a cloud VM, executed via a **single command**.

**How I did it (implementation):**
- Terraform provisions an **EC2 instance** and security groups.
- A local Flask service acts as a mock vault, simulating CyberArk secret retrieval.
- Ansible configures the instance:
  - installs Apache
  - creates a \`devops\` user
  - injects secrets onto the instance
- Secrets are stored at \`/etc/app/secrets.env\` with strict permissions (\`0600\`).
- All logs captured (e.g., \`logs/provision.log\`) to support debugging and traceability.

**RAG-friendly Q&A anchors:**
- “How did you handle secrets?” → token-protected mock vault API + Ansible injection + strict file perms
- “Whats one-command deployment?” → \`cd scripts && ./provision.sh\`
- “How do you verify it worked?” → SSH → check Apache, check secrets, check \`devops\` user

---

### 🧩 WebApp Clone — Backend (Auth + File Uploads)
**Aliases:** backend-project-nodejs, Express auth backend, Cloudinary upload API  
**Repo:** https://github.com/chetanchandane/backend-project-nodejs  
**Stack / Skills:** Node.js, Express, MongoDB, Mongoose, JWT auth, bcrypt hashing, Multer uploads, Cloudinary storage, CORS, dotenv, Nodemon

**What it is (idea):**
- Backend for a web application providing:
  - user authentication (JWT + bcrypt)
  - file uploads (Multer → Cloudinary)
  - MongoDB persistence

**How I did it (implementation):**
- Implemented secure login/registration using JWT tokens + password hashing (bcrypt).
- Built file upload pipeline using Multer middleware and Cloudinary as storage.
- Structured persistence via Mongoose models and environment-driven configuration.

**RAG-friendly Q&A anchors:**
- “How does auth work?” → JWT + bcrypt + MongoDB
- “How do file uploads work?” → Multer middleware → Cloudinary upload
- “How is the app configured?” → \`.env\` vars (Mongo URI, token secrets, Cloudinary keys)

---

### ✅ Spring Boot Todo Application (JSP + Bootstrap)
**Aliases:** springboot-todo-webapp, JSP Todo app  
**Repo:** https://github.com/chetanchandane/springboot-todo-webapp  
**Stack / Skills:** Java, Spring Boot, Spring MVC, JSP, Bootstrap + jQuery (WebJars), Maven, validation, embedded Tomcat/Jasper/JSTL

**What it is (idea):**
- Todo app with CRUD operations (add/update/delete/view) and a server-rendered JSP UI.

**How I did it (implementation):**
- Built domain + controller + service layers (Todo model, controller, service).
- Implemented input validation using Spring Boot Validation.
- Used a static list as storage (not DB yet; DB integration is a noted future enhancement).
- Exposed RESTful endpoints and JSP pages for listing/adding/updating todos.

**Endpoints (from README):**
- \`GET /api/v1/list-todos\` → display all todos
- \`GET /api/v1/add-todo\` → render add todo page
- \`POST /api/v1/add-todo\` → add new todo
- \`GET /api/v1/update-todo\` → render update page
- \`POST /api/v1/delete-todo\` → delete todo by id

---

### 💬 Ask Chetan — Portfolio AI Chatbot
**Aliases:** Ask Chetan, portfolio chatbot, Digital Twin, ChetanAI, portfolio chat  
**Live:** https://chetanchandane.vercel.app  
**Stack / Skills:** React, TypeScript, SCSS, MUI (Material-UI) icons, react-markdown, sessionStorage, Vercel serverless functions (Node.js), Express (local dev), Google Gemini 2.5 Flash (@google/genai), context-injection / RAG-lite (no vector DB), dotenv

**What it is (idea):**
- AI chatbot embedded in my portfolio that answers visitor questions in **first person** (as me), using only a curated **knowledge base** — no hallucination. Visitors can ask about my background, experience, projects, or tech stack; the bot responds in a fun, professional tone with optional emojis.

**How I did it (implementation):**
- **Frontend:** Chat UI (ChatTab) with message bubbles, typing indicator, quick-question buttons, Clear chat, and social links (LinkedIn, GitHub, Medium, Gmail). Messages and chat history persisted in **sessionStorage** so they survive tab switches. Markdown rendering for assistant replies via react-markdown. Placed the chat section right below the hero so visitors see it immediately.
- **Backend:** Vercel serverless \`api/chat.js\` that validates input (roles, message count/size caps), injects a system prompt + full knowledge base into each request (prompt-caching friendly), and calls **Gemini 2.5 Flash** with low temperature. Strict fallback message when the answer isn’t in the KB. For local dev, added an **Express** server (\`api-server.js\`) that mounts the same handler and runs on port 3001, with Create React App proxy so \`/api/chat\` works.
- **Knowledge base:** Single \`knowledgeBase.js\` (Markdown string) as the single source of truth; no vector DB — “RAG-lite” context injection. Prompt instructs the model to answer only from the KB and to respond in first person with a mentor-like tone.

**Problems we ran into and how we solved them:**
- **Backend not available locally:** With only \`npm start\`, the React app ran but \`/api/chat\` didn’t exist (no serverless on CRA). We added a small Express server (\`npm run api\`) and a \`proxy\` in \`package.json\` so the frontend forwards \`/api/chat\` to localhost:3001.
- **Gemini ignoring the knowledge base:** The model replied as if it had no context. The \`@google/genai\` SDK expects \`systemInstruction\` inside \`config\`, not as a top-level parameter. We moved \`systemInstruction\` into \`config\` so the KB and instructions were actually sent.
- **Chat window scrolling off-screen on send:** \`scrollIntoView\` on the messages end was scrolling the **whole page**, pushing the chat section out of view. We switched to scrolling only the messages container: \`listRef.current.scrollTop = listRef.current.scrollHeight\`.
- **Social/action button colors disappearing in light mode:** A generic \`.light-mode .chat-social-link\` rule was applied after the branded overrides (LinkedIn blue, GitHub black, Gmail red), so it overwrote them. We reordered the CSS so the branded modifier classes (e.g. \`--linkedin\`, \`--gmail\`) come **after** the base light-mode rule and retain their colors.
- **GEMINI_API_KEY not loaded for local API:** The Create React App dev server doesn’t run the API; the separate Node process didn’t load \`.env\`. We added \`dotenv\` and \`require('dotenv').config()\` at the top of \`api-server.js\` so the key is loaded when running \`npm run api\`.
- **Raw errors (e.g. 503) shown to users:** We replaced all API-failure UI with a single in-chat assistant message (e.g. “Something went wrong on the backend, my human self has been notified, please email me”) and log the real error to the console for debugging.

**RAG-friendly Q&A anchors (what to ask me):**
- “Tell me about your portfolio chatbot” / “Ask Chetan” → RAG-lite, Gemini 2.5 Flash, first-person, sessionStorage, Vercel serverless
- “What problems did you hit building the chatbot?” → systemInstruction in config, scrollIntoView vs container scroll, light-mode CSS order, dotenv for local API, generic error message in UI
- “What’s the tech stack for Ask Chetan?” → React, TypeScript, SCSS, MUI, react-markdown, Vercel serverless, Express (local), Gemini 2.5 Flash, knowledgeBase.js, no vector DB

---

## Additional Projects (brief)
- **Nutri AI:** Serverless nutrition platform; analyzes food images and calculates nutrients using React, AWS, and GPT-4o.
- **Git2Blog Agentic AI:** LangGraph pipeline that analyzes GitHub repos, generates technical blog posts with AI, and publishes to DEV.to.
- **Triage AI (WIP):** Multi-agent AI system to transform free-text patient messages into structured clinical actions.
- **AWS Containerized Blog:** Containerized WordPress + MySQL with Docker; deployment via AWS ECR.
- **AWS SecureOps:** End-to-end infrastructure automation (Ansible, Bash, Terraform).
- **Deep Learning Image Synthesis (ML):** VGG19-based Neural Style Transfer with PyTorch.
- **California Housing: KDD Analytics Pipeline (ML):** KDD process, DBSCAN/LOF, regression modeling.
`.trim();

module.exports = { KNOWLEDGE_BASE };
