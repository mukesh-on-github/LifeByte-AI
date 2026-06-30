import React, { useState, useEffect } from "react";
import { X, CheckSquare, ListTodo, Paperclip, History, ShieldAlert, Play, Plus, Trash2, ArrowUp, ArrowDown, FileQuestion, HelpCircle, Lock, Cpu } from "lucide-react";
import { Task, Subtask, FileRecord, ActivityLog } from "../types";

interface TaskDetailsModalProps {
  task: Task;
  onClose: () => void;
  onUpdateTask: (updatedTask: Task) => void;
  allTasks: Task[];
}

export default function TaskDetailsModal({ task, onClose, onUpdateTask, allTasks }: TaskDetailsModalProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "steps" | "files" | "activity">("overview");

  // Local steps state
  const [steps, setSteps] = useState<Subtask[]>(task.steps || []);
  const [newStepTitle, setNewStepTitle] = useState("");

  // Local files state (simulated file storage attachment associated with this task)
  const [files, setFiles] = useState<FileRecord[]>([]);

  // Local logs state
  const [logs, setLogs] = useState<ActivityLog[]>([]);

  // Load files and logs
  useEffect(() => {
    // Look up file records associated with this task in local state or general files
    const storedFiles = localStorage.getItem("lifebyte_files");
    if (storedFiles) {
      const parsed: FileRecord[] = JSON.parse(storedFiles);
      setFiles(parsed.filter((f) => f.taskId === task.id));
    }

    // Look up activity logs
    const storedLogs = localStorage.getItem("lifebyte_activity");
    if (storedLogs) {
      const parsed: ActivityLog[] = JSON.parse(storedLogs);
      setLogs(parsed.filter((l) => l.taskId === task.id));
    }
  }, [task.id]);

  // Handle auto-completion when steps change
  const updateTaskSteps = (updatedSteps: Subtask[]) => {
    setSteps(updatedSteps);

    // Calculate progress
    const completedCount = updatedSteps.filter((s) => s.completed).length;
    const isAllComplete = updatedSteps.length > 0 && completedCount === updatedSteps.length;

    const updatedTask: Task = {
      ...task,
      steps: updatedSteps,
      completed: isAllComplete ? true : task.completed,
      updatedAt: new Date().toISOString(),
    };

    onUpdateTask(updatedTask);
    addLog(isAllComplete ? "complete" : "update", `Updated task steps progress: ${completedCount}/${updatedSteps.length}`);
  };

  const addLog = (type: any, details: string) => {
    const newLog: ActivityLog = {
      id: Math.random().toString(),
      userId: task.userId,
      taskId: task.id,
      type,
      details,
      timestamp: new Date().toISOString(),
    };
    const stored = localStorage.getItem("lifebyte_activity");
    const currentLogs = stored ? JSON.parse(stored) : [];
    const updatedLogs = [newLog, ...currentLogs];
    localStorage.setItem("lifebyte_activity", JSON.stringify(updatedLogs));
    setLogs(updatedLogs.filter((l) => l.taskId === task.id));
  };

  // Step Actions
  const handleAddStep = () => {
    if (!newStepTitle.trim()) return;
    const newStep: Subtask = {
      id: Math.random().toString(),
      title: newStepTitle.trim(),
      completed: false,
    };
    const updated = [...steps, newStep];
    updateTaskSteps(updated);
    setNewStepTitle("");
  };

  const handleToggleStep = (stepId: string) => {
    const updated = steps.map((s) => (s.id === stepId ? { ...s, completed: !s.completed } : s));
    updateTaskSteps(updated);
  };

  const handleRemoveStep = (stepId: string) => {
    const updated = steps.filter((s) => s.id !== stepId);
    updateTaskSteps(updated);
  };

  const handleMoveStep = (index: number, direction: "up" | "down") => {
    if (direction === "up" && index === 0) return;
    if (direction === "down" && index === steps.length - 1) return;

    const targetIndex = direction === "up" ? index - 1 : index + 1;
    const updated = [...steps];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;

    updateTaskSteps(updated);
  };

  // Change file privacy permission (🔒 vs 🤖)
  const handleToggleFilePermission = (fileId: string) => {
    const stored = localStorage.getItem("lifebyte_files");
    if (stored) {
      const parsed: FileRecord[] = JSON.parse(stored);
      const updated = parsed.map((f) => {
        if (f.id === fileId) {
          const nextPermission = f.permission === "🔒" ? ("🤖" as const) : ("🔒" as const);
          addLog("update", `File permission for ${f.name} changed to ${nextPermission}`);
          return { ...f, permission: nextPermission };
        }
        return f;
      });
      localStorage.setItem("lifebyte_files", JSON.stringify(updated));
      setFiles(updated.filter((f) => f.taskId === task.id));
    }
  };

  // Dependency checks
  const blockingDependencies = allTasks.filter(
    (t) => task.dependencies?.includes(t.id) && !t.completed
  );
  const isBlocked = blockingDependencies.length > 0;

  // Calculate Subtask progress percentage
  const totalSteps = steps.length;
  const completedSteps = steps.filter((s) => s.completed).length;
  const progressPercent = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;

  return (
    <div className="fixed inset-0 bg-neutral-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-xl max-w-2xl w-full flex flex-col max-h-[85vh] overflow-hidden select-none border border-gray-150 animate-fade-in">
        
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-gray-400 bg-gray-50 border border-gray-150 rounded px-2 py-0.5 uppercase">
                {task.category}
              </span>
              <span className={`text-[10px] font-bold rounded px-2 py-0.5 uppercase ${
                task.priority === "High" ? "bg-red-50 text-red-600 border border-red-100" :
                task.priority === "Medium" ? "bg-amber-50 text-amber-700 border border-amber-100" :
                "bg-blue-50 text-blue-600 border border-blue-100"
              }`}>
                {task.priority} Priority
              </span>
            </div>
            <h3 className="text-lg font-semibold text-gray-950 font-sans tracking-tight">{task.title}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-gray-100 text-gray-400 hover:text-gray-900 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-gray-100 px-6 bg-gray-50/50">
          {[
            { id: "overview", label: "Overview", icon: CheckSquare },
            { id: "steps", label: "Steps", icon: ListTodo },
            { id: "files", label: "Files", icon: Paperclip },
            { id: "activity", label: "Activity", icon: History },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-3 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? "border-blue-600 text-blue-600 font-bold"
                    : "border-transparent text-gray-500 hover:text-gray-900"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content Panel */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Active Tab Panel */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Dependency Warning */}
              {isBlocked && (
                <div className="bg-amber-50 border border-amber-200/55 rounded-2xl p-4 flex items-start gap-3">
                  <ShieldAlert className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h5 className="text-xs font-bold text-amber-900 uppercase tracking-wide">Waiting for dependencies</h5>
                    <p className="text-xs text-amber-700 leading-normal mt-0.5">
                      This task is currently blocked by:{" "}
                      {blockingDependencies.map((d) => `"${d.title}"`).join(", ")}. Please complete those tasks first.
                    </p>
                  </div>
                </div>
              )}

              {/* Description */}
              <div className="space-y-2">
                <h5 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Description</h5>
                <p className="text-xs text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-xl border border-gray-100">
                  {task.description || "No description provided."}
                </p>
              </div>

              {/* Date, Time block, Recurring metadata */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="bg-gray-50/50 border border-gray-100 p-3.5 rounded-xl space-y-1">
                  <span className="text-[10px] font-bold text-gray-400 uppercase">Deadline Date</span>
                  <p className="text-xs font-semibold text-gray-800">{task.deadline}</p>
                </div>

                <div className="bg-gray-50/50 border border-gray-100 p-3.5 rounded-xl space-y-1">
                  <span className="text-[10px] font-bold text-gray-400 uppercase">Time Block</span>
                  <p className="text-xs font-semibold text-gray-800">
                    {task.allDay ? "All-Day Task" : `${task.startTime} - ${task.endTime}`}
                  </p>
                </div>

                <div className="bg-gray-50/50 border border-gray-100 p-3.5 rounded-xl space-y-1 col-span-2 md:col-span-1">
                  <span className="text-[10px] font-bold text-gray-400 uppercase">Recurrence</span>
                  <p className="text-xs font-semibold text-gray-800 capitalize">{task.recurring}</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "steps" && (
            <div className="space-y-6">
              {/* Progress bar */}
              {totalSteps > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-gray-600">Subtask Completion Progress</span>
                    <span className="font-bold text-gray-900">{progressPercent}%</span>
                  </div>
                  <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-600 transition-all duration-300"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Steps List */}
              <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                {steps.length === 0 ? (
                  <div className="text-center py-8 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                    <ListTodo className="w-8 h-8 text-gray-300 mx-auto mb-1" />
                    <p className="text-xs font-semibold text-gray-500">No subtask steps yet.</p>
                  </div>
                ) : (
                  steps.map((step, index) => (
                    <div
                      key={step.id}
                      className="flex items-center justify-between p-3 bg-gray-50 border border-gray-100 hover:border-gray-250 rounded-xl transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={step.completed}
                          onChange={() => handleToggleStep(step.id)}
                          className="w-4.5 h-4.5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className={`text-xs ${step.completed ? "line-through text-gray-400" : "text-gray-800 font-medium"}`}>
                          {step.title}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleMoveStep(index, "up")}
                          disabled={index === 0}
                          className="p-1 hover:bg-gray-250 text-gray-400 hover:text-gray-800 rounded disabled:opacity-30 cursor-pointer"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleMoveStep(index, "down")}
                          disabled={index === steps.length - 1}
                          className="p-1 hover:bg-gray-250 text-gray-400 hover:text-gray-800 rounded disabled:opacity-30 cursor-pointer"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleRemoveStep(step.id)}
                          className="p-1 hover:bg-red-50 text-gray-400 hover:text-red-600 rounded cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Add Step form */}
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add a milestone step..."
                  value={newStepTitle}
                  onChange={(e) => setNewStepTitle(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleAddStep();
                  }}
                  className="flex-1 bg-gray-50 border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:bg-white text-xs px-3 py-2.5 rounded-xl outline-none"
                />
                <button
                  onClick={handleAddStep}
                  className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" />
                  Add
                </button>
              </div>
            </div>
          )}

          {activeTab === "files" && (
            <div className="space-y-6">
              {files.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                  <Paperclip className="w-8 h-8 text-gray-300 mx-auto mb-1" />
                  <p className="text-xs font-semibold text-gray-500">No attachments uploaded for this task.</p>
                  <p className="text-[10px] text-gray-400 mt-1">Files can be attached during task creation.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {files.map((file) => (
                    <div
                      key={file.id}
                      className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-gray-50 border border-gray-100 rounded-xl gap-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                          <Paperclip className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-gray-900 truncate max-w-[240px]">{file.name}</p>
                          <p className="text-[9px] text-gray-400 uppercase">{file.type}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end md:self-auto">
                        {/* Privacy Permission Indicator */}
                        <div className="flex items-center bg-white border border-gray-150 p-1 rounded-lg gap-1 shadow-sm">
                          <button
                            onClick={() => handleToggleFilePermission(file.id)}
                            className={`flex items-center gap-1 px-2 py-1 rounded text-[10px] font-semibold transition-all cursor-pointer ${
                              file.permission === "🔒" ? "bg-blue-600 text-white font-bold" : "text-gray-400"
                            }`}
                          >
                            <Lock className="w-3 h-3" />
                            🔒 Attach Only
                          </button>
                          <button
                            onClick={() => handleToggleFilePermission(file.id)}
                            className={`flex items-center gap-1 px-2 py-1 rounded text-[10px] font-semibold transition-all cursor-pointer ${
                              file.permission === "🤖" ? "bg-blue-600 text-white font-bold" : "text-gray-400"
                            }`}
                          >
                            <Cpu className="w-3 h-3" />
                            🤖 AI Enabled
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "activity" && (
            <div className="space-y-4">
              <h5 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">History Log</h5>
              <div className="space-y-3 max-h-[250px] overflow-y-auto pr-1">
                {logs.length === 0 ? (
                  <div className="text-center py-6 text-gray-400 text-xs font-semibold">
                    No activity logs recorded yet.
                  </div>
                ) : (
                  logs.map((log) => (
                    <div
                      key={log.id}
                      className="flex items-start gap-3 p-3 bg-gray-50/50 rounded-xl border border-gray-100"
                    >
                      <div className="p-1 rounded bg-gray-100 text-gray-600 mt-0.5 text-[9px] font-bold uppercase">
                        {log.type}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-700 font-medium">{log.details}</p>
                        <p className="text-[10px] text-gray-400 mt-1">
                          {new Date(log.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
          >
            Close Details
          </button>
        </div>

      </div>
    </div>
  );
}
