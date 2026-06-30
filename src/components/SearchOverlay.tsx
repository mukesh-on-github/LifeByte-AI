import React, { useState } from "react";
import { Search, X, CheckSquare, Target, Paperclip, Filter, FolderKanban } from "lucide-react";
import { Task, Goal, FileRecord } from "../types";

interface SearchOverlayProps {
  tasks: Task[];
  goals: Goal[];
  files: FileRecord[];
  onSelectTask: (task: Task) => void;
  onSelectGoal: (goal: Goal) => void;
  onClose: () => void;
}

export default function SearchOverlay({ tasks, goals, files, onSelectTask, onSelectGoal, onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "tasks" | "goals" | "files">("all");

  const filteredTasks = tasks.filter(
    (t) =>
      t.title.toLowerCase().includes(query.toLowerCase()) ||
      t.description?.toLowerCase().includes(query.toLowerCase()) ||
      t.category.toLowerCase().includes(query.toLowerCase())
  );

  const filteredGoals = goals.filter(
    (g) =>
      g.title.toLowerCase().includes(query.toLowerCase()) ||
      g.description?.toLowerCase().includes(query.toLowerCase())
  );

  const filteredFiles = files.filter((f) => f.name.toLowerCase().includes(query.toLowerCase()));

  const hasResults = query.trim().length > 0;

  return (
    <div className="fixed inset-0 bg-neutral-900/40 backdrop-blur-sm z-50 flex items-start justify-center p-4 pt-10 select-none">
      <div className="bg-white rounded-3xl shadow-xl border border-gray-150 max-w-xl w-full flex flex-col max-h-[75vh] overflow-hidden animate-fade-in">
        
        {/* Search Bar Input */}
        <div className="p-4 border-b border-gray-100 flex items-center gap-3">
          <Search className="w-5 h-5 text-gray-400 flex-shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder="Search across tasks, long-term goals, or attached files..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 text-sm bg-transparent outline-none text-gray-950 placeholder-gray-400"
          />
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-900 cursor-pointer"
          >
            <X className="w-4.5 h-4.5" />
          </button>
        </div>

        {/* Filters */}
        <div className="flex gap-1.5 px-4 py-2.5 bg-gray-50 border-b border-gray-100 items-center overflow-x-auto">
          <Filter className="w-3.5 h-3.5 text-gray-400 mr-1.5" />
          {[
            { id: "all", label: "All Items" },
            { id: "tasks", label: "Tasks" },
            { id: "goals", label: "Goals" },
            { id: "files", label: "Files" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setFilter(item.id as any)}
              className={`px-3 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                filter === item.id
                  ? "bg-blue-600 text-white font-bold"
                  : "bg-white border border-gray-200 text-gray-500 hover:text-gray-800 shadow-xs"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Search results panels */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {!hasResults ? (
            <div className="text-center py-12 text-gray-400">
              <FolderKanban className="w-10 h-10 text-gray-300 mx-auto mb-2" />
              <p className="text-xs font-semibold">Start typing to query LifeByte workspace...</p>
            </div>
          ) : (
            <div className="space-y-4">
              
              {/* Group: Tasks */}
              {(filter === "all" || filter === "tasks") && filteredTasks.length > 0 && (
                <div className="space-y-1.5">
                  <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-2">Matched Tasks</h4>
                  {filteredTasks.map((task) => (
                    <button
                      key={task.id}
                      onClick={() => {
                        onSelectTask(task);
                        onClose();
                      }}
                      className="w-full text-left p-3 hover:bg-gray-50 rounded-xl border border-transparent hover:border-gray-150 flex items-center justify-between transition-all cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <CheckSquare className="w-4 h-4 text-gray-400" />
                        <div>
                          <span className={`text-xs font-semibold text-gray-900 ${task.completed ? "line-through text-gray-400" : ""}`}>
                            {task.title}
                          </span>
                          <span className="text-[9px] font-bold text-gray-400 bg-gray-50 border border-gray-150 rounded px-1 ml-2 uppercase">
                            {task.category}
                          </span>
                        </div>
                      </div>
                      <span className="text-[10px] text-gray-400">{task.deadline}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* Group: Goals */}
              {(filter === "all" || filter === "goals") && filteredGoals.length > 0 && (
                <div className="space-y-1.5">
                  <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-2">Matched Goals</h4>
                  {filteredGoals.map((goal) => (
                    <button
                      key={goal.id}
                      onClick={() => {
                        onSelectGoal(goal);
                        onClose();
                      }}
                      className="w-full text-left p-3 hover:bg-gray-50 rounded-xl border border-transparent hover:border-gray-150 flex items-center justify-between transition-all cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <Target className="w-4 h-4 text-gray-400" />
                        <span className={`text-xs font-semibold text-gray-900 ${goal.completed ? "line-through text-gray-400" : ""}`}>
                          {goal.title}
                        </span>
                      </div>
                      <span className="text-[10px] text-gray-400">Goal</span>
                    </button>
                  ))}
                </div>
              )}

              {/* Group: Files */}
              {(filter === "all" || filter === "files") && filteredFiles.length > 0 && (
                <div className="space-y-1.5">
                  <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-2">Matched Attachments</h4>
                  {filteredFiles.map((file) => (
                    <div
                      key={file.id}
                      className="p-3 hover:bg-gray-50 rounded-xl border border-transparent hover:border-gray-150 flex items-center justify-between transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <Paperclip className="w-4 h-4 text-gray-400" />
                        <div>
                          <span className="text-xs font-semibold text-gray-900">{file.name}</span>
                          <span className="text-[9px] text-gray-400 ml-2 uppercase">{file.type}</span>
                        </div>
                      </div>
                      <span className="text-[10px] font-semibold text-gray-400">{file.permission}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* No results match check */}
              {((filter === "all" || filter === "tasks") && filteredTasks.length === 0) &&
               ((filter === "all" || filter === "goals") && filteredGoals.length === 0) &&
               ((filter === "all" || filter === "files") && filteredFiles.length === 0) && (
                <div className="text-center py-8 text-xs text-gray-400 font-semibold">
                  No matching items found for "{query}".
                </div>
              )}

            </div>
          )}
        </div>

      </div>
    </div>
  );
}
