import React, { useState, useRef } from "react";
import { MessageSquare, Mic, FileText, Settings, Upload, Check, ChevronRight, AlertCircle, Play, Sparkles, FileClock, Shield, Eye } from "lucide-react";
import { Task, FileRecord } from "../types";

interface TaskCreationSuiteProps {
  onTaskCreated: (taskData: Partial<Task>, files?: Omit<FileRecord, "id" | "userId" | "createdAt">[]) => void;
  existingTasks: Task[];
}

export default function TaskCreationSuite({ onTaskCreated, existingTasks }: TaskCreationSuiteProps) {
  const [activeTab, setActiveTab] = useState<"chat" | "voice" | "manual" | "upload">("chat");

  // Confirmation Flow state
  const [draftTask, setDraftTask] = useState<Partial<Task> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 1. AI Chat state
  const [chatInput, setChatInput] = useState("");

  // 2. Voice Input state
  const [isRecording, setIsRecording] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState("");

  // 3. Manual Form state
  const [manualTitle, setManualTitle] = useState("");
  const [manualDesc, setManualDesc] = useState("");
  const [manualPriority, setManualPriority] = useState<"High" | "Medium" | "Low">("Medium");
  const [manualCategory, setManualCategory] = useState<any>("Personal");
  const [manualDeadline, setManualDeadline] = useState("");
  const [manualStartTime, setManualStartTime] = useState("");
  const [manualEndTime, setManualEndTime] = useState("");
  const [manualAllDay, setManualAllDay] = useState(true);
  const [manualRecurring, setManualRecurring] = useState<any>("none");
  const [manualDependency, setManualDependency] = useState<string>("");

  // 4. File Upload state
  const [uploadedFiles, setUploadedFiles] = useState<{ name: string; type: string; permission: "🔒" | "🤖" }[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Common handler to trigger Gemini NLP parsing
  const parseNaturalLanguage = async (text: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/gemini/voice-parse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcript: text }),
      });
      if (!response.ok) throw new Error("Could not analyze this query.");
      const data = await response.json();
      
      const todayStr = new Date().toISOString().split("T")[0];
      setDraftTask({
        title: data.title || text,
        category: (data.category || "Personal") as any,
        priority: (data.priority || "Medium") as any,
        deadline: data.deadline || todayStr,
        recurring: (data.recurring || "none") as any,
        description: `Created via LifeByte smart parsing: "${text}"`,
        steps: [],
        dependencies: [],
        completed: false,
      });
    } catch (err: any) {
      setError(err?.message || "Failed to analyze language.");
    } finally {
      setLoading(false);
    }
  };

  // 1. AI Chat Submit
  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    parseNaturalLanguage(chatInput);
    setChatInput("");
  };

  // 2. Voice Simulator with speech commands
  const startVoiceCapture = () => {
    setIsRecording(true);
    setError(null);
    
    // Attempt real Web Speech API if supported, or simulate
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.lang = "en-US";
      rec.interimResults = false;
      rec.maxAlternatives = 1;

      rec.onresult = (event: any) => {
        const transcriptText = event.results[0][0].transcript;
        setVoiceTranscript(transcriptText);
        parseNaturalLanguage(transcriptText);
      };

      rec.onerror = () => {
        simulateVoice();
      };

      rec.onend = () => {
        setIsRecording(false);
      };

      rec.start();
    } else {
      simulateVoice();
    }
  };

  const simulateVoice = () => {
    // Random sample voice text after 2 seconds
    const voiceSamples = [
      "I have a client meeting tomorrow.",
      "I need to submit my report by Friday.",
      "Book family dinner for Sunday night.",
      "Check credit card bill payments by Monday."
    ];
    const picked = voiceSamples[Math.floor(Math.random() * voiceSamples.length)];
    setTimeout(() => {
      setVoiceTranscript(picked);
      setIsRecording(false);
      parseNaturalLanguage(picked);
    }, 2000);
  };

  // 3. Manual Submit
  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualTitle) {
      setError("Please provide a task title.");
      return;
    }
    const todayStr = new Date().toISOString().split("T")[0];
    const taskData: Partial<Task> = {
      title: manualTitle,
      description: manualDesc,
      priority: manualPriority,
      category: manualCategory,
      deadline: manualDeadline || todayStr,
      startTime: manualStartTime || undefined,
      endTime: manualEndTime || undefined,
      allDay: manualAllDay,
      recurring: manualRecurring,
      dependencies: manualDependency ? [manualDependency] : [],
      completed: false,
      steps: [],
    };
    onTaskCreated(taskData);
    resetManualForm();
  };

  const resetManualForm = () => {
    setManualTitle("");
    setManualDesc("");
    setManualPriority("Medium");
    setManualCategory("Personal");
    setManualDeadline("");
    setManualStartTime("");
    setManualEndTime("");
    setManualAllDay(true);
    setManualRecurring("none");
    setManualDependency("");
    setError(null);
  };

  // 4. File upload handlers & examples
  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];
    addFileToUploads(file.name, file.type);
  };

  const addFileToUploads = async (name: string, type: string) => {
    // Standard default permission is 🔒 Attach Only
    const newFile = { name, type, permission: "🔒" as const };
    setUploadedFiles((prev) => [...prev, newFile]);

    // Go to confirmation layout or offer choices
    setLoading(true);
    try {
      // Simulate/trigger file tasks analysis
      const response = await fetch("/api/gemini/file-analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileName: name, fileType: type }),
      });
      if (response.ok) {
        const data = await response.json();
        const todayStr = new Date().toISOString().split("T")[0];
        setDraftTask({
          title: `Action: ${name.split(".")[0]}`,
          description: data.summary,
          priority: "Medium",
          category: "Other",
          deadline: todayStr,
          completed: false,
          steps: data.actionPoints.map((item: string) => ({ id: Math.random().toString(), title: item, completed: false })),
          dependencies: [],
          recurring: "none",
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const selectExampleFile = (fileName: string, type: string) => {
    addFileToUploads(fileName, type);
  };

  // Task Confirmation Flow actions
  const handleSaveSingleTask = () => {
    if (draftTask) {
      onTaskCreated(draftTask);
      setDraftTask(null);
    }
  };

  const handleCreatePlan = async () => {
    if (!draftTask) return;
    setLoading(true);
    setError(null);
    try {
      // Ask Gemini for subtask plan steps
      const response = await fetch("/api/gemini/plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          taskTitle: draftTask.title,
          taskDescription: draftTask.description,
        }),
      });
      if (!response.ok) throw new Error("Plan generation failed.");
      const planData = await response.json();

      const updatedTask = {
        ...draftTask,
        category: planData.category || draftTask.category,
        priority: planData.priority || draftTask.priority,
        steps: (planData.steps || []).map((step: string) => ({
          id: Math.random().toString(),
          title: step,
          completed: false,
        })),
      };

      onTaskCreated(updatedTask);
      setDraftTask(null);
    } catch (err: any) {
      setError(err?.message || "Failed to generate dynamic plan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm select-none">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-4 mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold text-gray-950 text-sm">Add New Task</h3>
        </div>
        <div className="flex bg-gray-50 p-1 rounded-xl w-full sm:w-auto overflow-x-auto">
          {(["chat", "voice", "manual", "upload"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                setError(null);
              }}
              className={`flex-1 sm:flex-initial text-center px-3 py-1.5 text-xs font-semibold rounded-lg capitalize transition-all cursor-pointer ${
                activeTab === tab
                  ? "bg-white text-blue-600 shadow-xs font-bold"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {loading && (
        <div className="flex flex-col items-center justify-center py-10 space-y-3">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-gray-500">Parsing through intelligence companion...</p>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 text-red-700 bg-red-50 p-3.5 rounded-xl text-xs mb-4">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {/* RENDER ACTIVE TAB CODES (if not currently in draft confirmation) */}
      {!loading && !draftTask && (
        <div>
          {activeTab === "chat" && (
            <form onSubmit={handleChatSubmit} className="space-y-3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Ask Gemini (e.g., 'Draft project milestones next Monday')"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:bg-white text-sm px-4 py-3 rounded-xl outline-none transition-all pr-12 text-gray-955 placeholder-gray-400"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg p-1.5 transition-colors cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              <p className="text-[10px] text-gray-400 flex items-center gap-1">
                <MessageSquare className="w-3 h-3 text-blue-500" />
                Type naturally like chatting with Gemini.
              </p>
            </form>
          )}

          {activeTab === "voice" && (
            <div className="flex flex-col items-center py-6 space-y-4">
              <button
                onClick={startVoiceCapture}
                disabled={isRecording}
                className={`w-16 h-16 rounded-full flex items-center justify-center border transition-all cursor-pointer ${
                  isRecording
                    ? "bg-red-500 text-white border-red-500 animate-pulse"
                    : "bg-blue-50 border-blue-100 text-blue-600 hover:bg-blue-100/80"
                }`}
              >
                <Mic className="w-6 h-6" />
              </button>
              <div className="text-center space-y-1">
                <p className="text-xs font-semibold text-gray-950">
                  {isRecording ? "Listening to natural voice..." : "Click to Speak"}
                </p>
                <p className="text-[10px] text-gray-400">
                  Try: "I need to submit my report by Friday"
                </p>
              </div>

              {/* Sample Quick Voice Commands */}
              <div className="flex flex-wrap justify-center gap-2 pt-2">
                <button
                  onClick={() => parseNaturalLanguage("I have a client meeting tomorrow.")}
                  className="px-2.5 py-1.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg text-[10px] font-medium text-gray-700"
                >
                  "Client meeting tomorrow"
                </button>
                <button
                  onClick={() => parseNaturalLanguage("I need to submit my report by Friday.")}
                  className="px-2.5 py-1.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg text-[10px] font-medium text-gray-700"
                >
                  "Submit report by Friday"
                </button>
              </div>
            </div>
          )}

          {activeTab === "manual" && (
            <form onSubmit={handleManualSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2 space-y-1">
                  <label className="text-[11px] font-semibold text-gray-500 uppercase">Task Title</label>
                  <input
                    type="text"
                    required
                    placeholder="E.g., Complete code audit"
                    value={manualTitle}
                    onChange={(e) => setManualTitle(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:bg-white text-xs px-3 py-2 rounded-xl outline-none"
                  />
                </div>

                <div className="col-span-2 space-y-1">
                  <label className="text-[11px] font-semibold text-gray-500 uppercase">Description</label>
                  <textarea
                    placeholder="Details about task..."
                    value={manualDesc}
                    onChange={(e) => setManualDesc(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:bg-white text-xs px-3 py-2 rounded-xl outline-none h-16 resize-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-gray-500 uppercase">Category</label>
                  <select
                    value={manualCategory}
                    onChange={(e) => setManualCategory(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 text-xs px-3 py-2 rounded-xl outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  >
                    {["Work", "Personal", "Study", "Health", "Travel", "Finance", "Family"].map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-gray-500 uppercase">Priority</label>
                  <select
                    value={manualPriority}
                    onChange={(e) => setManualPriority(e.target.value as any)}
                    className="w-full bg-gray-50 border border-gray-200 text-xs px-3 py-2 rounded-xl outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  >
                    {["High", "Medium", "Low"].map((prio) => (
                      <option key={prio} value={prio}>{prio}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-gray-500 uppercase">Deadline</label>
                  <input
                    type="date"
                    value={manualDeadline}
                    onChange={(e) => setManualDeadline(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 text-xs px-3 py-2 rounded-xl outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-gray-500 uppercase">Recurring</label>
                  <select
                    value={manualRecurring}
                    onChange={(e) => setManualRecurring(e.target.value as any)}
                    className="w-full bg-gray-50 border border-gray-200 text-xs px-3 py-2 rounded-xl outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="none">No Recurrence</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="custom">Custom Recurrence</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-gray-500 uppercase">Depends On (Blocked By)</label>
                  <select
                    value={manualDependency}
                    onChange={(e) => setManualDependency(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 text-xs px-3 py-2 rounded-xl outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="">None</option>
                    {existingTasks.filter(t => !t.completed).map((t) => (
                      <option key={t.id} value={t.id}>{t.title}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center justify-between col-span-2 pt-2 border-t border-gray-50">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="manualAllDay"
                      checked={manualAllDay}
                      onChange={(e) => setManualAllDay(e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="manualAllDay" className="text-xs text-gray-600 font-medium">All-day task</label>
                  </div>
                  
                  {!manualAllDay && (
                    <div className="flex items-center gap-1">
                      <input
                        type="time"
                        value={manualStartTime}
                        onChange={(e) => setManualStartTime(e.target.value)}
                        className="bg-gray-50 border border-gray-200 text-[11px] p-1.5 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      />
                      <span className="text-gray-400 text-xs">-</span>
                      <input
                        type="time"
                        value={manualEndTime}
                        onChange={(e) => setManualEndTime(e.target.value)}
                        className="bg-gray-50 border border-gray-200 text-[11px] p-1.5 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-colors cursor-pointer"
                >
                  Create Task
                </button>
              </div>
            </form>
          )}

          {activeTab === "upload" && (
            <div className="space-y-4">
              {/* Drag and drop upload zone */}
              <div
                onClick={triggerFileUpload}
                className="border-2 border-dashed border-gray-200 hover:border-blue-500 rounded-2xl p-6 text-center cursor-pointer bg-gray-50/50 hover:bg-blue-50/10 transition-all group"
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                />
                <Upload className="w-8 h-8 text-gray-400 group-hover:text-blue-500 mx-auto mb-2 transition-colors" />
                <p className="text-xs font-semibold text-gray-800">Click or Drag File to Upload</p>
                <p className="text-[10px] text-gray-400 mt-1">PDFs, Images, Documents, Tickets (Max 10MB)</p>
              </div>

              {/* Upload templates and scenario triggers */}
              <div className="space-y-2">
                <h5 className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Example Templates</h5>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {[
                    { label: "Flight Ticket PDF", icon: FileText, file: "flight_ticket_AA204.pdf", type: "application/pdf" },
                    { label: "Water Bill Copy", icon: FileText, file: "utility_bill_june.png", type: "image/png" },
                    { label: "Meeting Screenshot", icon: FileText, file: "board_meeting_slide.jpg", type: "image/jpeg" },
                    { label: "Assignment Handout", icon: FileText, file: "cs101_final_project.pdf", type: "application/pdf" },
                  ].map((ex) => (
                    <button
                      key={ex.file}
                      onClick={() => selectExampleFile(ex.file, ex.type)}
                      className="flex items-center gap-2 p-2 bg-gray-50 border border-gray-100 hover:border-blue-500 hover:bg-blue-50/20 rounded-xl text-[10px] text-left text-gray-700 transition-all"
                    >
                      <ex.icon className="w-3.5 h-3.5 text-gray-500" />
                      <span className="truncate flex-1 font-medium">{ex.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* RENDER TASK CONFIRMATION CARD (as per spec) */}
      {draftTask && !loading && (
        <div className="bg-blue-50/30 border border-blue-100 rounded-2xl p-5 space-y-4 animate-fade-in select-none">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-semibold text-blue-600 uppercase tracking-widest flex items-center gap-1 font-sans">
                <Shield className="w-3 h-3 text-blue-600" /> Confirm Task & Planning
              </span>
              <h4 className="font-semibold text-gray-950 text-base">{draftTask.title}</h4>
              {draftTask.description && (
                <p className="text-xs text-gray-500 leading-relaxed mt-1">{draftTask.description}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2.5 text-xs bg-white border border-gray-100 p-3 rounded-xl">
            <div>
              <span className="text-[9px] font-semibold text-gray-400 uppercase block">Category</span>
              <span className="font-semibold text-gray-900 capitalize">{draftTask.category}</span>
            </div>
            <div>
              <span className="text-[9px] font-semibold text-gray-400 uppercase block">Deadline</span>
              <span className="font-semibold text-gray-900">{draftTask.deadline}</span>
            </div>
            <div>
              <span className="text-[9px] font-semibold text-gray-400 uppercase block">Priority</span>
              <span className="font-semibold text-gray-900">{draftTask.priority}</span>
            </div>
          </div>

          {/* Files Privacy indicators if files exists */}
          {uploadedFiles.length > 0 && (
            <div className="space-y-2 bg-white p-3 border border-gray-100 rounded-xl">
              <span className="text-[10px] font-semibold text-gray-400 uppercase block">Privacy-First Files Protection</span>
              {uploadedFiles.map((f, i) => (
                <div key={i} className="flex items-center justify-between text-xs">
                  <span className="truncate max-w-[200px] text-gray-700 font-medium">{f.name}</span>
                  <div className="flex bg-gray-50 p-1 rounded-lg gap-1 border border-gray-200">
                    <button
                      onClick={() => {
                        const copy = [...uploadedFiles];
                        copy[i].permission = "🔒";
                        setUploadedFiles(copy);
                      }}
                      className={`px-1.5 py-0.5 rounded text-[10px] font-semibold transition-all ${
                        f.permission === "🔒" ? "bg-white text-blue-600 shadow-xs font-bold" : "text-gray-400"
                      }`}
                      title="Attach Only (🔒)"
                    >
                      🔒 Attach Only
                    </button>
                    <button
                      onClick={() => {
                        const copy = [...uploadedFiles];
                        copy[i].permission = "🤖";
                        setUploadedFiles(copy);
                      }}
                      className={`px-1.5 py-0.5 rounded text-[10px] font-semibold transition-all ${
                        f.permission === "🤖" ? "bg-white text-blue-600 shadow-xs font-bold" : "text-gray-400"
                      }`}
                      title="Analyze with AI (🤖)"
                    >
                      🤖 Analyze with AI
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Action buttons */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-t border-blue-100 pt-4">
            <button
              onClick={() => {
                // Return back to tabs/cancel
                setDraftTask(null);
                setUploadedFiles([]);
              }}
              className="text-xs font-semibold text-gray-500 hover:text-gray-800"
            >
              Cancel
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={handleSaveSingleTask}
                className="px-3.5 py-2 border border-gray-250 hover:border-blue-500 hover:bg-blue-50/10 rounded-xl text-xs font-semibold text-gray-800 transition-all cursor-pointer animate-fade-in"
              >
                Save as Single Task
              </button>
              <button
                onClick={handleCreatePlan}
                className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2 rounded-xl shadow-sm transition-colors cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Create Plan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
