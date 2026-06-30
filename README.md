# LifeByte AI

> AI-powered personal life management companion designed to help users organize, plan, and accomplish responsibilities before deadlines are missed.

## Problem Statement

### Track: The Last-Minute Life Saver

Traditional productivity applications rely on passive reminders and static checklists that are frequently ignored. They provide little assistance in helping users begin or complete tasks.

LifeByte AI transforms productivity management into a conversational, proactive, and intelligent experience.

Instead of merely reminding users, LifeByte AI helps users:

- Understand what needs to be done.
- Break large goals into manageable actions.
- Organize schedules intelligently.
- Convert intentions into immediate action.

---

## Solution Overview

LifeByte AI is a multimodal AI productivity companion built using Google's AI and Cloud ecosystem.

Users can interact naturally using:

- Voice commands
- Conversational AI
- Manual task creation
- File uploads

The system automatically understands context, extracts deadlines, categorizes tasks, and generates actionable plans.

---

## Key Features

### 🎙️ Voice-First Productivity

Create tasks naturally through speech.

Example:

> "Prepare slides for tomorrow's client meeting."

---

### 🤖 Conversational AI Companion

Interact with LifeByte AI naturally.

Examples:

- Plan my week.
- Help me prepare for an interview.
- Organize my study schedule.

---

### 📋 Intelligent Task Planning

Large tasks are automatically broken into manageable subtasks.

Example:

**Input:**

> Prepare for semester examinations.

**Generated subtasks:**

- Organize study material
- Create revision schedule
- Solve practice papers
- Final revision

---

### 🎯 Goal and Milestone Planning

Transform long-term goals into structured roadmaps.

Examples:

- Learn Python
- Crack GATE
- Launch a startup

---

### 📁 Privacy-First File Intelligence

Upload documents securely.

Modes:

- 🔒 Attach Only
- 🤖 AI Analyze

Supported files:

- PDFs
- Images
- Tickets
- Documents
- Screenshots

---

### 📅 Interactive Calendar Workspace

- Calendar view
- List view
- Priority tracking
- Deadline visualization
- Schedule management

---

## Google Technologies Used

### Google Gemini 2.5 Flash

Used for:

- Conversational assistance
- Task planning
- Intent extraction
- File understanding
- Goal generation

### Google Cloud Run

Hosts the containerized full-stack application.

### Google Cloud Firestore

Stores:

- Tasks
- Goals
- Conversations
- User preferences

### Firebase Authentication

Provides secure Google Sign-In and personalized experiences.

---

## Architecture

(Add your existing architecture diagram here)

---

## Technology Stack

### Frontend

- React
- TypeScript
- Vite
- Tailwind CSS

### Backend

- Node.js
- Express.js

### Database

- Cloud Firestore

### Authentication

- Firebase Authentication

### Deployment

- Google Cloud Run

---

## Local Setup

### Install dependencies

```bash
npm install
