import React, { useState } from "react";
import { Calendar as CalendarIcon, List, ChevronLeft, ChevronRight, CalendarDays, Sparkles, AlertCircle } from "lucide-react";
import { Task } from "../types";

interface CalendarViewProps {
  tasks: Task[];
  onRescheduleTask: (taskId: string, newDate: string) => void;
  onSelectTask: (task: Task) => void;
}

export default function CalendarView({ tasks, onRescheduleTask, onSelectTask }: CalendarViewProps) {
  const [viewMode, setViewMode] = useState<"calendar" | "list">("calendar");
  const [currentDate, setCurrentDate] = useState(new Date(2026, 5, 30)); // Set near current time

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Helper arrays
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Calendar dates generation
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonthDays = [];
  const prevMonthTotalDays = new Date(year, month, 0).getDate();
  for (let i = firstDayOfMonth - 1; i >= 0; i--) {
    prevMonthDays.push(new Date(year, month - 1, prevMonthTotalDays - i));
  }

  const currentMonthDays = [];
  for (let i = 1; i <= daysInMonth; i++) {
    currentMonthDays.push(new Date(year, month, i));
  }

  const totalCells = prevMonthDays.length + currentMonthDays.length;
  const nextMonthDaysCount = totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7);
  const nextMonthDays = [];
  for (let i = 1; i <= nextMonthDaysCount; i++) {
    nextMonthDays.push(new Date(year, month + 1, i));
  }

  const allCalendarDays = [...prevMonthDays, ...currentMonthDays, ...nextMonthDays];

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const getTasksForDate = (date: Date) => {
    const dateStr = date.toISOString().split("T")[0];
    return tasks.filter((t) => t.deadline === dateStr);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-6 shadow-sm select-none">
      
      {/* Header controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-gray-100 pb-5 mb-5">
        <div className="flex items-center gap-2">
          <CalendarIcon className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold text-gray-950 text-sm">Schedule Planner</h3>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Navigation Controls for Calendar View */}
          {viewMode === "calendar" && (
            <div className="flex items-center gap-1 bg-gray-50 border border-gray-200 p-1 rounded-xl">
              <button
                onClick={handlePrevMonth}
                className="p-1.5 hover:bg-white hover:shadow-xs rounded-lg text-gray-600 transition-all cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-xs font-semibold text-gray-800 px-2 min-w-[80px] sm:min-w-[100px] text-center">
                {monthNames[month]} {year}
              </span>
              <button
                onClick={handleNextMonth}
                className="p-1.5 hover:bg-white hover:shadow-xs rounded-lg text-gray-600 transition-all cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* View Mode Toggle */}
          <div className="flex bg-gray-50 border border-gray-200 p-1 rounded-xl">
            <button
              onClick={() => setViewMode("calendar")}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                viewMode === "calendar"
                  ? "bg-white text-blue-600 shadow-xs font-bold"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              <CalendarIcon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Calendar Grid</span>
              <span className="sm:hidden">Grid</span>
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                viewMode === "list"
                  ? "bg-white text-blue-600 shadow-xs font-bold"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Chronological List</span>
              <span className="sm:hidden">List</span>
            </button>
          </div>
        </div>
      </div>

      {/* VIEW MODES */}
      {viewMode === "calendar" ? (
        <div>
          {/* Day Names Grid */}
          <div className="grid grid-cols-7 gap-1 text-center mb-1">
            {dayNames.map((name) => (
              <span key={name} className="text-[10px] font-bold text-gray-400 uppercase py-1">
                <span className="hidden sm:inline">{name}</span>
                <span className="sm:hidden">{name.slice(0, 2)}</span>
              </span>
            ))}
          </div>

          {/* Calendar Days Cells */}
          <div className="grid grid-cols-7 gap-1 border border-gray-100 rounded-xl overflow-hidden bg-gray-50">
            {allCalendarDays.map((date, idx) => {
              const isCurrentMonth = date.getMonth() === month;
              const dateTasks = getTasksForDate(date);
              const isToday = date.toISOString().split("T")[0] === new Date().toISOString().split("T")[0];

              return (
                <div
                  key={idx}
                  className={`min-h-[85px] sm:min-h-[100px] bg-white p-1.5 sm:p-2 flex flex-col justify-between border border-gray-50/50 transition-all ${
                    isCurrentMonth ? "text-gray-900" : "text-gray-300 bg-gray-50/20"
                  } ${isToday ? "ring-2 ring-inset ring-blue-600 bg-blue-50/10" : ""}`}
                >
                  <span className={`text-[10px] font-semibold block ${isToday ? "font-bold text-blue-600" : "text-gray-500"}`}>
                    {date.getDate()}
                  </span>

                  <div className="space-y-1 overflow-y-auto max-h-[60px] sm:max-h-[70px] mt-1 pr-0.5">
                    {dateTasks.map((task) => (
                      <button
                        key={task.id}
                        onClick={() => onSelectTask(task)}
                        className={`w-full text-left p-1 text-[9px] font-medium rounded truncate border transition-all cursor-pointer ${
                          task.completed
                            ? "bg-gray-100/60 border-gray-200 text-gray-400 line-through"
                            : task.priority === "High"
                            ? "bg-red-50 border-red-100 text-red-700 font-semibold"
                            : task.priority === "Medium"
                            ? "bg-amber-50 border-amber-100 text-amber-800"
                            : "bg-blue-50 border-blue-100 text-blue-700"
                        }`}
                        title={task.title}
                      >
                        {task.title}
                      </button>
                    ))}
                  </div>

                  {/* Rescheduling click tool shortcut - Hidden on mobile/tablets where List rescheduling is preferred */}
                  <div className="mt-1 hidden lg:flex justify-end">
                    <select
                      onChange={(e) => {
                        if (e.target.value) {
                          onRescheduleTask(e.target.value, date.toISOString().split("T")[0]);
                          e.target.value = "";
                        }
                      }}
                      className="text-[8px] bg-gray-50 border border-gray-200 text-gray-500 rounded px-1 max-w-[50px] outline-none hover:border-gray-400 transition-all"
                      title="Move task to this day"
                    >
                      <option value="">Move...</option>
                      {tasks.filter(t => !t.completed).map((t) => (
                        <option key={t.id} value={t.id}>{t.title}</option>
                      ))}
                    </select>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* List View Mode */
        <div className="space-y-4">
          {tasks.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
              <CalendarIcon className="w-10 h-10 text-gray-300 mx-auto mb-2" />
              <p className="text-sm font-semibold text-gray-500">No tasks on schedule.</p>
              <p className="text-xs text-gray-400 mt-1">Everything planned appears here chronologically.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {[...tasks]
                .sort((a, b) => a.deadline.localeCompare(b.deadline))
                .map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100/50 border border-gray-100 rounded-2xl transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-center bg-white border border-gray-200 py-1.5 px-3 rounded-xl min-w-[65px] shadow-xs">
                        <span className="text-[10px] font-bold text-blue-600 uppercase block leading-none">
                          {new Date(task.deadline).toLocaleDateString("en", { month: "short" })}
                        </span>
                        <span className="text-sm font-extrabold text-gray-900 block mt-1 leading-none">
                          {new Date(task.deadline).toLocaleDateString("en", { day: "numeric" })}
                        </span>
                      </div>
                      <div>
                        <h4
                          onClick={() => onSelectTask(task)}
                          className={`text-xs font-semibold text-gray-900 cursor-pointer hover:underline ${
                            task.completed ? "line-through text-gray-400 font-normal" : ""
                          }`}
                        >
                          {task.title}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[9px] font-bold bg-white text-gray-500 px-1.5 py-0.5 rounded border border-gray-200 uppercase">
                            {task.category}
                          </span>
                          <span className="text-[9px] text-gray-400">
                            {task.allDay ? "All-Day" : `${task.startTime} - ${task.endTime}`}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="date"
                        value={task.deadline}
                        onChange={(e) => onRescheduleTask(task.id, e.target.value)}
                        className="text-[10px] bg-white border border-gray-200 text-gray-500 px-2 py-1 rounded-lg outline-none cursor-pointer"
                        title="Reschedule task deadline"
                      />
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
