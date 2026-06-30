import React, { useState } from "react";
import { 
  Sparkles, Mic, FileText, CheckSquare, Target, Calendar, 
  ChevronRight, ArrowRight, BookOpen, Layers, Play, 
  Lightbulb, Check, ShieldCheck, Eye, HelpCircle, Laptop,
  Cpu, Lock, Info, Sparkle
} from "lucide-react";
import { Task } from "../types";

export default function TutorialView() {
  const [activeTourSection, setActiveTourSection] = useState<"basics" | "voice" | "file" | "planning">("basics");
  const [simulatedScenario, setSimulatedScenario] = useState<string | null>(null);
  const [simulationStep, setSimulationStep] = useState<number>(0);
  const [simulatedTask, setSimulatedTask] = useState<any>(null);
  const [simulating, setSimulating] = useState(false);

  // Simulation templates
  const scenarios = [
    {
      id: "exam",
      title: "📝 Prepare for CSE Semester Exams",
      prompt: "Prepare for my CSE exams starting next Monday",
      transcript: "I need to prepare for my CSE Semester Exams starting next Monday. It is a high priority study project.",
      extracted: {
        title: "CSE Semester Exams Preparation",
        category: "Study",
        priority: "High",
        deadline: "Next Monday",
        planSteps: [
          "Organize lecture notes & study materials",
          "Create a structured 7-day review syllabus",
          "Solve previous years' practice papers",
          "Coordinate study group discussion for complex topics"
        ]
      }
    },
    {
      id: "trip",
      title: "✈️ Coordinate Weekend Family Trip",
      prompt: "Plan a family weekend getaway on July 10th",
      transcript: "Plan a family weekend getaway trip on July 10th. Need to sort out flights and stay.",
      extracted: {
        title: "Weekend Family Getaway Trip",
        category: "Travel",
        priority: "Medium",
        deadline: "2026-07-10",
        planSteps: [
          "Compare flight prices & book tickest",
          "Research and reserve child-friendly accommodations",
          "Create a packed list and activity itinerary",
          "Set up out-of-office autoreply"
        ]
      }
    },
    {
      id: "bill",
      title: "💸 Utility Bill Due Analysis",
      prompt: "Upload June utility bill and auto-analyze",
      transcript: "Simulated Upload of: utility_bill_june.png (Size: 1.2 MB)",
      extracted: {
        title: "Pay June Utility Bill (Water & Power)",
        category: "Finance",
        priority: "High",
        deadline: "Due within 5 days",
        planSteps: [
          "Review extracted bill charges ($142.50)",
          "Initiate payment transfer via online banking portal",
          "Verify payment confirmation and archive receipt pdf"
        ]
      }
    }
  ];

  const handleStartSimulation = (scenarioId: string) => {
    const picked = scenarios.find(s => s.id === scenarioId);
    if (!picked) return;
    setSimulatedScenario(scenarioId);
    setSimulating(true);
    setSimulationStep(0);
    setSimulatedTask(null);

    // Step 1: Voice transcribing / Input parsing simulation
    setTimeout(() => {
      setSimulationStep(1);
      // Step 2: Extracting AI parameters
      setTimeout(() => {
        setSimulationStep(2);
        // Step 3: Autoplanning steps
        setTimeout(() => {
          setSimulationStep(3);
          setSimulating(false);
          setSimulatedTask(picked.extracted);
        }, 1500);
      }, 1500);
    }, 1200);
  };

  return (
    <div className="space-y-8 animate-fade-in select-none">
      
      {/* Tutorial Header Banner */}
      <div className="bg-gradient-to-br from-indigo-50 via-white to-blue-50/60 border border-indigo-100 rounded-3xl p-6 md:p-8 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-3 max-w-xl text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 border border-indigo-100 text-indigo-700 text-[10px] font-bold rounded-full uppercase tracking-wider">
            <BookOpen className="w-3.5 h-3.5" /> Interactive User Guide
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-950 font-sans">
            Master your LifeByte AI Companion
          </h1>
          <p className="text-xs md:text-sm text-gray-500 leading-relaxed font-sans font-medium">
            LifeByte AI isn't just a todo list — it's an intelligent, proactive companion designed to guide you through planning, prioritizing, and executing your responsibilities with ease.
          </p>
        </div>
        <div className="relative">
          <div className="w-24 h-24 bg-indigo-600/10 rounded-full flex items-center justify-center animate-pulse">
            <Cpu className="w-12 h-12 text-indigo-600" />
          </div>
          <div className="absolute -top-1 -right-1 bg-amber-500 text-white rounded-full p-1.5 shadow-md">
            <Sparkle className="w-4 h-4 animate-spin" style={{ animationDuration: '6s' }} />
          </div>
        </div>
      </div>

      {/* Main Tour Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        
        {/* Navigation panel */}
        <div className="md:col-span-1 bg-white border border-gray-200 rounded-2xl p-4 space-y-2 h-fit shadow-xs">
          <h3 className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider px-2.5 pb-2">
            Tour Sections
          </h3>
          {[
            { id: "basics", label: "💬 AI Chat Commands", icon: Sparkles },
            { id: "voice", label: "🎙️ Voice Transcribing", icon: Mic },
            { id: "file", label: "📁 File Analyser Vault", icon: FileText },
            { id: "planning", label: "🤖 AI Subtask Planner", icon: Layers }
          ].map((sec) => {
            const Icon = sec.icon;
            const isSelected = activeTourSection === sec.id;
            return (
              <button
                key={sec.id}
                onClick={() => setActiveTourSection(sec.id as any)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-xl text-left transition-all cursor-pointer ${
                  isSelected 
                    ? "bg-indigo-50 text-indigo-700 font-bold border-l-2 border-indigo-600" 
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                <Icon className={`w-4 h-4 ${isSelected ? "text-indigo-600" : "text-gray-400"}`} />
                <span>{sec.label}</span>
              </button>
            );
          })}
        </div>

        {/* Informative Display Panel */}
        <div className="md:col-span-3 bg-white border border-gray-200 rounded-3xl p-6 md:p-8 shadow-xs min-h-[340px] flex flex-col justify-between">
          {activeTourSection === "basics" && (
            <div className="space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-sm">Natural AI Chat Commands</h3>
                  <p className="text-[10px] text-gray-400">Conversational planning made effortless</p>
                </div>
              </div>

              <p className="text-xs text-gray-600 leading-relaxed">
                Rather than filling out long forms, you can type your tasks exactly how you think of them. Our underlying <strong>Gemini 3.5 Flash</strong> neural parser evaluates your words, extracts target information, and configures task details automatically.
              </p>

              <div className="space-y-2">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide block">How it works:</span>
                <div className="bg-gray-50 border border-gray-150 rounded-xl p-3 space-y-2 text-xs font-mono text-gray-600">
                  <p><span className="text-indigo-600 font-semibold">User:</span> "Need to finish slides for work strategic alignment by Friday afternoon."</p>
                  <p className="text-emerald-600 border-t border-gray-200/60 pt-1.5 flex items-center gap-1.5">
                    <CheckSquare className="w-3.5 h-3.5" /> <strong>LifeByte Extracts:</strong> Work Category, High Priority, Due this Friday
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 bg-blue-50/50 border border-blue-100 rounded-xl p-3.5 text-xs text-blue-700">
                <Lightbulb className="w-4 h-4 flex-shrink-0 text-blue-600" />
                <p>Try phrases like <em>"Schedule doctor checkup July 4th"</em> or <em>"Submit assignment for CS101 tomorrow"</em> in the Quick Add box on the Home page!</p>
              </div>
            </div>
          )}

          {activeTourSection === "voice" && (
            <div className="space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-50 text-red-600 rounded-xl flex items-center justify-center">
                  <Mic className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-sm">Voice Transcribing</h3>
                  <p className="text-[10px] text-gray-400">Perfect for planning on the go</p>
                </div>
              </div>

              <p className="text-xs text-gray-600 leading-relaxed">
                When you're busy or away from your keyboard, you can dictate responsibilities directly. LifeByte leverages the HTML5 Web Speech API to stream voice into transcripts, feeding them straight to Gemini for processing.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-150 space-y-1.5">
                  <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block">🗣️ What to say:</span>
                  <p className="text-xs text-gray-800 font-semibold italic">"Book a flight tickets next Monday to San Francisco"</p>
                </div>
                <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-150 space-y-1.5">
                  <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-wider block">⚡ AI Outcome:</span>
                  <p className="text-xs text-gray-800 font-medium">Auto-created <strong>Travel</strong> task scheduled on next Monday!</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 bg-amber-50/40 border border-amber-100 rounded-xl p-3.5 text-xs text-amber-800">
                <Info className="w-4 h-4 flex-shrink-0 text-amber-600" />
                <p>If microphone permissions are disabled or unsupported in browser frames, LifeByte runs a high-fidelity voice simulator so you can preview the flow instantly!</p>
              </div>
            </div>
          )}

          {activeTourSection === "file" && (
            <div className="space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-sm">Privacy-First File Analyser Vault</h3>
                  <p className="text-[10px] text-gray-400">Turn tickets, bills, or slides into agendas</p>
                </div>
              </div>

              <p className="text-xs text-gray-600 leading-relaxed">
                Drag and drop your flight tickets, college worksheets, or utilities bills. LifeByte secure analyzer processes attachments under high privacy safeguards, giving you two distinct control modes:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="border border-gray-150 p-3.5 rounded-xl space-y-2 hover:border-blue-200 transition-colors">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-gray-800">🔒 Attach Only</span>
                  </div>
                  <p className="text-[10px] text-gray-500 leading-relaxed">
                    Simply links the file to the task. Ideal for private documents, credentials, or sensitive business worksheets.
                  </p>
                </div>

                <div className="border border-indigo-100 bg-indigo-50/10 p-3.5 rounded-xl space-y-2 hover:border-indigo-300 transition-colors">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-indigo-700">🤖 AI Analyze & Extract</span>
                  </div>
                  <p className="text-[10px] text-indigo-600/80 leading-relaxed">
                    Feeds file descriptors to Gemini to read summaries, extract pricing or travel times, and generate immediate action-points.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTourSection === "planning" && (
            <div className="space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-sm">Dynamic AI Subtask Planning</h3>
                  <p className="text-[10px] text-gray-400">Micro-steps generator to bypass procrastination</p>
                </div>
              </div>

              <p className="text-xs text-gray-600 leading-relaxed">
                Big tasks cause procrastination. To combat this, when you input a task, instead of saving it straight away, you can select <span className="font-bold text-indigo-700">Create Plan</span>.
              </p>

              <div className="bg-gray-50 p-4 border border-gray-200 rounded-2xl text-xs space-y-2">
                <span className="text-[9px] font-bold text-indigo-600 uppercase tracking-widest block">Autogenerated Steps Breakdown:</span>
                <ul className="space-y-1.5 pl-1 font-sans">
                  <li className="flex items-center gap-2 text-gray-700">
                    <div className="w-4 h-4 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-[10px] font-bold">1</div>
                    <span>Draft high-level strategy slides</span>
                  </li>
                  <li className="flex items-center gap-2 text-gray-700">
                    <div className="w-4 h-4 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-[10px] font-bold">2</div>
                    <span>Verify performance numbers with financial analyst</span>
                  </li>
                  <li className="flex items-center gap-2 text-gray-700">
                    <div className="w-4 h-4 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-[10px] font-bold">3</div>
                    <span>Distribute agendas to directors before Friday sync</span>
                  </li>
                </ul>
              </div>

              <p className="text-[10px] text-gray-400 italic">
                Each checkpoint acts as a fully interactive checkbox. Complete them individually to make progress easy and satisfying.
              </p>
            </div>
          )}

          {/* Quick link button */}
          <div className="pt-4 border-t border-gray-100 flex justify-end">
            <button
              onClick={() => window.location.href = "/"}
              className="flex items-center gap-1.5 bg-neutral-900 hover:bg-neutral-800 text-white font-semibold py-2 px-4 rounded-xl text-xs transition-colors cursor-pointer"
            >
              <span>Go to Companion Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>

      {/* Interactive Simulator / Playground (Scoring Boost) */}
      <div className="bg-white border border-gray-200 rounded-3xl p-6 md:p-8 space-y-6 shadow-xs select-none">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-indigo-600 animate-spin" style={{ animationDuration: '4s' }} />
            <h3 className="font-bold text-gray-950 text-base">Interactive Simulation Playground</h3>
          </div>
          <p className="text-xs text-gray-500">
            Click any scenario below to trigger a simulated step-by-step display of how LifeByte's AI companion processes your inputs.
          </p>
        </div>

        {/* Action presets */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {scenarios.map((scen) => (
            <button
              key={scen.id}
              onClick={() => handleStartSimulation(scen.id)}
              disabled={simulating}
              className={`p-4 bg-gray-55 hover:bg-gray-100/60 border rounded-2xl text-left transition-all cursor-pointer ${
                simulatedScenario === scen.id 
                  ? "border-indigo-500 bg-indigo-50/15" 
                  : "border-gray-200"
              }`}
            >
              <h4 className="font-semibold text-xs text-gray-900">{scen.title}</h4>
              <p className="text-[10px] text-gray-400 mt-1 truncate">Prompt: "{scen.prompt}"</p>
            </button>
          ))}
        </div>

        {/* Live Simulator Log Monitor */}
        {simulatedScenario && (
          <div className="bg-neutral-950 text-neutral-200 rounded-2xl p-5 font-mono text-[11px] space-y-3.5 border border-neutral-800 shadow-inner">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
              <span className="text-neutral-400 uppercase font-bold tracking-wider text-[9px] flex items-center gap-1.5">
                <Laptop className="w-3.5 h-3.5 text-indigo-400" /> LifeByte AI Simulator Monitor
              </span>
              <span className="text-[9px] bg-indigo-600/30 text-indigo-300 px-2 py-0.5 rounded uppercase font-bold animate-pulse">
                {simulating ? "Simulating..." : "Task Generated"}
              </span>
            </div>

            <div className="space-y-2">
              <p className="text-blue-400">
                &gt; [USER INPUT RECEIVING] : "{scenarios.find(s => s.id === simulatedScenario)?.transcript}"
              </p>

              {simulationStep >= 1 && (
                <p className="text-amber-400 animate-fade-in">
                  &gt; [NEURAL ENTITY EXTRACTION] : Parsing speech tokens... Mapping time horizons...
                </p>
              )}

              {simulationStep >= 2 && (
                <p className="text-emerald-400 animate-fade-in">
                  &gt; [META STRUCTURED OBJECT] : Extracted Title: "{scenarios.find(s => s.id === simulatedScenario)?.extracted.title}" | Category: {scenarios.find(s => s.id === simulatedScenario)?.extracted.category} | Priority: {scenarios.find(s => s.id === simulatedScenario)?.extracted.priority}
                </p>
              )}

              {simulationStep >= 3 && simulatedTask && (
                <div className="bg-neutral-900 border border-neutral-800 p-4 rounded-xl mt-3 space-y-3 font-sans text-xs text-neutral-300 animate-fade-in">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[9px] font-bold text-indigo-400 uppercase tracking-widest">Auto-Constructed Workspace Item</span>
                      <h4 className="font-bold text-white text-sm mt-0.5">{simulatedTask.title}</h4>
                    </div>
                    <span className="px-2 py-0.5 bg-indigo-950 text-indigo-400 border border-indigo-800 text-[9px] font-bold rounded uppercase">
                      {simulatedTask.category}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[10px] bg-neutral-950 p-2.5 rounded-lg border border-neutral-800/50">
                    <p><span className="text-neutral-500 uppercase font-semibold">Priority:</span> <span className="text-white font-medium">{simulatedTask.priority}</span></p>
                    <p><span className="text-neutral-500 uppercase font-semibold">Deadline:</span> <span className="text-white font-medium">{simulatedTask.deadline}</span></p>
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wide">Suggested Checklist Milestones:</span>
                    <ul className="space-y-1">
                      {simulatedTask.planSteps.map((step: string, i: number) => (
                        <li key={i} className="flex items-center gap-2 text-neutral-300 text-[11px]">
                          <CheckSquare className="w-3.5 h-3.5 text-indigo-400" />
                          <span>{step}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={() => {
                        alert("Great job! This is a mock interactive simulator. Try creating a real custom task via the Today Focus dashboard!");
                      }}
                      className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-[10px] font-bold transition-all cursor-pointer"
                    >
                      Interactive Test OK
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Cheat Sheet of AI Prompts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="bg-white border border-gray-200 rounded-2xl p-5 space-y-3.5 shadow-xs">
          <div className="flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-amber-500" />
            <h4 className="font-bold text-gray-900 text-xs uppercase tracking-wider">Example Study Prompts</h4>
          </div>
          <div className="space-y-2 text-xs font-mono text-gray-600">
            <p className="bg-gray-50 p-2.5 rounded-xl border border-gray-150">
              "Create revision plan for tomorrow's Math test"
            </p>
            <p className="bg-gray-50 p-2.5 rounded-xl border border-gray-150">
              "Need to submit college lab report by Friday"
            </p>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-5 space-y-3.5 shadow-xs">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-blue-500" />
            <h4 className="font-bold text-gray-900 text-xs uppercase tracking-wider">Workplace Prompts</h4>
          </div>
          <div className="space-y-2 text-xs font-mono text-gray-600">
            <p className="bg-gray-50 p-2.5 rounded-xl border border-gray-150">
              "Draft slide deck for client sync next Tuesday"
            </p>
            <p className="bg-gray-50 p-2.5 rounded-xl border border-gray-150">
              "Review code documentation changes by tonight"
            </p>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-5 space-y-3.5 shadow-xs">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-emerald-500" />
            <h4 className="font-bold text-gray-900 text-xs uppercase tracking-wider">Personal & Financial</h4>
          </div>
          <div className="space-y-2 text-xs font-mono text-gray-600">
            <p className="bg-gray-50 p-2.5 rounded-xl border border-gray-150">
              "Schedule annual physical doctor checkup July 4th"
            </p>
            <p className="bg-gray-50 p-2.5 rounded-xl border border-gray-150">
              "Pay broadband utility invoice within 3 days"
            </p>
          </div>
        </div>

      </div>

    </div>
  );
}
