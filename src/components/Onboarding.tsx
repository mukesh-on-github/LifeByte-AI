import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Check, Sparkles, MessageSquare, Mic, FileText, Settings, Heart, Laptop, BookOpen, Wallet, Users, Plane, ShieldCheck, ArrowRight } from "lucide-react";

interface OnboardingProps {
  displayName: string;
  onComplete: (prefs: {
    creationPref: "chat" | "voice" | "manual" | "upload";
    areas: string[];
    notifications: string[];
  }) => void;
}

export default function Onboarding({ displayName, onComplete }: OnboardingProps) {
  const [step, setStep] = useState(1);
  const [creationPref, setCreationPref] = useState<"chat" | "voice" | "manual" | "upload" | "">("");
  const [selectedAreas, setSelectedAreas] = useState<string[]>([]);
  const [notifications, setNotifications] = useState<string[]>([]);

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      onComplete({
        creationPref: creationPref || "chat",
        areas: selectedAreas,
        notifications: notifications,
      });
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const toggleArea = (area: string) => {
    setSelectedAreas((prev) =>
      prev.includes(area) ? prev.filter((a) => a !== area) : [...prev, area]
    );
  };

  const toggleNotification = (pref: string) => {
    setNotifications((prev) =>
      prev.includes(pref) ? prev.filter((p) => p !== pref) : [...prev, pref]
    );
  };

  // Onboarding Screen Renderers
  return (
    <div className="fixed inset-0 bg-gray-50/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 max-w-xl w-full p-8 md:p-12 overflow-hidden relative min-h-[500px] flex flex-col justify-between">
        
        {/* Progress bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gray-100">
          <motion.div 
            className="h-full bg-blue-600"
            initial={{ width: "25%" }}
            animate={{ width: `${(step / 4) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex-1 flex flex-col justify-center text-center space-y-6"
            >
              <div className="mx-auto w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center border border-blue-100">
                <Sparkles className="w-8 h-8 text-blue-600" />
              </div>
              <div className="space-y-3">
                <h1 className="text-3xl font-semibold tracking-tight text-gray-900">
                  Welcome to LifeByte, {displayName.split(" ")[0]}
                </h1>
                <p className="text-gray-500 max-w-sm mx-auto text-sm leading-relaxed">
                  Your intelligent personal life management companion. LifeByte helps you organize responsibilities through natural actions, voice, and planning.
                </p>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-2xl font-semibold tracking-tight text-gray-900">
                  Preferred Creation Method
                </h2>
                <p className="text-gray-500 text-sm mt-1">
                  How do you prefer to capture your tasks and thoughts? (Select one)
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {[
                   { id: "chat", title: "AI Chat", desc: "Natural chat flow", icon: MessageSquare },
                   { id: "voice", title: "Voice Input", desc: "Speak naturally", icon: Mic },
                   { id: "manual", title: "Manual Form", desc: "Traditional inputs", icon: Settings },
                   { id: "upload", title: "File Upload", desc: "Upload screenshots/docs", icon: FileText },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setCreationPref(item.id as any)}
                      className={`flex flex-col items-start p-4 rounded-2xl text-left border transition-all ${
                        creationPref === item.id
                          ? "border-blue-600 bg-blue-50/50 ring-2 ring-blue-600/10"
                          : "border-gray-150 hover:border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      <Icon className="w-5 h-5 text-blue-600 mb-2" />
                      <span className="font-medium text-sm text-gray-950">{item.title}</span>
                      <span className="text-xs text-gray-500 mt-1">{item.desc}</span>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-2xl font-semibold tracking-tight text-gray-900">
                  Areas Important to You
                </h2>
                <p className="text-gray-500 text-sm mt-1">
                  Select the life domains you want to manage with LifeByte.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 max-h-[220px] overflow-y-auto pr-1">
                {[
                  { name: "Work", icon: Laptop },
                  { name: "Personal", icon: Heart },
                  { name: "Health", icon: ShieldCheck },
                  { name: "Study", icon: BookOpen },
                  { name: "Finance", icon: Wallet },
                  { name: "Family", icon: Users },
                  { name: "Travel", icon: Plane },
                ].map((area) => {
                  const Icon = area.icon;
                  const isSelected = selectedAreas.includes(area.name);
                  return (
                    <button
                      key={area.name}
                      onClick={() => toggleArea(area.name)}
                      className={`flex items-center gap-3 p-3.5 rounded-xl border text-left transition-all ${
                        isSelected
                          ? "border-blue-600 bg-blue-50/50"
                          : "border-gray-100 hover:border-gray-300 bg-white"
                      }`}
                    >
                      <div className={`p-1.5 rounded-lg ${isSelected ? "bg-blue-600 text-white" : "bg-gray-50 text-gray-600"}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-medium text-gray-900 flex-1">{area.name}</span>
                      {isSelected && <Check className="w-4 h-4 text-blue-600" />}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-2xl font-semibold tracking-tight text-gray-900">
                  Notification Preferences
                </h2>
                <p className="text-gray-500 text-sm mt-1">
                  Choose how you want LifeByte to check in with you.
                </p>
              </div>

              <div className="space-y-3">
                {[
                  "Deadline Alerts",
                  "Task Completion Checks",
                  "Important Reminders",
                ].map((pref) => {
                  const isSelected = notifications.includes(pref);
                  return (
                    <button
                      key={pref}
                      onClick={() => toggleNotification(pref)}
                      className={`w-full flex items-center justify-between p-4 rounded-xl border text-left transition-all ${
                        isSelected
                          ? "border-blue-600 bg-blue-50/50"
                          : "border-gray-100 hover:border-gray-300 bg-white"
                      }`}
                    >
                      <span className="text-sm font-medium text-gray-900">{pref}</span>
                      <div className={`w-5 h-5 rounded flex items-center justify-center border transition-all ${
                        isSelected ? "bg-blue-600 border-blue-600 text-white" : "border-gray-300"
                      }`}>
                        {isSelected && <Check className="w-3.5 h-3.5" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer controls */}
        <div className="flex items-center justify-between mt-8 pt-4 border-t border-gray-100">
          <button
            onClick={handleBack}
            className={`text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors ${
              step === 1 ? "opacity-0 pointer-events-none" : ""
            }`}
          >
            Back
          </button>
          
          <button
            onClick={handleNext}
            disabled={step === 2 && !creationPref}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600 text-white py-2 px-5 rounded-full text-sm font-medium transition-colors cursor-pointer"
          >
            {step === 4 ? "Complete Setup" : "Continue"}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
}
