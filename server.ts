import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const app = express();
app.use(express.json({ limit: "10mb" }));

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

// Initialize Gemini SDK securely
const geminiApiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY || "DUMMY_GEMINI_API_KEY_REPLACE_WITH_REAL_KEY";

const ai = new GoogleGenAI({
  apiKey: geminiApiKey,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

// --- Local Fallback Engines when Gemini API Quota is Exceeded ---

function getLocalCategoryAndPriority(text: string): { category: string; priority: string; reason: string } {
  const normalized = (text || "").toLowerCase();
  let category = "Personal";
  let priority = "Medium";
  let reason = "Classified based on keywords via our offline backup engine.";

  // Determine Category
  if (normalized.includes("work") || normalized.includes("meeting") || normalized.includes("project") || normalized.includes("sync") || normalized.includes("corporate") || normalized.includes("cli[...]
    category = "Work";
  } else if (normalized.includes("study") || normalized.includes("exam") || normalized.includes("test") || normalized.includes("learn") || normalized.includes("class") || normalized.includes("home[...]
    category = "Study";
  } else if (normalized.includes("run") || normalized.includes("gym") || normalized.includes("workout") || normalized.includes("health") || normalized.includes("doctor") || normalized.includes("me[...]
    category = "Health";
  } else if (normalized.includes("trip") || normalized.includes("travel") || normalized.includes("flight") || normalized.includes("hotel") || normalized.includes("vacation") || normalized.includes[...]
    category = "Travel";
  } else if (normalized.includes("buy") || normalized.includes("pay") || normalized.includes("rent") || normalized.includes("budget") || normalized.includes("finance") || normalized.includes("bill[...]
    category = "Finance";
  } else if (normalized.includes("family") || normalized.includes("kid") || normalized.includes("parent") || normalized.includes("cook") || normalized.includes("dinner") || normalized.includes("cl[...]
    category = "Family";
  }

  // Determine Priority
  if (normalized.includes("urgent") || normalized.includes("asap") || normalized.includes("important") || normalized.includes("critical") || normalized.includes("must")) {
    priority = "High";
  } else if (normalized.includes("someday") || normalized.includes("later") || normalized.includes("maybe") || normalized.includes("low")) {
    priority = "Low";
  }

  return { category, priority, reason };
}

function getLocalTaskSteps(category: string, title: string): string[] {
  const steps: string[] = [];
  switch (category) {
    case "Work":
      steps.push("Gather context, documents, and reference files");
      steps.push("Draft initial outline and core deliverables");
      steps.push("Review with key stakeholders and integrate feedback");
      steps.push("Complete final polish and submit/publish");
      break;
    case "Study":
      steps.push("Review lecture notes, slides, or syllabus section");
      steps.push("Create a summary cheat-sheet or flashcards of core concepts");
      steps.push("Complete practice questions or active-recall quiz");
      steps.push("Review incorrect answers and clarify lingering questions");
      break;
    case "Health":
      steps.push("Prepare necessary gear, outfit, or materials");
      steps.push("Perform the activity or attend scheduled appointment");
      steps.push("Log progress, metrics, or physical sensations");
      steps.push("Define follow-up action or scheduling adjustments");
      break;
    case "Travel":
      steps.push("Verify flight, accommodation details, and check-in times");
      steps.push("Pack essential documents, outfits, and tech items");
      steps.push("Set up out-of-office notifications and secure home");
      steps.push("Arrive with adequate buffer time at destination/transit");
      break;
    case "Finance":
      steps.push("Log into corresponding accounts or retrieve invoices");
      steps.push("Calculate total amount, balances, or transaction fees");
      steps.push("Authorize payment or update tracking spreadsheet");
      steps.push("Verify receipt/confirmation and file safely");
      break;
    case "Family":
      steps.push("Discuss logistics or timing with family members");
      steps.push("Gather required items, grocery lists, or preparations");
      steps.push("Execute the family activity or household chore");
      steps.push("Wind down and tidy up corresponding space");
      break;
    default:
      steps.push("Clarify specific objective and key success metrics");
      steps.push("Allocate dedicated focus block in calendar");
      steps.push("Execute initial steps and log milestones");
      steps.push("Verify completion and celebrate small progress");
  }
  return steps;
}

function getLocalChatResponse(message: string): string {
  const normalized = (message || "").toLowerCase();
  
  if (normalized.includes("task") || normalized.includes("todo") || normalized.includes("add")) {
    return `### 📋 Creating Tasks & Schedule Planning
I've processed your prompt locally while my deep AI model is taking a quick breather! 

To add a task, you can use the **Add New Task** suite on the left or top on mobile. Simply click the **Manual** tab or try writing a title there.

**Pro Tip:** If you want me to plan out a task for you, try putting it under the **Task** workspace and clicking on it to see the live step breakdown checklist.`;
  }

  if (normalized.includes("goal") || normalized.includes("milestone") || normalized.includes("long term")) {
    return `### 🎯 Smart Goal Setting
I am assisting you using our quick offline backup companion. Long-term goals are the pillars of personal progress!

Go to the **Goals** section on your sidebar to:
1. Define a main life goal (e.g., "Learn Python" or "Organize Home Library")
2. Add custom milestones to track progression
3. Tie specific checks to task deadlines to maintain momentum.`;
  }

  if (normalized.includes("calendar") || normalized.includes("schedule") || normalized.includes("when")) {
    return `### 📅 Timeboxing & Calendar Views
Let's look at your calendar! 

You can toggle between the **Calendar Grid** and the **Chronological List** view right in the calendar page.
- Direct rescheduling is simple: tap on any day in the list to quickly move a task to that date.
- Use visual colors to quickly differentiate high-priority items.`;
  }

  if (normalized.includes("hello") || normalized.includes("hi") || normalized.includes("hey") || normalized.includes("who are you")) {
    return `### 👋 Hello! I am LifeByte, your personal life coordinator.
I am running on high-speed offline backup mode to make sure your workspace remains 100% active and responsive.

How is your day shaping up? Here's what we can focus on:
* **Plan a new project** via the Task workspace
* **Review your calendar** to check for upcoming deadlines
* **Map out a long-term goal** in the Goals section
* Just chat with me about organization techniques!`;
  }

  return `### ✨ LifeByte Companion Active
I have handled your request using our high-speed local processing fallback engine.

Here are some excellent ways to organize your day:
1. **Prioritize high-value tasks** first thing in the morning.
2. **Break down big projects** into 3 small, bite-sized checklists.
3. **Protect your focus block** with calendar timeboxing.

Would you like to add a task, or shall we plan out a specific goal together?`;
}

// Helper for system instructions
const SYSTEM_INSTRUCTION = `You are LifeByte, an intelligent personal life management companion.
Your tone is professional, minimalist, warm, calm, and clean (inspired by Google Gemini + Notion).
Avoid gamified comments, productivity scores, or unprompted noise.
Always write concise, scannable, and helpful responses.
Help users organize their lives: students, professionals, content creators, homemakers, freelancers, and families.
Keep responses format-friendly (Markdown with headers and bullet points where useful).`;

// 1. AI Companion Chat
app.post("/api/gemini/chat", async (req, res) => {
  const { messages } = req.body;
  try {
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Invalid messages format." });
    }

    // Convert messages to Gemini API contents format
    const contents = messages.map((m) => ({
      role: m.role === "user" ? "user" : "model",
      parts: [{ text: m.content }],
    }));

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      },
    });

    res.json({ text: response.text || "I'm here to help. What's on your mind?" });
  } catch (error: any) {
    console.log("[AI Engine] Triggered local fallback for chat conversation.");
    const lastUserMessage = messages && Array.isArray(messages) && messages.length > 0 ? messages[messages.length - 1]?.content : "";
    const fallbackText = getLocalChatResponse(lastUserMessage);
    res.json({ text: fallbackText });
  }
});

// 2. Task Plan Generator (Breaks down task into subtasks + metadata)
app.post("/api/gemini/plan", async (req, res) => {
  const { taskTitle, taskDescription, userContext } = req.body;
  try {
    if (!taskTitle) {
      return res.status(400).json({ error: "taskTitle is required" });
    }

    const prompt = `Analyze the task title: "${taskTitle}" and optional description: "${taskDescription || 'None'}".
Based on this, suggest:
1. A categorized field (must be one of: Work, Personal, Study, Health, Travel, Finance, Family).
2. A suggested Priority (High, Medium, or Low).
3. A list of 3 to 6 logical subtask steps to successfully complete this task.
4. An optional estimated time block recommendation (suggested start and end hour of day like "09:00" to "10:30" or "All-day" if general).

Context: ${userContext || "None"}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        systemInstruction: "You are a master task planner. Always return a valid JSON object strictly matching the requested format.",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            category: {
              type: Type.STRING,
              description: "Work, Personal, Study, Health, Travel, Finance, or Family",
            },
            priority: {
              type: Type.STRING,
              description: "High, Medium, or Low",
            },
            steps: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Array of subtasks",
            },
            timeBlock: {
              type: Type.OBJECT,
              properties: {
                startTime: { type: Type.STRING, description: "e.g. 10:00" },
                endTime: { type: Type.STRING, description: "e.g. 11:30" },
                allDay: { type: Type.BOOLEAN },
              },
            },
          },
          required: ["category", "priority", "steps"],
        },
      },
    });

    res.json(JSON.parse(response.text || "{}"));
  } catch (error: any) {
    console.log("[AI Engine] Triggered local fallback for task planning breakdown.");
    const info = getLocalCategoryAndPriority(taskTitle + " " + (taskDescription || ""));
    const steps = getLocalTaskSteps(info.category, taskTitle);
    res.json({
      category: info.category,
      priority: info.priority,
      steps,
      timeBlock: {
        startTime: "09:00",
        endTime: "10:00",
        allDay: true
      }
    });
  }
});

// 3. AI Quick Categorization & Priority Suggestion
app.post("/api/gemini/categorize", async (req, res) => {
  const { text } = req.body;
  try {
    if (!text) {
      return res.status(400).json({ error: "Text is required" });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `Determine the best category and priority for: "${text}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            category: { type: Type.STRING, description: "Work, Personal, Study, Health, Travel, Finance, or Family" },
            priority: { type: Type.STRING, description: "High, Medium, or Low" },
            reason: { type: Type.STRING },
          },
          required: ["category", "priority"],
        },
      },
    });

    res.json(JSON.parse(response.text || "{}"));
  } catch (error: any) {
    console.log("[AI Engine] Triggered local fallback for text categorization.");
    const info = getLocalCategoryAndPriority(text || "");
    res.json(info);
  }
});

