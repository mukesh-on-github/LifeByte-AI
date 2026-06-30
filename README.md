# <img src="https://raw.githubusercontent.com/mukesh-on-github/LifeByte-AI/main/src/assets/images/lifebyte_ai_logo_1782835328297.jpg" width="48" height="48" align="center" style="border-radius: 12px; margin-right: 8px;" /> LifeByte AI — Personal Life Management Companion

> **"The Last-Minute Life Saver"**  
> An AI-powered, proactive personal productivity companion designed to plan, structure, and execute life's responsibilities before deadlines are missed.

<div align="left">
  <img src="https://img.shields.io/badge/Vibe2Ship_Hackathon-Coding_Ninjas_x_Google-orange.svg" alt="Vibe2Ship Hackathon" />
  <img src="https://img.shields.io/badge/Deployed-Google_Cloud_Run-blue.svg" alt="Google Cloud Run" />
  <img src="https://img.shields.io/badge/AI_Engine-Gemini_2.5_Flash-purple.svg" alt="Gemini 2.5 Flash" />
  <img src="https://img.shields.io/badge/Database-Cloud_Firestore-yellow.svg" alt="Cloud Firestore" />
  <img src="https://img.shields.io/badge/Auth-Firebase_Authentication-success.svg" alt="Firebase Authentication" />
</div>

---

## 🚀 Live Application

🌐 **Production Deployment:**  
https://ais-dev-k2y5wjpmgnozxaanfhfurm-948392883139.asia-east1.run.app

🧪 **Sandbox Environment:**  
https://ais-pre-k2y5wjpmgnozxaanfhfurm-948392883139.asia-east1.run.app

---

## 🎯 Problem Statement

### Challenge Statement: **The Last-Minute Life Saver**

Traditional productivity applications fail because they rely heavily on passive reminders, static checklists, and repetitive manual input.

These systems:

- Depend on notifications that are frequently ignored.
- Require tedious task configuration and categorization.
- Do not assist users in taking meaningful action.
- Increase planning overhead and decision fatigue.

Modern students, professionals, creators, and entrepreneurs need more than reminders. They need an intelligent companion capable of understanding context, structuring work, and guiding execution.

---

## 💡 Solution Overview

**LifeByte AI** transforms productivity management from a passive experience into an intelligent, conversational, and proactive workflow.

Users interact naturally through:

- 🎙️ Voice commands
- 💬 Conversational AI
- 📄 File uploads
- ✍️ Manual task creation

Powered by **Google Gemini 2.5 Flash**, LifeByte AI automatically:

- Understands user intent.
- Extracts deadlines from natural language.
- Categorizes tasks intelligently.
- Generates actionable subtasks.
- Creates long-term milestone roadmaps.
- Organizes schedules and deadlines.

Large responsibilities become manageable, actionable, and significantly easier to execute.

---

# ✨ Core Features

## 🎙️ Voice-Enabled Natural Language Assistant

Speak naturally.

Example:

> "Need to finish the presentation for tomorrow afternoon."

LifeByte AI automatically:

- Transcribes speech.
- Detects task category.
- Determines priority.
- Maps natural dates to calendar events.
- Creates structured tasks instantly.

---

## 💬 Conversational AI Companion

Interact with LifeByte AI as a personal productivity partner.

Examples:

- Plan my week.
- Help me prepare for interviews.
- Organize my study schedule.
- Prioritize today's tasks.

The assistant supports multi-turn conversations and contextual productivity guidance.

---

## 📋 Intelligent Task Planner & Subtask Generator

Large tasks are automatically decomposed into logical milestone steps.

Example:

### User Input

> "Prepare for semester examinations."

### Generated Checklist

- Organize study materials.
- Create revision schedule.
- Solve previous year papers.
- Review weak concepts.
- Final revision.

This reduces procrastination and decision fatigue.

---

## 🎯 Long-Term Goal Planner

Transform aspirations into structured roadmaps.

Examples:

- Learn Python.
- Crack GATE.
- Launch a startup.
- Build a portfolio.

LifeByte AI generates:

- Milestones.
- Timelines.
- Progress checkpoints.
- Actionable plans.

---

## 📁 Privacy-First File Intelligence Vault

Upload:

- PDFs
- Images
- Documents
- Tickets
- Invoices
- Screenshots

Each attachment supports two privacy modes:

### 🔒 Attach Only

Files remain securely stored without AI access.

### 🤖 AI Analyze

Gemini analyzes files and extracts:

- Executive summaries.
- Important information.
- Immediate action items.

---

## 📅 Interactive Multimodal Workspace

