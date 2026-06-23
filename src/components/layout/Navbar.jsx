"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { LogOut, Bell, UserCog, ChevronDown, ShieldCheck, GraduationCap, PanelLeftClose, PanelLeftOpen, Menu, Users } from "lucide-react";

export function Navbar({ userName, role, sidebarCollapsed, onToggleSidebar, onToggleMobileSidebar }) {
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    localStorage.removeItem("userName");
    router.push("/login");
  };

  const initials = userName
    ? userName.split(" ").map(n => n[0]).join("").substring(0, 2)
    : "U";

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const profilePath = "/dashboard/profile";
  
  const getRoleLabel = (r) => {
    if (r === "admin") return "Administrator";
    if (r === "parent") return "Orang Tua Murid";
    return "Guru";
  };

  const RoleIcon = role === "admin" ? ShieldCheck : role === "parent" ? Users : GraduationCap;

  return (
    <nav className="fixed top-0 z-30 w-full glass-strong border-b border-white/40 shadow-b shadow-lg">
      <div className={`px-4 py-2.5 lg:px-6 transition-all duration-300 ${sidebarCollapsed ? "sm:pl-[5.5rem]" : "sm:pl-[17rem]"}`}>
        <div className="flex items-center justify-between">
          {/* Left Side */}
          <div className="flex items-center gap-2.5">
            {/* Mobile hamburger */}
            <button
              onClick={onToggleMobileSidebar}
              className="sm:hidden p-2 rounded-xl text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Desktop collapse toggle */}
            <button
              onClick={onToggleSidebar}
              className="hidden sm:flex p-2 rounded-xl text-slate-500 hover:bg-indigo-50 hover:text-indigo-600 transition-colors duration-200"
              title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {sidebarCollapsed ? <PanelLeftOpen className="w-5 h-5" /> : <PanelLeftClose className="w-5 h-5" />}
            </button>

            {/* Role Title */}
            <div className="hidden sm:flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center shadow-sm shadow-indigo-500/20">
                <RoleIcon className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800 leading-none">
                  {getRoleLabel(role)}
                  <span className="ml-1.5 inline-flex items-center px-1.5 py-0.5 rounded-md bg-emerald-50 text-[10px] font-bold text-emerald-600 ring-1 ring-inset ring-emerald-500/10">
                    Aktif
                  </span>
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">Sistem Manajemen TK</p>
              </div>
            </div>

            {/* Mobile title */}
            <span className="sm:hidden text-lg font-bold gradient-text">TK Pintar</span>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button className="relative p-2 rounded-xl text-slate-500 hover:bg-indigo-50 hover:text-indigo-600 transition-colors duration-200">
              <Bell className="w-[18px] h-[18px]" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
            </button>

            <div className="h-6 w-px bg-slate-200 hidden sm:block" />

            {/* User Profile Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-slate-50/80 transition-colors duration-200 cursor-pointer"
              >
                <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center text-white text-xs font-bold shadow-md shadow-indigo-500/20">
                  {initials}
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-semibold text-slate-800 leading-none">{userName}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">{getRoleLabel(role)}</p>
                </div>
                <ChevronDown className={`w-4 h-4 text-slate-400 hidden md:block transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`} />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-lg shadow-slate-200/50 border border-slate-100 py-1.5 z-50">
                  <div className="px-3 py-2 border-b border-slate-100 mb-1">
                    <p className="text-sm font-semibold text-slate-800">{userName}</p>
                    <p className="text-xs text-slate-400">{getRoleLabel(role)}</p>
                  </div>
                  <button
                    onClick={() => { setDropdownOpen(false); router.push(profilePath); }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 transition-colors cursor-pointer"
                  >
                    <UserCog className="w-4 h-4" />
                    Edit Profil
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-slate-600 hover:bg-rose-50 hover:text-rose-600 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