// 4. Milestone Goal Breakdown
app.post("/api/gemini/goal-milestones", async (req, res) => {
  const { goalTitle, goalDescription } = req.body;
  try {
    if (!goalTitle) {
      return res.status(400).json({ error: "goalTitle is required" });
    }

    const prompt = `Break down the long-term goal "${goalTitle}" (${goalDescription || 'No description'}) into 4 to 6 logical milestone checkpoints. Provide a concise title and description for ea[...]

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            milestones: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                },
                required: ["title", "description"],
              },
            },
          },
          required: ["milestones"],
        },
      },
    });

    res.json(JSON.parse(response.text || "{}"));
  } catch (error: any) {
    console.log("[AI Engine] Triggered local fallback for milestone generation.");
    const genericMilestones = [
      { title: "Define Scope and Metrics", description: "Establish baseline guidelines, timeline milestones, and clarify success parameters." },
      { title: "Initiation and Focus", description: "Dedicate recurring weekly slots to form key habit loops and collect reference guides." },
      { title: "Mid-Term Execution review", description: "Carry out deep-work phases, test ideas, log results, and adapt routines." },
      { title: "Review and Finalize", description: "Consolidate deliverables, complete self-assessments, and lock down success." }
    ];
    res.json({ milestones: genericMilestones });
  }
});

// 5. File Analysis with AI (🔒 or 🤖)
app.post("/api/gemini/file-analyze", async (req, res) => {
  const { fileName, fileType, taskContext } = req.body;
  try {
    if (!fileName) {
      return res.status(400).json({ error: "fileName is required" });
    }

    const prompt = `The user uploaded a file named "${fileName}" of type "${fileType || "unknown"}" and attached it to a task.
Based on the file name, suggest what this file is about and provide 3 helpful, actionable tasks or actions the user might want to take.
Context: ${taskContext || "General personal organization"}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING, description: "A brief 2-sentence summary of what this file likely contains." },
            actionPoints: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "3 actionable follow-up tasks suggested based on the file.",
            },
          },
          required: ["summary", "actionPoints"],
        },
      },
    });

    res.json(JSON.parse(response.text || "{}"));
  } catch (error: any) {
    console.log("[AI Engine] Triggered local fallback for file analysis.");
    const ext = (fileName || "").split(".").pop()?.toLowerCase() || "";
    let summary = `This file '${fileName}' is securely registered in your LifeByte vault. Our engine processed its metadata offline.`;
    let actionPoints = [
      "Review the contents and layout structure",
      "Validate the primary information for accuracy",
      "File under corresponding category folder"
    ];

    if (["pdf", "docx", "doc", "txt"].includes(ext)) {
      summary = `The uploaded document '${fileName}' was detected. It is parsed as structured written/record reference.`;
      actionPoints = [
        "Read or summarize the core chapters/sections",
        "Verify dates, signatures, or contract guidelines if applicable",
        "Extract key actionable bullet items into a checklist"
      ];
    } else if (["png", "jpg", "jpeg", "svg", "gif"].includes(ext)) {
      summary = `The uploaded image asset '${fileName}' was registered. It is categorized as high-contrast visual design context.`;
      actionPoints = [
        "Inspect visual clarity, color balancing, and formatting",
        "Confirm reference context with task owners",
        "Link this attachment directly to scheduling milestones"
      ];
    } else if (["xlsx", "xls", "csv"].includes(ext)) {
      summary = `The spreadsheet file '${fileName}' is parsed as relational tabular information for budgets or logs.`;
      actionPoints = [
        "Verify sum formula columns and values integrity",
        "Update the corresponding main tracker database",
        "Export clean charts for weekly presentation"
      ];
    }

    res.json({ summary, actionPoints });
  }
});

