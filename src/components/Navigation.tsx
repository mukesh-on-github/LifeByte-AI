import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, CheckSquare, MessageSquare, Target, Calendar, User, Users, Compass, LogOut, HelpCircle } from "lucide-react";
import { logoutUser } from "../firebase";

const logoImage = "/src/assets/images/lifebyte_ai_logo_1782835328297.jpg";

export function AppLogo({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <div className={`relative flex-shrink-0 ${className}`}>
      <img
        src={logoImage}
        alt="LifeByte AI Logo"
        className="w-full h-full object-cover rounded-lg shadow-xs"
        referrerPolicy="no-referrer"
      />
    </div>
  );
}

interface NavigationProps {
  userEmail: string;
}

export function Sidebar({ userEmail }: NavigationProps) {
  const location = useLocation();
  const currentPath = location.pathname;

  const links = [
    { name: "Home", path: "/", icon: Home },
    { name: "Tasks", path: "/tasks", icon: CheckSquare },
    { name: "AI Companion", path: "/ai", icon: Compass },
    { name: "Goals", path: "/goals", icon: Target },
    { name: "Calendar", path: "/calendar", icon: Calendar },
    { name: "Profile", path: "/profile", icon: User },
    { name: "Tutorial", path: "/tutorial", icon: HelpCircle },
  ];

  return (
    <aside id="desktop-sidebar" className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200 min-h-screen p-6 justify-between select-none fixed left-0 top-0">
      <div className="space-y-8">
        {/* Brand */}
        <div className="flex items-center gap-3 px-2">
          <AppLogo className="w-8 h-8" />
          <span className="font-semibold text-xl tracking-tight text-gray-900 font-sans">LifeByte-AI</span>
        </div>

        {/* Links */}
        <nav className="space-y-1">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = currentPath === link.path;
            return (
              <Link
                key={link.name}
                to={link.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? "text-blue-700" : "text-gray-500"}`} />
                <span>{link.name}</span>
              </Link>
            );
          })}

          {/* Collaborative Link (Coming Soon) */}
          <div className="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium text-gray-400 cursor-not-allowed select-none bg-gray-55 border border-dashed border-gray-100">
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-gray-300" />
              <span>Collaborative</span>
            </div>
            <span className="text-[10px] font-bold bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded uppercase tracking-wider">
              Soon
            </span>
          </div>
        </nav>
      </div>

      {/* User Footer */}
      <div className="space-y-4">
        <div className="flex items-center gap-3 px-2 border-t border-gray-100 pt-4">
          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-800 text-xs font-bold">
            {userEmail ? userEmail.slice(0, 2).toUpperCase() : "U"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-gray-900 truncate">{userEmail.split('@')[0]}</p>
            <p className="text-[11px] text-gray-500 truncate">{userEmail}</p>
          </div>
        </div>
        <button
          onClick={logoutUser}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}

export function MobileNav() {
  const location = useLocation();
  const currentPath = location.pathname;

  const links = [
    { name: "Home", path: "/", icon: Home },
    { name: "Tasks", path: "/tasks", icon: CheckSquare },
    { name: "AI", path: "/ai", icon: Compass },
    { name: "Calendar", path: "/calendar", icon: Calendar },
    { name: "Profile", path: "/profile", icon: User },
    { name: "Tutorial", path: "/tutorial", icon: HelpCircle },
  ];

  return (
    <nav id="mobile-nav" className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-200 z-40 flex items-center justify-around py-3 px-2">
      {links.map((link) => {
        const Icon = link.icon;
        const isActive = currentPath === link.path;
        return (
          <Link
            key={link.name}
            to={link.path}
            className={`flex flex-col items-center gap-1 text-[10px] font-medium transition-colors ${
              isActive ? "text-blue-600" : "text-gray-500 hover:text-gray-900"
            }`}
          >
            <Icon className={`w-5 h-5 ${isActive ? "stroke-2 text-blue-600" : "text-gray-400"}`} />
            <span>{link.name}</span>
          </Link>
        );
      })}
    </nav>
  );
}
