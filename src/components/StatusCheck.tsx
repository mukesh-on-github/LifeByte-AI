import React, { useState, useEffect } from "react";
import { Check, X, AlertTriangle, CalendarDays, Archive } from "lucide-react";
import { Task } from "../types";

interface StatusCheckProps {
  tasks: Task[];
  onCompleteTask: (taskId: string) => void;
  onRescheduleTask: (taskId: string, newDate: string) => void;
  onSkipTask: (taskId: string) => void;
}

export default function StatusCheck({ tasks, onCompleteTask, onRescheduleTask, onSkipTask }: StatusCheckProps) {
  const [activeCheck, setActiveCheck] = useState<Task | null>(null);
  const [showOptions, setShowOptions] = useState(false);

  useEffect(() => {
    // Find first task that is due today or overdue and not completed, and hasn't been handled yet
    const todayStr = new Date().toISOString().split("T")[0];
    const target = tasks.find((t) => {
      if (t.completed) return false;
      return t.deadline <= todayStr;
    });

    if (target) {
      setActiveCheck(target);
    } else {
      setActiveCheck(null);
    }
  }, [tasks]);

  if (!activeCheck) return null;

  const handleYes = () => {
    onCompleteTask(activeCheck.id);
    setActiveCheck(null);
    setShowOptions(false);
  };

  const handleNo = () => {
    setShowOptions(true);
  };

  const handleReschedule = (daysToAdd: number) => {
    const d = new Date();
    d.setDate(d.getDate() + daysToAdd);
    const newDateStr = d.toISOString().split("T")[0];
    onRescheduleTask(activeCheck.id, newDateStr);
    setActiveCheck(null);
    setShowOptions(false);
  };

  const handleSkip = () => {
    onSkipTask(activeCheck.id);
    setActiveCheck(null);
    setShowOptions(false);
  };

  return (
    <div className="bg-blue-50/40 border border-blue-100 rounded-2xl p-5 mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xs animate-fade-in select-none">
      <div className="flex items-start gap-3">
        <div className="bg-blue-100 text-blue-700 p-2.5 rounded-xl mt-0.5">
          <CalendarDays className="w-5 h-5" />
        </div>
        <div>
          <span className="text-[10px] font-bold text-blue-700 tracking-wider uppercase font-sans">Task Check-In</span>
          <h4 className="text-sm font-semibold text-gray-900 mt-0.5">
            Have you completed "{activeCheck.title}"?
          </h4>
          <p className="text-xs text-gray-500 mt-1">
            This task was scheduled for {activeCheck.deadline === new Date().toISOString().split("T")[0] ? "today" : activeCheck.deadline}.
          </p>
        </div>
      </div>

      {!showOptions ? (
        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          <button
            onClick={handleNo}
            className="flex-1 md:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 bg-white border border-gray-200 hover:border-gray-300 rounded-xl text-xs font-semibold text-gray-700 transition-colors cursor-pointer"
          >
            <X className="w-3.5 h-3.5 text-red-500" />
            No
          </button>
          <button
            onClick={handleYes}
            className="flex-1 md:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-xl text-xs font-semibold text-white transition-colors cursor-pointer"
          >
            <Check className="w-3.5 h-3.5 text-white" />
            Yes
          </button>
        </div>
      ) : (
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end">
          <span className="text-xs text-blue-800 mr-2 font-medium">Choose an action:</span>
          <button
            onClick={() => handleReschedule(1)}
            className="flex items-center gap-1 px-3 py-1.5 bg-white border border-blue-200 hover:bg-blue-50/50 rounded-lg text-xs font-medium text-blue-950 transition-colors cursor-pointer"
          >
            <CalendarDays className="w-3.5 h-3.5 text-blue-600" />
            Reschedule Tomorrow
          </button>
          <button
            onClick={() => handleReschedule(3)}
            className="flex items-center gap-1 px-3 py-1.5 bg-white border border-blue-200 hover:bg-blue-50/50 rounded-lg text-xs font-medium text-blue-950 transition-colors cursor-pointer"
          >
            <CalendarDays className="w-3.5 h-3.5 text-blue-600" />
            Reschedule 3 Days
          </button>
          <button
            onClick={handleSkip}
            className="flex items-center gap-1 px-3 py-1.5 bg-white border border-blue-200 hover:bg-blue-50/50 rounded-lg text-xs font-medium text-blue-950 transition-colors cursor-pointer"
          >
            <Archive className="w-3.5 h-3.5 text-blue-600" />
            Skip Task
          </button>
          <button
            onClick={() => setShowOptions(false)}
            className="px-2 py-1 text-xs text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}
