export interface UserPreferences {
  uid: string;
  email: string;
  displayName: string;
  onboarded: boolean;
  creationPref: "chat" | "voice" | "manual" | "upload" | "";
  areas: string[]; // Work, Personal, Health, Study, Finance, Family, Travel
  notifications: string[]; // Deadline Alerts, Task Completion Checks, Important Reminders
  createdAt: string;
}

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  userId: string;
  title: string;
  description?: string;
  priority: "High" | "Medium" | "Low";
  category: "Work" | "Personal" | "Study" | "Health" | "Travel" | "Finance" | "Family" | "Other";
  deadline: string; // YYYY-MM-DD
  startTime?: string; // HH:MM
  endTime?: string; // HH:MM
  allDay: boolean;
  completed: boolean;
  recurring: "none" | "daily" | "weekly" | "monthly" | "custom";
  steps: Subtask[];
  dependencies: string[]; // List of taskIds this task depends on
  createdAt: string;
  updatedAt: string;
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  completed: boolean;
}

export interface Goal {
  id: string;
  userId: string;
  title: string;
  description?: string;
  milestones: Milestone[];
  completed: boolean;
  createdAt: string;
}

export interface FileRecord {
  id: string;
  userId: string;
  taskId: string;
  name: string;
  url: string;
  type: string;
  permission: "🔒" | "🤖"; // 🔒 = Attach Only, 🤖 = Analyze with AI
  createdAt: string;
}

export interface ActivityLog {
  id: string;
  userId: string;
  taskId: string;
  type: "create" | "update" | "complete" | "incomplete" | "add_step" | "remove_step";
  details: string;
  timestamp: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "model";
  content: string;
  timestamp: string;
}