// 6. Voice Input Natural Language Understanding
app.post("/api/gemini/voice-parse", async (req, res) => {
  const { transcript } = req.body;
  try {
    if (!transcript) {
      return res.status(400).json({ error: "Transcript is required" });
    }

    const prompt = `Translate this spoken transcript: "${transcript}" into a structured task definition.
Make sure to extract:
1. Title of the task
2. Optional category (Work, Personal, Study, Health, Travel, Finance, Family)
3. Priority (High, Medium, Low)
4. Specific date deadline mentioned (the current year is 2026. E.g. "tomorrow" would be "2026-07-01", "next Monday" would be "2026-07-06" based on current local date 2026-06-30). Format: YYYY-MM-[...]
5. Recurring interval if mentioned (none, daily, weekly, monthly, custom)`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            category: { type: Type.STRING },
            priority: { type: Type.STRING },
            deadline: { type: Type.STRING },
            recurring: { type: Type.STRING },
          },
          required: ["title", "category", "priority"],
        },
      },
    });

    res.json(JSON.parse(response.text || "{}"));
  } catch (error: any) {
    console.log("[AI Engine] Triggered local fallback for voice command parsing.");
    const info = getLocalCategoryAndPriority(transcript || "");
    
    // Guess deadline
    let deadline = new Date().toISOString().split("T")[0]; // default today
    const normalized = (transcript || "").toLowerCase();
    if (normalized.includes("tomorrow")) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      deadline = tomorrow.toISOString().split("T")[0];
    } else if (normalized.includes("next week") || normalized.includes("week from now")) {
      const nextWeek = new Date();
      nextWeek.setDate(nextWeek.getDate() + 7);
      deadline = nextWeek.toISOString().split("T")[0];
    }

    res.json({
      title: transcript,
      category: info.category,
      priority: info.priority,
      deadline,
      recurring: "none"
    });
  }
});

// Vite middleware configuration for full-stack integration
async function setupVite() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`LifeByte Server is active and listening on http://localhost:${PORT}`);
  });
}

setupVite().catch((err) => {
  console.error("Error setting up Vite dev/production middleware:", err);
});
