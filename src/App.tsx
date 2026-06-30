import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { auth, signInWithGoogle, logoutUser } from "./firebase";
import firebaseConfig from "../firebase-applet-config.json";
import { UserPreferences, Task, Goal, FileRecord, ActivityLog, ChatMessage } from "./types";
import Onboarding from "./components/Onboarding";
import { Sidebar, MobileNav, AppLogo } from "./components/Navigation";
import StatusCheck from "./components/StatusCheck";
import TaskCreationSuite from "./components/TaskCreationSuite";
import TaskDetailsModal from "./components/TaskDetailsModal";
import CalendarView from "./components/CalendarView";
import SearchOverlay from "./components/SearchOverlay";
import TutorialView from "./components/TutorialView";

// Icons
import { 
  Sparkles, Plus, CheckSquare, Search, Compass, Target, 
  CalendarDays, Settings, Bell, ChevronRight, Check, AlertCircle,
  HelpCircle, Sparkle, RefreshCw, Layers, Lock, Cpu,
  ExternalLink, Copy, ShieldAlert, Database
} from "lucide-react";

export default function App() {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [userPrefs, setUserPrefs] = useState<UserPreferences | null>(null);

  // Core application state
  const [tasks, setTasks] = useState<Task[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [files, setFiles] = useState<FileRecord[]>([]);

  // Selected item overlays
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showSearch, setShowSearch] = useState(false);

  // Auth Troubleshooting states
  const [authError, setAuthError] = useState<string | null>(null);
  const [copiedDev, setCopiedDev] = useState(false);
  const [copiedPre, setCopiedPre] = useState(false);

  // Sandbox helper to load session without real Firebase Google Auth
  const loadSandboxSession = () => {
    const mockUser = {
      uid: "sandbox-user-123",
      displayName: "Sandbox Explorer",
      email: "sandbox@example.com",
      emailVerified: true,
      providerData: [],
      metadata: {},
    } as any;

    // Load or create user preferences
    const storedPrefs = localStorage.getItem("lifebyte_prefs_sandbox-user-123");
    if (storedPrefs) {
      setUserPrefs(JSON.parse(storedPrefs));
    } else {
      setUserPrefs(null);
    }

    // Load Tasks
    const storedTasks = localStorage.getItem("lifebyte_tasks_sandbox-user-123");
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks));
    } else {
      const welcomeTask: Task = {
        id: "welcome-task",
        userId: "sandbox-user-123",
        title: "Explore your LifeByte companion dashboard",
        description: "Welcome to LifeByte Sandbox! This is your offline dashboard. Try adding a task via natural AI Chat or simulated Voice commands.",
        priority: "High",
        category: "Personal",
        deadline: new Date().toISOString().split("T")[0],
        allDay: true,
        completed: false,
        recurring: "none",
        steps: [
          { id: "step1", title: "Review tasks list", completed: false },
          { id: "step2", title: "Chat with the AI Companion", completed: false },
          { id: "step3", title: "Create a long-term Life Goal", completed: false }
        ],
        dependencies: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setTasks([welcomeTask]);
      localStorage.setItem("lifebyte_tasks_sandbox-user-123", JSON.stringify([welcomeTask]));
    }

    // Load Goals
    const storedGoals = localStorage.getItem("lifebyte_goals_sandbox-user-123");
    if (storedGoals) {
      setGoals(JSON.parse(storedGoals));
    } else {
      const welcomeGoal: Goal = {
        id: "welcome-goal",
        userId: "sandbox-user-123",
        title: "Master personal organization with LifeByte",
        description: "Break down personal, professional, or academic targets into bite-sized milestones.",
        milestones: [
          { id: "g1", title: "Establish weekly habits", description: "Log tasks daily", completed: false },
          { id: "g2", title: "Optimize with AI companion", description: "Use chat to outline projects", completed: false }
        ],
        completed: false,
        createdAt: new Date().toISOString()
      };
      setGoals([welcomeGoal]);
      localStorage.setItem("lifebyte_goals_sandbox-user-123", JSON.stringify([welcomeGoal]));
    }

    setCurrentUser(mockUser);
    setAuthLoading(false);
  };

  const handleSandboxLogin = () => {
    localStorage.setItem("lifebyte_sandbox_active", "true");
    loadSandboxSession();
  };

  // Custom login handler to catch auth errors and prompt user
  const handleSignIn = async () => {
    setAuthError(null);
    try {
      await signInWithGoogle();
    } catch (err: any) {
      console.error("Sign-In failed: ", err);
      if (err?.code === "auth/unauthorized-domain" || String(err).includes("unauthorized-domain")) {
        setAuthError("auth/unauthorized-domain");
      } else {
        setAuthError(err?.message || String(err));
      }
    }
  };

  // Load state on mount/auth changes
  useEffect(() => {
    if (localStorage.getItem("lifebyte_sandbox_active") === "true") {
      loadSandboxSession();
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setAuthLoading(false);

      if (user) {
        // Load or create user preferences
        const storedPrefs = localStorage.getItem(`lifebyte_prefs_${user.uid}`);
        if (storedPrefs) {
          setUserPrefs(JSON.parse(storedPrefs));
        } else {
          // Triggers Onboarding
          setUserPrefs(null);
        }

        // Load Tasks
        const storedTasks = localStorage.getItem(`lifebyte_tasks_${user.uid}`);
        if (storedTasks) {
          setTasks(JSON.parse(storedTasks));
        } else {
          // Seed with a welcoming task
          const welcomeTask: Task = {
            id: "welcome-task",
            userId: user.uid,
            title: "Explore your LifeByte companion dashboard",
            description: "Welcome to LifeByte! This is your primary 'Today's Focus' view. Try adding a task via natural AI Chat or simulated Voice commands.",
            priority: "High",
            category: "Personal",
            deadline: new Date().toISOString().split("T")[0],
            allDay: true,
            completed: false,
            recurring: "none",
            steps: [
              { id: "step1", title: "Review tasks list", completed: false },
              { id: "step2", title: "Chat with the AI Companion", completed: false },
              { id: "step3", title: "Create a long-term Life Goal", completed: false }
            ],
            dependencies: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          setTasks([welcomeTask]);
          localStorage.setItem(`lifebyte_tasks_${user.uid}`, JSON.stringify([welcomeTask]));
        }

        // Load Goals
        const storedGoals = localStorage.getItem(`lifebyte_goals_${user.uid}`);
        if (storedGoals) {
          setGoals(JSON.parse(storedGoals));
        } else {
          const welcomeGoal: Goal = {
            id: "welcome-goal",
            userId: user.uid,
            title: "Master personal organization with LifeByte",
            description: "Break down personal, professional, or academic targets into bite-sized milestones.",
            milestones: [
              { id: "g1", title: "Establish weekly habits", description: "Log tasks daily", completed: false },
              { id: "g2", title: "Optimize with AI companion", description: "Use chat to outline projects", completed: false }
            ],
            completed: false,
            createdAt: new Date().toISOString()
          };
          setGoals([welcomeGoal]);
          localStorage.setItem(`lifebyte_goals_${user.uid}`, JSON.stringify([welcomeGoal]));
        }

        // Load general Files
        const storedFiles = localStorage.getItem("lifebyte_files");
        if (storedFiles) {
          const allFiles: FileRecord[] = JSON.parse(storedFiles);
          setFiles(allFiles.filter((f) => f.userId === user.uid));
        }
      }
    });

    return () => unsubscribe();
  }, []);

  // Save changes wrapper
  const saveTasks = (newTasks: Task[]) => {
    if (!currentUser) return;
    setTasks(newTasks);
    localStorage.setItem(`lifebyte_tasks_${currentUser.uid}`, JSON.stringify(newTasks));
  };

  const saveGoals = (newGoals: Goal[]) => {
    if (!currentUser) return;
    setGoals(newGoals);
    localStorage.setItem(`lifebyte_goals_${currentUser.uid}`, JSON.stringify(newGoals));
  };

  // Onboarding completion
  const handleOnboardingComplete = (prefs: {
    creationPref: "chat" | "voice" | "manual" | "upload";
    areas: string[];
    notifications: string[];
  }) => {
    if (!currentUser) return;
    const fullPrefs: UserPreferences = {
      uid: currentUser.uid,
      email: currentUser.email || "",
      displayName: currentUser.displayName || "Explorer",
      onboarded: true,
      ...prefs,
      createdAt: new Date().toISOString(),
    };
    setUserPrefs(fullPrefs);
    localStorage.setItem(`lifebyte_prefs_${currentUser.uid}`, JSON.stringify(fullPrefs));
  };

  // Activity Logger
  const logActivity = (taskId: string, type: any, details: string) => {
    if (!currentUser) return;
    const newLog: ActivityLog = {
      id: Math.random().toString(),
      userId: currentUser.uid,
      taskId,
      type,
      details,
      timestamp: new Date().toISOString(),
    };
    const stored = localStorage.getItem("lifebyte_activity");
    const currentLogs = stored ? JSON.parse(stored) : [];
    localStorage.setItem("lifebyte_activity", JSON.stringify([newLog, ...currentLogs]));
  };

  // Task Handlers
  const handleCreateTask = (taskData: Partial<Task>, attachedFiles?: Omit<FileRecord, "id" | "userId" | "createdAt">[]) => {
    if (!currentUser) return;
    const newTask: Task = {
      id: `task-${Date.now()}`,
      userId: currentUser.uid,
      title: taskData.title || "Untitled Task",
      description: taskData.description || "",
      priority: taskData.priority || "Medium",
      category: taskData.category || "Personal",
      deadline: taskData.deadline || new Date().toISOString().split("T")[0],
      startTime: taskData.startTime,
      endTime: taskData.endTime,
      allDay: taskData.allDay !== false,
      completed: false,
      recurring: taskData.recurring || "none",
      steps: taskData.steps || [],
      dependencies: taskData.dependencies || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updatedTasks = [newTask, ...tasks];
    saveTasks(updatedTasks);
    logActivity(newTask.id, "create", `Task "${newTask.title}" created.`);

    // Handle any file attachments
    if (attachedFiles && attachedFiles.length > 0) {
      const stored = localStorage.getItem("lifebyte_files");
      const currentFiles: FileRecord[] = stored ? JSON.parse(stored) : [];
      
      const newFileRecords: FileRecord[] = attachedFiles.map((af) => ({
        id: `file-${Math.random()}`,
        userId: currentUser.uid,
        taskId: newTask.id,
        name: af.name,
        url: af.url,
        type: af.type,
        permission: af.permission,
        createdAt: new Date().toISOString(),
      }));

      const updatedFiles = [...newFileRecords, ...currentFiles];
      localStorage.setItem("lifebyte_files", JSON.stringify(updatedFiles));
      setFiles(updatedFiles.filter((f) => f.userId === currentUser.uid));
    }
  };

  const handleUpdateTask = (updatedTask: Task) => {
    const updated = tasks.map((t) => (t.id === updatedTask.id ? updatedTask : t));
    saveTasks(updated);
  };

  const handleCompleteTask = (taskId: string) => {
    const updated = tasks.map((t) => {
      if (t.id === taskId) {
        logActivity(taskId, "complete", `Task "${t.title}" marked completed.`);
        return { ...t, completed: true, updatedAt: new Date().toISOString() };
      }
      return t;
    });
    saveTasks(updated);
  };

  const handleRescheduleTask = (taskId: string, newDate: string) => {
    const updated = tasks.map((t) => {
      if (t.id === taskId) {
        logActivity(taskId, "update", `Rescheduled due date to ${newDate}.`);
        return { ...t, deadline: newDate, updatedAt: new Date().toISOString() };
      }
      return t;
    });
    saveTasks(updated);
  };

  const handleSkipTask = (taskId: string) => {
    const updated = tasks.map((t) => {
      if (t.id === taskId) {
        logActivity(taskId, "update", `Skipped and postponed task.`);
        // Reschedule task to next day as skip
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        return { ...t, deadline: tomorrow.toISOString().split("T")[0], updatedAt: new Date().toISOString() };
      }
      return t;
    });
    saveTasks(updated);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-55 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-neutral-900 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Not Authenticated Landing Layout
  if (!currentUser) {
    const currentHostname = typeof window !== "undefined" ? window.location.hostname : "";
    const projectId = firebaseConfig?.projectId || "";

    return (
      <div className="min-h-screen bg-neutral-50/70 flex flex-col justify-center items-center p-4">
        <div className="max-w-md w-full bg-white border border-gray-150 rounded-3xl p-8 md:p-10 text-center shadow-xl space-y-8 select-none">
          <div className="space-y-3">
            <AppLogo className="w-16 h-16 mx-auto" />
            <h1 className="text-3xl font-semibold tracking-tight text-gray-950 font-sans">LifeByte</h1>
            <p className="text-sm text-gray-500 max-w-sm mx-auto leading-relaxed">
              An intelligent life management system designed to plan, schedule, and automate tasks through natural conversation and planning.
            </p>
          </div>

          {authError ? (
            <div className="bg-red-50/30 border border-red-100 rounded-2xl p-5 text-left space-y-4">
              <div className="flex items-start gap-3">
                <div className="bg-red-100/80 text-red-700 p-2 rounded-xl mt-0.5">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Sign-In Unauthorized</h3>
                  <p className="text-[11px] text-gray-500 mt-1 leading-normal">
                    Firebase rejected the login because this dynamic preview domain is not listed in your Authorized Domains settings.
                  </p>
                </div>
              </div>

              <div className="space-y-3 pt-2.5 border-t border-red-100/50">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">How to authorize:</p>
                <ol className="text-[11px] text-gray-600 space-y-2 list-decimal list-inside pl-0.5 leading-relaxed">
                  <li>
                    Open{" "}
                    <a
                      href={`https://console.firebase.google.com/project/${projectId}/authentication/settings`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline inline-flex items-center gap-0.5 font-semibold"
                    >
                      Correct Firebase settings ({projectId})
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </li>
                  <li>
                    Go to <span className="font-semibold">Authorized domains</span> and click <span className="font-semibold">Add domain</span>.
                  </li>
                  <li>
                    Add this precise hostname:
                  </li>
                </ol>

                <div className="flex items-center gap-2 bg-white border border-gray-200 p-2 rounded-xl mt-1.5 shadow-xs">
                  <code className="text-[10px] font-mono text-gray-600 flex-1 truncate select-all px-1.5">
                    {currentHostname}
                  </code>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(currentHostname);
                      setCopiedDev(true);
                      setTimeout(() => setCopiedDev(false), 2000);
                    }}
                    className="p-1.5 hover:bg-gray-50 rounded-lg text-gray-500 transition-colors cursor-pointer flex items-center gap-1 text-[10px] font-semibold border border-gray-150 bg-white"
                  >
                    <Copy className="w-3.5 h-3.5 text-gray-400" />
                    {copiedDev ? "Copied" : "Copy"}
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-2 pt-2">
                <button
                  onClick={handleSignIn}
                  className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-4 rounded-xl text-xs transition-colors cursor-pointer shadow-xs"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Try Sign In Again
                </button>
                <button
                  onClick={handleSandboxLogin}
                  className="w-full flex items-center justify-center gap-2 bg-white hover:bg-gray-50 border border-gray-250 text-gray-700 font-semibold py-2.5 px-4 rounded-xl text-xs transition-colors cursor-pointer"
                >
                  <Database className="w-3.5 h-3.5 text-blue-600" />
                  Continue in Sandbox Mode (Offline)
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <button
                onClick={handleSignIn}
                className="w-full flex items-center justify-center gap-3 bg-neutral-950 hover:bg-neutral-800 text-white font-semibold py-3 px-5 rounded-2xl text-sm tracking-wide transition-all duration-200 cursor-pointer shadow-sm"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M12.24 10.285V13.4h6.887C18.2 15.614 15.645 18 12.24 18c-3.86 0-7-3.14-7-7s3.14-7 7-7c1.7 0 3.3.61 4.5 1.7L19.1 3.3C17.2 1.4 14.8 0 12.24 0c-6.627 0-12 5.373-12 12s5.373 12 12 12c6.9 0 11.5-4.8 11.5-11.5 0-.78-.07-1.53-.2-2.215H12.24z"/>
                </svg>
                Sign In with Google
              </button>

              <button
                onClick={handleSandboxLogin}
                className="w-full flex items-center justify-center gap-2 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 font-semibold py-3 px-5 rounded-2xl text-sm transition-all cursor-pointer"
              >
                <Database className="w-4 h-4 text-blue-600" />
                Explore in Sandbox Mode (Offline)
              </button>
            </div>
          )}

          <p className="text-[11px] text-gray-400 font-medium">
            🔒 Fully encrypted. Powered by Google Gemini & Firebase.
          </p>
        </div>
      </div>
    );
  }

  // Authenticated but Onboarding needed
  if (!userPrefs) {
    return (
      <Onboarding
        displayName={currentUser.displayName || "Explorer"}
        onComplete={handleOnboardingComplete}
      />
    );
  }

  // MAIN ROOT LAYOUT (With sidebar navigation)
  return (
    <Router>
      <div className="min-h-screen bg-gray-50/50 text-gray-900 font-sans flex md:pl-64 pb-16 md:pb-0">
        
        {/* Navigation components */}
        <Sidebar userEmail={currentUser.email || ""} />
        <MobileNav />

        {/* Search button trigger shortcut */}
        <button
          onClick={() => setShowSearch(true)}
          className="fixed bottom-20 right-5 md:bottom-8 md:right-8 bg-neutral-900 hover:bg-neutral-800 shadow-md text-white rounded-full p-4 z-40 transition-all cursor-pointer"
          title="Search LifeByte Workspace"
        >
          <Search className="w-5 h-5" />
        </button>

        {/* Main Workspace Frame */}
        <main className="flex-1 max-w-5xl mx-auto px-4 py-8 md:px-8 space-y-8 min-h-screen">
          <Routes>
            <Route
              path="/"
              element={
                <TodayFocusView
                  tasks={tasks}
                  goals={goals}
                  userPrefs={userPrefs}
                  onSelectTask={setSelectedTask}
                  onTaskCreated={handleCreateTask}
                  onCompleteTask={handleCompleteTask}
                  onRescheduleTask={handleRescheduleTask}
                  onSkipTask={handleSkipTask}
                />
              }
            />
            <Route
              path="/tasks"
              element={
                <TasksView
                  tasks={tasks}
                  onSelectTask={setSelectedTask}
                  onTaskCreated={handleCreateTask}
                  onCompleteTask={handleCompleteTask}
                  onRescheduleTask={handleRescheduleTask}
                />
              }
            />
            <Route
              path="/ai"
              element={
                <AiCompanionView
                  tasks={tasks}
                  onTaskCreated={handleCreateTask}
                />
              }
            />
            <Route
              path="/goals"
              element={
                <GoalsView
                  goals={goals}
                  onGoalCreated={(goal) => saveGoals([goal, ...goals])}
                  onUpdateGoal={(goal) => saveGoals(goals.map((g) => (g.id === goal.id ? goal : g)))}
                />
              }
            />
            <Route
              path="/calendar"
              element={
                <CalendarView
                  tasks={tasks}
                  onSelectTask={setSelectedTask}
                  onRescheduleTask={handleRescheduleTask}
                />
              }
            />
            <Route
              path="/profile"
              element={
                <ProfileView
                  userPrefs={userPrefs}
                  tasks={tasks}
                  goals={goals}
                />
              }
            />
            <Route
              path="/tutorial"
              element={
                <TutorialView />
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        {/* Global Task details modal overlays */}
        {selectedTask && (
          <TaskDetailsModal
            task={selectedTask}
            allTasks={tasks}
            onClose={() => setSelectedTask(null)}
            onUpdateTask={(t) => {
              handleUpdateTask(t);
              setSelectedTask(t);
            }}
          />
        )}

        {/* Global Search overlays */}
        {showSearch && (
          <SearchOverlay
            tasks={tasks}
            goals={goals}
            files={files}
            onSelectTask={setSelectedTask}
            onSelectGoal={() => {}}
            onClose={() => setShowSearch(false)}
          />
        )}

      </div>
    </Router>
  );
}

// ==========================================
// VIEW 1: TODAY'S FOCUS (HOME PAGE)
// ==========================================
interface TodayFocusProps {
  tasks: Task[];
  goals: Goal[];
  userPrefs: UserPreferences;
  onSelectTask: (t: Task) => void;
  onTaskCreated: (taskData: Partial<Task>, files?: any[]) => void;
  onCompleteTask: (id: string) => void;
  onRescheduleTask: (id: string, date: string) => void;
  onSkipTask: (id: string) => void;
}

function TodayFocusView({
  tasks,
  goals,
  userPrefs,
  onSelectTask,
  onTaskCreated,
  onCompleteTask,
  onRescheduleTask,
  onSkipTask,
}: TodayFocusProps) {
  const [showCompleted, setShowCompleted] = useState(false);
  const [suggestion, setSuggestion] = useState<string | null>(null);
  const [loadingSuggestion, setLoadingSuggestion] = useState(false);

  const todayStr = new Date().toISOString().split("T")[0];

  // Filter important tasks (High priority, due today, or overdue)
  const importantTasks = tasks.filter((t) => {
    if (t.completed && !showCompleted) return false;
    const isOverdue = !t.completed && t.deadline < todayStr;
    const isDueToday = t.deadline === todayStr;
    const isHigh = t.priority === "High";
    return isOverdue || isDueToday || isHigh;
  });

  // Get AI Suggestion card recommendation based on active tasks
  const fetchSuggestion = async () => {
    setLoadingSuggestion(true);
    try {
      const activeTitles = tasks.filter((t) => !t.completed).map((t) => t.title);
      const response = await fetch("/api/gemini/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            {
              role: "user",
              content: `This is my active task list: ${JSON.stringify(activeTitles)}. 
Identify the single most critical item I should focus on today, outline 1 quick tactical step to build momentum on it, and give a supportive 2-sentence piece of advice. Do not mention system paths.`,
            },
          ],
        }),
      });
      if (response.ok) {
        const data = await response.json();
        setSuggestion(data.text);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingSuggestion(false);
    }
  };

  useEffect(() => {
    fetchSuggestion();
  }, [tasks]);

  return (
    <div className="space-y-8 animate-fade-in select-none">
      
      {/* Title greeting */}
      <div className="flex justify-between items-center pb-2">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 font-sans">Today's Focus</h1>
          <p className="text-xs text-gray-500 mt-1">
            LifeByte smart priority filter. Focus on what is due or vital.
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-gray-500 font-semibold bg-white border border-gray-200 px-3 py-1.5 rounded-xl shadow-xs">
          <CalendarDays className="w-3.5 h-3.5 text-blue-600" />
          <span>{new Date().toLocaleDateString("en", { weekday: "long", month: "short", day: "numeric" })}</span>
        </div>
      </div>

      {/* Task Check-In status alert box */}
      <StatusCheck
        tasks={tasks}
        onCompleteTask={onCompleteTask}
        onRescheduleTask={onRescheduleTask}
        onSkipTask={onSkipTask}
      />

      {/* Quick Creation Panel */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <button
          onClick={() => window.location.href = "/ai"}
          className="flex flex-col items-center justify-center p-6 bg-white border border-gray-200 rounded-2xl shadow-xs hover:shadow-sm transition-all group cursor-pointer"
        >
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-3 group-hover:bg-blue-600 group-hover:text-white transition-all">
            <Sparkle className="w-5 h-5" />
          </div>
          <span className="text-xs font-semibold text-gray-900">Ask AI</span>
          <span className="text-[10px] text-gray-400 mt-1">Chat & Plan</span>
        </button>

        <button
          onClick={() => window.location.href = "/tasks"}
          className="flex flex-col items-center justify-center p-6 bg-white border border-gray-200 rounded-2xl shadow-xs hover:shadow-sm transition-all group cursor-pointer"
        >
          <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mb-3 group-hover:bg-indigo-600 group-hover:text-white transition-all">
            <CheckSquare className="w-5 h-5" />
          </div>
          <span className="text-xs font-semibold text-gray-900">Tasks Board</span>
          <span className="text-[10px] text-gray-400 mt-1">View & Update</span>
        </button>

        <button
          onClick={() => window.location.href = "/goals"}
          className="flex flex-col items-center justify-center p-6 bg-white border border-gray-200 rounded-2xl shadow-xs hover:shadow-sm transition-all group cursor-pointer"
        >
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mb-3 group-hover:bg-emerald-600 group-hover:text-white transition-all">
            <Target className="w-5 h-5" />
          </div>
          <span className="text-xs font-semibold text-gray-900">Life Targets</span>
          <span className="text-[10px] text-gray-400 mt-1">Checkpoints</span>
        </button>

        <button
          onClick={fetchSuggestion}
          disabled={loadingSuggestion}
          className="flex flex-col items-center justify-center p-6 bg-white border border-gray-200 rounded-2xl shadow-xs hover:shadow-sm transition-all group cursor-pointer disabled:opacity-55"
        >
          <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mb-3 group-hover:bg-amber-600 group-hover:text-white transition-all">
            <RefreshCw className={`w-5 h-5 ${loadingSuggestion ? "animate-spin" : ""}`} />
          </div>
          <span className="text-xs font-semibold text-gray-900">Recalculate Focus</span>
          <span className="text-[10px] text-gray-400 mt-1">AI Recommendation</span>
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Important task list */}
        <div className="xl:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-950 text-xs uppercase tracking-wider">Critical Agenda</h3>
            
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 font-medium">Show Completed</span>
              <button
                onClick={() => setShowCompleted(!showCompleted)}
                className={`w-10 h-5.5 rounded-full p-1 transition-colors cursor-pointer ${
                  showCompleted ? "bg-blue-600" : "bg-gray-200"
                }`}
              >
                <div className={`bg-white w-3.5 h-3.5 rounded-full shadow-md transition-transform ${
                  showCompleted ? "translate-x-4.5" : ""
                }`} />
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {importantTasks.length === 0 ? (
              <div className="text-center py-10 bg-white border border-dashed border-gray-200 rounded-2xl">
                <CheckSquare className="w-8 h-8 text-gray-300 mx-auto mb-1.5" />
                <p className="text-xs font-semibold text-gray-500">No critical agenda items.</p>
                <p className="text-[10px] text-gray-400 mt-1">Excellent! You are all caught up on due or vital tasks.</p>
              </div>
            ) : (
              importantTasks.map((task) => {
                const isOverdue = !task.completed && task.deadline < todayStr;
                const isDueToday = task.deadline === todayStr;

                return (
                  <div
                    key={task.id}
                    className="bg-white border border-gray-200 rounded-2xl p-4 flex items-center justify-between hover:shadow-xs transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => onCompleteTask(task.id)}
                        className="w-4.5 h-4.5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                      />
                      <div>
                        <h4
                          onClick={() => onSelectTask(task)}
                          className={`text-xs font-semibold text-gray-900 hover:underline cursor-pointer ${
                            task.completed ? "line-through text-gray-400 font-normal" : ""
                          }`}
                        >
                          {task.title}
                        </h4>
                        
                        {/* Task badges */}
                        <div className="flex flex-wrap gap-1.5 mt-1.5">
                          <span className="text-[8px] font-bold bg-gray-50 border border-gray-200 text-gray-500 px-1.5 py-0.5 rounded uppercase">
                            {task.category}
                          </span>
                          {task.priority === "High" && (
                            <span className="text-[8px] font-bold bg-red-50 border border-red-100 text-red-600 px-1.5 py-0.5 rounded uppercase">
                              High Priority
                            </span>
                          )}
                          {isDueToday && (
                            <span className="text-[8px] font-bold bg-blue-50 border border-blue-100 text-blue-600 px-1.5 py-0.5 rounded uppercase">
                              Due Today
                            </span>
                          )}
                          {isOverdue && (
                            <span className="text-[8px] font-bold bg-amber-50 border border-amber-100 text-amber-700 px-1.5 py-0.5 rounded uppercase">
                              Overdue
                            </span>
                          )}
                          {task.recurring !== "none" && (
                            <span className="text-[8px] font-bold bg-indigo-50 border border-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded uppercase">
                              Recurring
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => onSelectTask(task)}
                      className="px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100/70 border border-blue-100 rounded-lg text-[10px] font-semibold text-blue-700 transition-colors"
                    >
                      Details
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* AI Suggestion + Task creation shortcuts */}
        <div className="space-y-6">
          <div className="space-y-2">
            <h3 className="font-semibold text-gray-950 text-xs uppercase tracking-wider">AI Suggestion</h3>
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-3xl p-6 shadow-md space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                  <Sparkle className="w-5 h-5 text-white animate-pulse" />
                </div>
                <span className="text-[9px] font-bold text-blue-50 uppercase tracking-widest">Intelligent Daily Focus</span>
              </div>
              <div className="text-xs text-blue-50 leading-relaxed font-sans font-medium whitespace-pre-line">
                {suggestion || "Analyze my schedule with Gemini to suggest daily priority plans..."}
              </div>
            </div>
          </div>

          <TaskCreationSuite onTaskCreated={onTaskCreated} existingTasks={tasks} />
        </div>

      </div>

    </div>
  );
}

// ==========================================
// VIEW 2: TASKS BOARD/LIST WORKSPACE
// ==========================================
interface TasksViewProps {
  tasks: Task[];
  onSelectTask: (t: Task) => void;
  onTaskCreated: (taskData: Partial<Task>, files?: any[]) => void;
  onCompleteTask: (id: string) => void;
  onRescheduleTask: (id: string, date: string) => void;
}

function TasksView({ tasks, onSelectTask, onTaskCreated, onCompleteTask, onRescheduleTask }: TasksViewProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [showCompleted, setShowCompleted] = useState(false);

  // Quick Template handler
  const loadQuickTemplate = (templateName: string) => {
    const templates: Record<string, { title: string; desc: string; steps: string[]; category: any }> = {
      "Exam Prep": {
        title: "CSE Semester Exams Preparation",
        desc: "Break down CSE syllabus into tactical study sprints.",
        category: "Study",
        steps: ["Draft daily revision outline", "Solve previous semester papers", "Review notes and cheat sheets"]
      },
      "Meeting Prep": {
        title: "Prepare for upcoming strategic sync meeting",
        desc: "Draft agenda slides and align numbers.",
        category: "Work",
        steps: ["Draft agenda slides", "Collect financial numbers from team", "Circulate invite to stakeholders"]
      },
      "Travel Plan": {
        title: "Trip itinerary coordination",
        desc: "Set dates and book accommodation.",
        category: "Travel",
        steps: ["Confirm flights & check visa guidelines", "Book accommodations on Airbnb", "List scenic highlights and sights"]
      }
    };

    const picked = templates[templateName];
    if (picked) {
      onTaskCreated({
        title: picked.title,
        description: picked.desc,
        category: picked.category,
        priority: "High",
        steps: picked.steps.map(s => ({ id: Math.random().toString(), title: s, completed: false })),
        deadline: new Date().toISOString().split("T")[0]
      });
    }
  };

  const filteredTasks = tasks.filter((t) => {
    if (t.completed && !showCompleted) return false;
    if (selectedCategory !== "All" && t.category !== selectedCategory) return false;
    return true;
  });

  return (
    <div className="space-y-6 animate-fade-in select-none">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 font-sans">Tasks Workspace</h1>
          <p className="text-xs text-gray-500 mt-1">Manage, filter, and plan templates in one unified view.</p>
        </div>

        {/* Completed Toggle */}
        <div className="flex items-center gap-2 self-start sm:self-auto bg-white border border-gray-200 p-2 rounded-xl shadow-xs">
          <span className="text-xs text-gray-500 font-semibold">Show Completed</span>
          <button
            onClick={() => setShowCompleted(!showCompleted)}
            className={`w-10 h-5.5 rounded-full p-1 transition-colors cursor-pointer ${
              showCompleted ? "bg-blue-600" : "bg-gray-200"
            }`}
          >
            <div className={`bg-white w-3.5 h-3.5 rounded-full shadow-md transition-transform ${
              showCompleted ? "translate-x-4.5" : ""
            }`} />
          </button>
        </div>
      </div>

      {/* Templates Row */}
      <div className="space-y-2">
        <h3 className="font-semibold text-gray-950 text-xs uppercase tracking-wider">Quick Templates</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            { name: "Exam Prep", desc: "CSE Semester Prep", badge: "Study" },
            { name: "Meeting Prep", desc: "Corporate Slide Sync", badge: "Work" },
            { name: "Travel Plan", desc: "Trip Coordination", badge: "Travel" }
          ].map((temp) => (
            <button
              key={temp.name}
              onClick={() => loadQuickTemplate(temp.name)}
              className="flex items-center justify-between p-4 bg-white border border-gray-200 hover:border-blue-500 rounded-2xl text-left transition-all cursor-pointer shadow-sm group"
            >
              <div>
                <span className="text-[9px] font-bold text-blue-600 uppercase">{temp.badge}</span>
                <h4 className="font-semibold text-xs text-gray-900 mt-0.5">{temp.name}</h4>
                <p className="text-[10px] text-gray-400 mt-1">{temp.desc}</p>
              </div>
              <Plus className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Core list workspace */}
        <div className="xl:col-span-2 space-y-4">
          
          {/* Category Filter Pills */}
          <div className="flex gap-1.5 overflow-x-auto pb-1">
            {["All", "Work", "Personal", "Study", "Health", "Travel", "Finance", "Family"].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-blue-600 text-white font-bold"
                    : "bg-white border border-gray-200 text-gray-500 hover:text-gray-900"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {filteredTasks.length === 0 ? (
              <div className="text-center py-16 bg-white border border-dashed border-gray-200 rounded-2xl">
                <CheckSquare className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                <p className="text-sm font-semibold text-gray-500">No tasks found</p>
                <p className="text-xs text-gray-400 mt-1">Try relaxing filters or load a quick template.</p>
              </div>
            ) : (
              filteredTasks.map((task) => (
                <div
                  key={task.id}
                  className="bg-white border border-gray-200 hover:border-blue-200 rounded-2xl p-4 flex items-center justify-between transition-all"
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => onCompleteTask(task.id)}
                      className="w-4.5 h-4.5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                    />
                    <div>
                      <h4
                        onClick={() => onSelectTask(task)}
                        className={`text-xs font-semibold text-gray-900 hover:underline cursor-pointer ${
                          task.completed ? "line-through text-gray-400 font-normal" : ""
                        }`}
                      >
                        {task.title}
                      </h4>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="text-[9px] font-bold bg-gray-50 border border-gray-200 text-gray-500 px-1.5 py-0.5 rounded uppercase">
                          {task.category}
                        </span>
                        <span className="text-[9px] text-gray-400 font-medium">Due: {task.deadline}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => onSelectTask(task)}
                    className="px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100/70 border border-blue-100 rounded-lg text-[10px] font-semibold text-blue-700 transition-colors"
                  >
                    View
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Creation suite on right */}
        <div>
          <TaskCreationSuite onTaskCreated={onTaskCreated} existingTasks={tasks} />
        </div>

      </div>

    </div>
  );
}

// ==========================================
// VIEW 3: AI COMPANION (DEDICATED CHAT PAGE)
// ==========================================
interface AiCompanionViewProps {
  tasks: Task[];
  onTaskCreated: (taskData: Partial<Task>, files?: any[]) => void;
}

function AiCompanionView({ tasks, onTaskCreated }: AiCompanionViewProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "ai-welcome",
      role: "model",
      content: "Hello! I am LifeByte, your personal life management companion. How can I help you today? If you are feeling overwhelmed, select one of the plan organizers below.",
      timestamp: new Date().toISOString()
    }
  ]);
  const [chatInput, setChatInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;
    const userMsg: ChatMessage = {
      id: Math.random().toString(),
      role: "user",
      content: text,
      timestamp: new Date().toISOString()
    };

    setMessages((prev) => [...prev, userMsg]);
    setChatInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/gemini/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMsg].map((m) => ({
            role: m.role,
            content: m.content
          }))
        }),
      });

      if (!response.ok) throw new Error("Assistant is currently busy.");
      const data = await response.json();

      setMessages((prev) => [
        ...prev,
        {
          id: Math.random().toString(),
          role: "model",
          content: data.text,
          timestamp: new Date().toISOString()
        }
      ]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: Math.random().toString(),
          role: "model",
          content: `⚠️ Error: ${err?.message || "Something went wrong."}`,
          timestamp: new Date().toISOString()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const selectQuickAction = (actionPhrase: string) => {
    sendMessage(actionPhrase);
  };

  return (
    <div className="space-y-6 animate-fade-in select-none">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 font-sans flex items-center gap-2">
          <Compass className="w-6 h-6 text-blue-600" />
          AI Companion
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          Chat freely with your life coordinator. Plan projects, prepare for syncs, or organize budgets.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Quick Suggestion buttons */}
        <div className="space-y-2 lg:col-span-1">
          <h3 className="font-semibold text-gray-950 text-xs uppercase tracking-wider">Plan Organizers</h3>
          {[
            { title: "Review My Tasks", desc: "Suggest optimal focus", prompt: "Identify the critical priority on my task sheet." },
            { title: "Create a Plan", desc: "Structure projects", prompt: "I need to plan my week step-by-step." },
            { title: "Organize My Week", desc: "Organize responsibilities", prompt: "I am feeling overwhelmed. Help me plan my upcoming week." },
            { title: "Plan a Trip", desc: "Travel itinerary outlines", prompt: "Help me outline a 4-day travel trip itinerary." },
            { title: "Manage Bills", desc: "Finance calendars", prompt: "Suggest a simple checklist template to track monthly house utility bills." }
          ].map((act) => (
            <button
              key={act.title}
              onClick={() => selectQuickAction(act.prompt)}
              className="w-full flex flex-col items-start p-3 bg-white border border-gray-200 hover:border-blue-500 rounded-2xl text-left transition-all cursor-pointer shadow-sm group"
            >
              <h4 className="font-semibold text-xs text-gray-900 group-hover:text-blue-600 transition-colors">{act.title}</h4>
              <p className="text-[10px] text-gray-400 mt-0.5">{act.desc}</p>
            </button>
          ))}
        </div>

        {/* Chat area */}
        <div className="lg:col-span-3 bg-white border border-gray-200 rounded-3xl p-5 flex flex-col h-[500px] shadow-sm">
          
          {/* Scrollable messages block */}
          <div className="flex-1 overflow-y-auto space-y-4 pr-1 scrollbar-thin">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                    msg.role === "user"
                      ? "bg-blue-600 text-white font-medium shadow-xs"
                      : "bg-blue-50/15 text-gray-800 border border-blue-100/50 whitespace-pre-wrap"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            
            {loading && (
              <div className="flex justify-start">
                <div className="bg-blue-50/15 border border-blue-100/50 text-gray-400 rounded-2xl px-4 py-3 text-xs flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" />
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce delay-75" />
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce delay-150" />
                </div>
              </div>
            )}
          </div>

          {/* Form input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage(chatInput);
            }}
            className="flex gap-2 border-t border-gray-100 pt-4 mt-4"
          >
            <input
              type="text"
              placeholder="Ask companion anything..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              className="flex-1 text-xs bg-gray-50 border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:bg-white px-3 py-2.5 rounded-xl outline-none"
            />
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-all cursor-pointer"
            >
              Send
            </button>
          </form>

        </div>

      </div>

    </div>
  );
}

// ==========================================
// VIEW 4: GOALS PAGE (LONG-TERM LIFE TARGETS)
// ==========================================
interface GoalsViewProps {
  goals: Goal[];
  onGoalCreated: (goal: Goal) => void;
  onUpdateGoal: (goal: Goal) => void;
}

function GoalsView({ goals, onGoalCreated, onUpdateGoal }: GoalsViewProps) {
  const [goalTitle, setGoalTitle] = useState("");
  const [goalDesc, setGoalDesc] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!goalTitle.trim()) return;

    setLoading(true);
    try {
      // Get logical AI milestones
      const response = await fetch("/api/gemini/goal-milestones", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ goalTitle, goalDescription: goalDesc }),
      });

      let milestones = [];
      if (response.ok) {
        const data = await response.json();
        milestones = (data.milestones || []).map((m: any) => ({
          id: `milestone-${Math.random()}`,
          title: m.title,
          description: m.description,
          completed: false,
        }));
      }

      const newGoal: Goal = {
        id: `goal-${Date.now()}`,
        userId: auth.currentUser?.uid || "anonymous",
        title: goalTitle,
        description: goalDesc,
        milestones,
        completed: false,
        createdAt: new Date().toISOString(),
      };

      onGoalCreated(newGoal);
      setGoalTitle("");
      setGoalDesc("");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleMilestone = (goal: Goal, milestoneId: string) => {
    const updatedMilestones = goal.milestones.map((m) =>
      m.id === milestoneId ? { ...m, completed: !m.completed } : m
    );
    const isAllComplete = updatedMilestones.length > 0 && updatedMilestones.every((m) => m.completed);
    
    onUpdateGoal({
      ...goal,
      milestones: updatedMilestones,
      completed: isAllComplete,
    });
  };

  return (
    <div className="space-y-6 animate-fade-in select-none">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 font-sans flex items-center gap-2">
          <Target className="w-6 h-6 text-blue-600" />
          Life Goals
        </h1>
        <p className="text-xs text-gray-500 mt-1">Break down long-term goals (e.g., Learn Python, Crack exams) into tactical checkpoints.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Goal Creator Form */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-4 h-fit">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4.5 h-4.5 text-blue-600" />
            <h3 className="font-semibold text-gray-950 text-sm">Add New Life Target</h3>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-gray-500 uppercase">Goal Title</label>
              <input
                type="text"
                required
                placeholder="E.g., Learn Python Program"
                value={goalTitle}
                onChange={(e) => setGoalTitle(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:bg-white text-xs px-3 py-2.5 rounded-xl outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-gray-500 uppercase">Motivation Description</label>
              <textarea
                placeholder="Why is this important to you?"
                value={goalDesc}
                onChange={(e) => setGoalDesc(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:bg-white text-xs px-3 py-2.5 rounded-xl outline-none h-20 resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-semibold py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              {loading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Generating checkpoints...
                </>
              ) : (
                "Save & Generate AI Checkpoints"
              )}
            </button>
          </form>
        </div>

        {/* Goals list with checkpoints */}
        <div className="xl:col-span-2 space-y-5">
          {goals.length === 0 ? (
            <div className="text-center py-16 bg-white border border-dashed border-gray-200 rounded-2xl">
              <Target className="w-10 h-10 text-gray-300 mx-auto mb-2" />
              <p className="text-sm font-semibold text-gray-500">No active life goals</p>
              <p className="text-xs text-gray-400 mt-1">Start by adding a goal to break down your year.</p>
            </div>
          ) : (
            goals.map((goal) => {
              const completedCount = goal.milestones.filter((m) => m.completed).length;
              const totalCount = goal.milestones.length;
              const percent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

              return (
                <div key={goal.id} className="bg-white border border-gray-200 rounded-3xl p-5 shadow-sm space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className={`text-sm font-semibold text-gray-950 ${goal.completed ? "line-through text-gray-400" : ""}`}>
                        {goal.title}
                      </h3>
                      {goal.description && <p className="text-[11px] text-gray-400 mt-1">{goal.description}</p>}
                    </div>
                    <span className="text-[10px] font-bold bg-blue-50 border border-blue-100 text-blue-700 px-2 py-0.5 rounded uppercase">
                      Checkpoints: {completedCount}/{totalCount}
                    </span>
                  </div>

                  {/* Goal progress slider */}
                  <div className="space-y-1.5">
                    <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-600 transition-all duration-300" style={{ width: `${percent}%` }} />
                    </div>
                  </div>

                  {/* Milestones grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-2">
                    {goal.milestones.map((m) => (
                      <button
                        key={m.id}
                        onClick={() => handleToggleMilestone(goal, m.id)}
                        className={`p-3 border text-left rounded-xl transition-all flex items-start gap-2.5 cursor-pointer ${
                          m.completed
                            ? "bg-blue-50/15 border-blue-100"
                            : "bg-white border-gray-100 hover:border-blue-200 hover:bg-blue-50/5"
                        }`}
                      >
                        <div className={`w-4 h-4 rounded-md border flex items-center justify-center mt-0.5 flex-shrink-0 ${
                          m.completed ? "bg-blue-600 border-blue-600 text-white" : "border-gray-300"
                        }`}>
                          {m.completed && <Check className="w-3 h-3" />}
                        </div>
                        <div>
                          <span className={`text-[11px] font-semibold text-gray-950 block ${m.completed ? "line-through text-gray-400 font-normal" : ""}`}>
                            {m.title}
                          </span>
                          <span className="text-[10px] text-gray-400 block mt-0.5 leading-normal">{m.description}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>

      </div>

    </div>
  );
}

// ==========================================
// VIEW 5: USER PROFILE VIEW
// ==========================================
interface ProfileProps {
  userPrefs: UserPreferences;
  tasks: Task[];
  goals: Goal[];
}

function ProfileView({ userPrefs, tasks, goals }: ProfileProps) {
  const completedTasksCount = tasks.filter((t) => t.completed).length;
  const totalTasksCount = tasks.length;
  const completedGoalsCount = goals.filter((g) => g.completed).length;

  return (
    <div className="space-y-6 animate-fade-in select-none max-w-xl mx-auto">
      
      {/* Header card */}
      <div className="bg-white border border-gray-200 rounded-3xl p-8 text-center space-y-4 shadow-sm">
        <div className="mx-auto w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-white text-xl font-bold border border-blue-500 shadow-xs">
          {userPrefs.displayName ? userPrefs.displayName.slice(0, 2).toUpperCase() : "U"}
        </div>
        
        <div>
          <h2 className="text-xl font-bold text-gray-950 font-sans tracking-tight">{userPrefs.displayName}</h2>
          <p className="text-xs text-gray-400 mt-1">{userPrefs.email}</p>
        </div>

        <span className="inline-block text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-100 rounded-full px-3 py-1 uppercase tracking-wider">
          LifeByte Companion Active
        </span>
      </div>

      {/* Stats section */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white border border-gray-200 p-5 rounded-2xl space-y-1 shadow-sm text-center">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Tasks Completed</span>
          <span className="text-2xl font-extrabold text-blue-600 block mt-2">
            {completedTasksCount} / {totalTasksCount}
          </span>
        </div>

        <div className="bg-white border border-gray-200 p-5 rounded-2xl space-y-1 shadow-sm text-center">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Life Goals Met</span>
          <span className="text-2xl font-extrabold text-blue-600 block mt-2">
            {completedGoalsCount}
          </span>
        </div>
      </div>

      {/* Preferences display */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-5">
        <h4 className="font-semibold text-gray-950 text-xs uppercase tracking-wider border-b border-gray-50 pb-3">
          Onboarding Preferences
        </h4>

        <div className="space-y-3.5">
          <div>
            <span className="text-[10px] font-bold text-gray-400 uppercase block">Preferred Task Capture</span>
            <span className="text-xs font-semibold text-gray-900 block mt-1 capitalize">{userPrefs.creationPref || "AI Chat"}</span>
          </div>

          <div>
            <span className="text-[10px] font-bold text-gray-400 uppercase block">Active Lifespaces</span>
            <div className="flex flex-wrap gap-1.5 mt-1.5">
              {userPrefs.areas && userPrefs.areas.length > 0 ? (
                userPrefs.areas.map((a) => (
                  <span key={a} className="text-[10px] font-semibold bg-blue-50/30 text-blue-700 px-2 py-0.5 rounded border border-blue-100/50">
                    {a}
                  </span>
                ))
              ) : (
                <span className="text-xs text-gray-400">No specific areas selected.</span>
              )}
            </div>
          </div>

          <div>
            <span className="text-[10px] font-bold text-gray-400 uppercase block">Notification Channels</span>
            <div className="flex flex-wrap gap-1.5 mt-1.5">
              {userPrefs.notifications && userPrefs.notifications.length > 0 ? (
                userPrefs.notifications.map((n) => (
                  <span key={n} className="text-[10px] font-semibold bg-blue-50/30 text-blue-700 px-2 py-0.5 rounded border border-blue-100/50">
                    {n}
                  </span>
                ))
              ) : (
                <span className="text-xs text-gray-400">All alerts muted.</span>
              )}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