Supports:

- Task List View
- Calendar View
- Drag-and-drop scheduling
- Priority visualization
- Deadline tracking
- Rescheduling workflows

---

## 📖 Guided Onboarding Experience

Personalized onboarding customizes recommendations according to user profiles:

- Student
- Professional
- Entrepreneur
- Creator

The onboarding experience familiarizes users with voice commands, AI interactions, and productivity workflows.

---

# 🏗️ Technical Architecture

```text
                  ┌─────────────────────────────────────────────┐
                  │                 User Browser               │
                  │      React + TypeScript + Tailwind CSS    │
                  └─────────────────────┬──────────────────────┘
                                        │
                               HTTP / Firestore Streams
                                        │
                                        ▼

┌──────────────────────────────────────────────────────────────────────────────┐
│                           Google Cloud Infrastructure                       │
│                                                                              │
│   ┌──────────────────────────┐       OAuth 2.0      ┌────────────────────┐  │
│   │ Firebase Authentication  ├─────────────────────►│ Google Sign-In     │  │
│   └──────────────────────────┘                      └────────────────────┘  │
│                                                                              │
│   ┌──────────────────────────┐                      ┌────────────────────┐  │
│   │ Cloud Firestore          │                      │ Firebase Storage   │  │
│   │ Real-time Persistence    │                      │ Secure Attachments │  │
│   └──────────────────────────┘                      └────────────────────┘  │
│                                                                              │
│   ┌──────────────────────────────────────────────────────────────────────┐   │
│   │                     Google Cloud Run Container                     │   │
│   │                                                                    │   │
│   │    Node.js + Express Backend API Proxy                             │   │
│   │                                                                    │   │
│   │    Secure Communication with Gemini 2.5 Flash                      │   │
│   │                                                                    │   │
│   └──────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

# 🌟 Google Technologies Utilized

## 🧠 Google Gemini 2.5 Flash (`@google/genai`)

Gemini acts as the central reasoning engine.

Capabilities:

- Conversational assistance.
- Task planning.
- Intent extraction.
- Goal generation.
- Voice understanding.
- File analysis.
- Subtask generation.

---

## ☁️ Google Cloud Run

The complete full-stack application is containerized and deployed on Google Cloud Run.

Benefits:

- Serverless architecture.
- Automatic scaling.
- High availability.
- Fast deployment cycles.

---

## 🗄️ Google Cloud Firestore

Cloud Firestore powers:

- Task persistence.
- Goal tracking.
- Conversation history.
- User preferences.
- Real-time synchronization.

---

## 🔐 Firebase Authentication

Provides:

- Secure Google Sign-In.
- Persistent sessions.
- Personalized AI experiences.

---

## 📦 Firebase Storage

Used for:

- Secure file uploads.
- Attachment management.
- Document storage.
- AI-powered document processing.

---

# 🛠️ Technology Stack

## Frontend

- React 18
- TypeScript
- Vite
- Tailwind CSS

## Backend

- Node.js
- Express.js

## Database

- Cloud Firestore

## Authentication

- Firebase Authentication

## Storage

- Firebase Storage

## Routing

- React Router DOM

## Animation

- Framer Motion

## Icons

- Lucide React

---

# 🛡️ Resilience & Reliability

LifeByte AI incorporates intelligent local fallback mechanisms.

If:

- Network connectivity degrades.
- Firestore becomes unavailable.
- Gemini API quotas are exhausted.

The application gracefully switches to local fallback services to maintain uninterrupted productivity.

Features supported by fallback mechanisms include:

- Offline task categorization.
- Backup conversational assistance.
- Template-based task decomposition.
- Attachment classification.

---

# ⚙️ Local Development

## Prerequisites

- Node.js v18+
- npm

## Install Dependencies

```bash
npm install
```

## Configure Environment Variables

Create a `.env` file.

```env
PORT=3000

GEMINI_API_KEY=

VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

## Start Development Server

```bash
npm run dev
```

---

# 🚢 Production Deployment

LifeByte AI is deployed using **Google Cloud Run**.

Build:

```bash
npm run build
```

Run:

```bash
npm run start
```

---

# 🎨 Design Philosophy

- Professional and minimal.
- Privacy-first architecture.
- Multimodal interaction.
- AI-assisted productivity.
- Reduced cognitive load.
- Clean, accessible user experience.

---

# 🏆 Hackathon Submission

Built for the **Vibe2Ship Hackathon by Coding Ninjas × Google**.

LifeByte AI reimagines productivity by transforming static task management into an intelligent, conversational, and proactive experience.
