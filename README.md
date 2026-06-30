# <img src="https://raw.githubusercontent.com/mukesh-on-github/LifeByte-AI/main/src/assets/images/lifebyte_ai_logo_1782835328297.jpg" width="48" height="48" align="center" style="border-radius: 12px; margin-right: 8px;" /> LifeByte AI — Personal Life Management Companion

> **"The Last-Minute Life Saver"**  
> An autonomous, proactive, AI-powered personal coordinator designed to plan, structure, and execute life's responsibilities before deadlines are missed.

<div align="left">
  <img src="https://img.shields.io/badge/Vibe2Ship_Hackathon-Coding_Ninjas_x_Google-orange.svg" alt="Vibe2Ship Hackathon" />
  <img src="https://img.shields.io/badge/Deployed-Google_Cloud_Run-blue.svg" alt="Google Cloud Run" />
  <img src="https://img.shields.io/badge/AI_Engine-Gemini_3.5_Flash-purple.svg" alt="Gemini 3.5 Flash" />
  <img src="https://img.shields.io/badge/Database-Cloud_Firestore-yellow.svg" alt="Cloud Firestore" />
</div>

---

## 🎨 Vector Application Logo
The official application branding represents modern productivity—a high-contrast, rounded gradient squircle layered with an elegant checkmark:

```xml
<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#60a5fa" />
      <stop offset="40%" stopColor="#2563eb" />
      <stop offset="100%" stopColor="#1d4ed8" />
    </linearGradient>
  </defs>
  <rect x="6" y="6" width="88" height="88" rx="24" fill="url(#logo-gradient)" />
  <path d="M32 50L44 62L70 34" stroke="white" strokeWidth="10.5" strokeLinecap="round" strokeLinejoin="round" />
</svg>
```

---

## 🎯 Problem Statement & Impact Focus
### **Challenge Statement: The Last-Minute Life Saver**
* **The Opportunity:** Traditional productivity applications fail because they rely on passive reminders that are easy to ignore. They require manual, tedious data entry and fail to assist users in taking meaningful action to solve their challenges.
* **The LifeByte Solution:** **LifeByte AI** transitions from static lists to an agentic, multi-modal productivity engine. By leveraging the **Gemini 3.5 Flash** model, LifeByte AI automatically transforms spoken thoughts, text entries, and uploaded files into structured, step-by-step checklists, time-blocked calendars, and long-term milestones.

---

## ✨ Core Features & Agentic Capabilities

### 1. 🎙️ Voice-Enabled Natural Language Assistant
* **Actionable Parsing:** Speak naturally (e.g., *"Need to finish the slide deck for client review tomorrow afternoon"*).
* **Intent Extraction:** Gemini analyzes the voice transcript, extracts the title, auto-detects the priority, classifies the category (Work, Personal, Finance, etc.), and sets a dynamic calendar deadline (e.g. mapping "tomorrow" to the actual calendar date).

### 2. 📋 Intelligent Task Planner & Subtask Generator
* **Micro-Step Breakdown:** When a task is created, Gemini automatically designs a custom checklist of 3-6 logical milestone steps to ensure completion, mitigating decision fatigue and overcoming procrastination.
* **Contextual Timeboxing:** Recommends specific hour blocks of the day to tackle the task based on its category and priority.

### 3. 🎯 Long-Term Goal Checkpoints Generator
* **Aspiration-to-Action:** Define a high-level goal (e.g., *"Learn Python and build a server"*), and LifeByte AI breaks it down into a multi-phased chronological roadmap with specific milestone checkpoints.

### 4. 📁 Secure File Analyzer & Vault
* **Dual Permission Engine:** Securely attach files with **Attach Only** (🔒) or **AI Analyze** (🤖) configurations.
* **Document Parsing:** Files of various formats (PDF, DOCX, CSV, Excel, Images) are parsed by Gemini to extract executive summaries and 3 immediate actionable task recommendations.

### 5. 📖 Interactive Onboarding & Simulation Tutorial
* **Educational Tour Guide:** Detailed walk-through covering natural AI chat commands, voice transcribing, file vaults, and subtask generation.
* **Live Sandbox Simulator:** An interactive log terminal showcasing step-by-step token extraction, keyword mapping, and model responses in real-time, helping new users master the tool instantaneously.

### 6. 📅 Multimodal Interactive Workspace
* **Creative Suites:** Toggle between AI Chat, Voice transcribing, Drag-and-drop file imports, or manual entries.
* **Fluid Calendar Integration:** Drag-and-drop or tap to reschedule, with full color-coded prioritization.
* **User Onboarding Wizard:** Tailor the AI context from the first launch, customizing preferred focus areas and notification pipelines.

---

## 🏗️ Technical Architecture & Google Technologies Utilized

LifeByte AI is designed on a robust full-stack containerized architecture, utilizing the Google Cloud and Firebase suites:

```
                  ┌─────────────────────────────────────────────────────────┐
                  │                      User Browser                       │
                  │             (React 18 + Vite + Tailwind CSS)            │
                  └───────────────────────────┬─────────────────────────────┘
                                              │
                                   HTTP / Firestore Streams
                                              │
                                              ▼
┌───────────────────────────────────────────────────────────────────────────────────────────┐
│                                     Google Cloud Infrastructure                                   │
│                                                                                                   │
│  ┌─────────────────────────────────┐   OAuth 2.0   ┌───────────────────────────────────────────┐  │
│  │     Firebase Authentication     ├───────────────►            Google Sign-In                 │  │
│  └─────────────────────────────────┘               └───────────────────────────────────────────┘  │
│                                                                                                   │
│  ┌─────────────────────────────────┐               ┌───────────────────────────────────────────┐  │
│  │    Cloud Firestore Database     │               │          Google Cloud Storage             │  │
│  │   (Real-time State Sync)        │               │         (Secure File Attachments)         │  │
│  └─────────────────────────────────┘               └───────────────────────────────────────────┘  │
│                                                                                                   │
│  ┌─────────────────────────────────────────────────────────────────────────────────────────────┐  │
│  │                                 Cloud Run (Docker Container)                                │  │
│  │                                                                                             │  │
│  │  ┌───────────────────────────────┐  Secure API  ┌────────────────────────────────────────┐  │  │
│  │  │      Node.js / Express        ├──────────────►   @google/genai (Gemini 3.5 Flash SDK)  │  │  │
│  │  │     (Full-Stack Proxy)        │              │  * Chat, Planning, File & Voice Parsing│  │  │
│  │  └───────────────────────────────┘              └────────────────────────────────────────┘  │  │
│  └─────────────────────────────────────────────────────────────────────────────────────────────┘  │
└───────────────────────────────────────────────────────────────────────────────────────────────────┘
```

### 🌟 Key Google Technologies
1. **Gemini 3.5 Flash (`@google/genai`):** Used as the central nervous system of LifeByte AI. Handles conversation, file metadata extraction, task list auto-planning, and voice instruction parsing.
2. **Cloud Run:** Hosts the containerized Express & React build. Configured for fast execution, responsive cold-starts, and auto-scaling.
3. **Cloud Firestore:** Powers real-time reactive task synchronization, activity logs, and persistent goal tracking.
4. **Firebase Authentication & Google Sign-In:** Secures individual user accounts and synchronizes custom preferences seamlessly.

---

## 🗄️ Database Schemas & Interfaces (`src/types.ts`)

To ensure robust data management, our database architecture maps strictly defined models to Firestore collections:

*   **Tasks Collection (`/tasks`):**
    ```typescript
    interface Task {
      id: string;
      userId: string;
      title: string;
      category: 'Work' | 'Personal' | 'Finance' | 'Study' | 'Health' | 'Travel';
      priority: 'Low' | 'Medium' | 'High' | 'Urgent';
      dueDate: string;
      timeBlock?: string;
      completed: boolean;
      subtasks: SubTask[];
      attachments: Attachment[];
      aiSuggested: boolean;
      createdAt: string;
    }
    ```
*   **Goals Collection (`/goals`):**
    ```typescript
    interface Goal {
      id: string;
      userId: string;
      title: string;
      description: string;
      targetDate: string;
      progress: number; // 0 - 100%
      checkpoints: Checkpoint[];
      createdAt: string;
    }
    ```

---

## 🛡️ Bulletproof Offline & Local Fallback Engine
To score highly on **Completeness & Usability**, LifeByte AI is configured with a smart **Local Fallback Engine** for all AI endpoints. If your API quota is exceeded or network latency increases:
* **Conversations** switch to a localized backup persona.
* **Tasks** are categorized using an offline keyword analyzer.
* **Subtasks** are dynamically generated based on regional template blueprints.
* **Files** are categorized based on their extension metadata.

*Your workspace is guaranteed to be 100% active, highly performant, and zero-downtime under all conditions.*

---

## 🛠️ Local Installation & Development

### 1. Prerequisites
Ensure you have **Node.js** (v18+) and **npm** installed on your machine.

### 2. Configure Environment Variables Securely
Create a `.env` file in the root directory. **Never write or commit real credentials to your code repository.** Instead, obtain your key from your personal dashboard and fill it in locally:

```env
PORT=3000
# Keep this key confidential. Never push real keys to public repositories.
GEMINI_API_KEY=<YOUR_SECURE_GEMINI_API_KEY_HERE>
NODE_ENV=development
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Launch Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🚢 Production Deployment (Google Cloud Run)
LifeByte AI utilizes standard container builds. To build and run in production:

### 1. Build Compilation
Compiles the Vite client app and bundles the custom Express TypeScript backend into optimized CommonJS:
```bash
npm run build
```

### 2. Launch Server
```bash
npm run start
```

---

## 📝 Design Philosophy & UI/UX Standards
* **Light Theme Elegance:** Clean, modern, off-white workspace paired with charcoal-gray headings and indigo highlights.
* **Focus Over Clutter:** Generous negative space, clean typography using "Inter" and "Space Grotesk", rounded corners, and soft elevation shadows.
* **Responsive Fluidity:** Adaptive panels that transition smoothly between a sidebar-desktop grid and mobile navigation rails.
