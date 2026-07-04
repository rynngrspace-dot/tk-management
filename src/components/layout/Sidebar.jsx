"use client";
import Link from "next/link";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  ChevronDown,
  LogOut,
  X,
} from "lucide-react";
import { adminNav, teacherNav, parentNav } from "@/lib/navigation";

function SidebarGroup({ label, icon: Icon, children, pathname, collapsed }) {
  const isChildActive = children.some(
    (child) => pathname === child.href || pathname.startsWith(child.href + "/")
  );
  const [open, setOpen] = useState(isChildActive);

  // In collapsed mode, show as a flyout-style section marker
  if (collapsed) {
    return (
      <li className="group relative">
        <div className="flex items-center justify-center py-2">
          <div className={`p-2 rounded-md transition-colors ${isChildActive ? "bg-white/20" : "hover:bg-white/10"}`}>
            <Icon className="w-[18px] h-[18px] text-indigo-100" />
          </div>
        </div>
        {/* Tooltip flyout */}
        <div className="hidden group-hover:block absolute left-full top-0 ml-2 w-48 bg-white rounded-md shadow-lg border border-slate-100 py-2 z-50">
          <p className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">{label}</p>
          {children.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-2 px-3 py-2 text-sm transition-colors ${
                  isActive
                    ? "text-indigo-600 bg-indigo-50 font-semibold"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-800"
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.name}
              </Link>
            );
          })}
        </div>
      </li>
    );
  }

  return (
    <li>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-all duration-200 text-indigo-100 hover:bg-white/10 hover:text-white cursor-pointer"
      >
        <Icon className="w-[18px] h-[18px]" />
        <span className="flex-1 text-left">{label}</span>
        <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
      </button>
      <ul className={`overflow-hidden transition-all duration-300 ease-in-out ${open ? "max-h-[500px] opacity-100 mt-1 space-y-1" : "max-h-0 opacity-0"}`}>
        {children.map((item) => {
          const isActive = pathname === item.href;
          return (
            <li key={item.name}>
              <Link
                href={item.href}
                className={`flex items-center gap-3 ml-8 px-3 py-2 rounded-md text-[13px] font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-white text-indigo-700 shadow-lg shadow-indigo-900/20"
                    : "text-indigo-200/80 hover:bg-white/10 hover:text-white"
                }`}
              >
                <item.icon className={`w-4 h-4 ${isActive ? "text-indigo-600" : ""}`} />
                <span>{item.name}</span>
                {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-500" />}
              </Link>
            </li>
          );
        })}
      </ul>
    </li>
  );
}

export function Sidebar({ role, collapsed, mobileOpen, onCloseMobile }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    localStorage.removeItem("userName");
    router.push("/login");
  };

  const navItems = role === "admin" ? adminNav : role === "parent" ? parentNav : teacherNav;

  const sidebarContent = (isMobile = false) => (
    <>
      {/* Logo Section */}
      <div className={`border-b border-white/10 ${collapsed && !isMobile ? "px-3 py-6" : "px-5 py-6"}`}>
        <div className={`flex items-center ${collapsed && !isMobile ? "justify-center" : "gap-3"}`}>
          <div className={`${collapsed && !isMobile ? "w-10 h-10" : "w-14 h-14"} flex items-center justify-center flex-shrink-0 overflow-hidden`}>
            <img src="/assets/images/tklogo.png" alt="Logo" className="w-full h-full object-contain" />
          </div>
          {(!collapsed || isMobile) && (
            <div className="min-w-0">
              <h1 className="text-lg font-bold text-white tracking-tight">TK Al-Islah</h1>
              <p className="text-[11px] text-indigo-200 font-medium">Sistem Manajemen TK</p>
            </div>
          )}
          {/* Mobile close button */}
          {isMobile && (
            <button onClick={onCloseMobile} className="ml-auto p-1.5 rounded-lg hover:bg-white/10 text-white/80 hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        {(!collapsed || isMobile) && (
          <p className="px-3 mb-3 text-[10px] font-bold uppercase tracking-[0.15em] text-indigo-200/60">
            Menu Utama
          </p>
        )}
        <ul className="space-y-1">
          {navItems.map((item) => {
            if (item.type === "group") {
              return (
                <SidebarGroup
                  key={item.label}
                  label={item.label}
                  icon={item.icon}
                  children={item.children}
                  pathname={pathname}
                  collapsed={collapsed && !isMobile}
                />
              );
            }
            const isActive = pathname === item.href;

            if (collapsed && !isMobile) {
              return (
                <li key={item.name} className="group relative">
                  <Link
                    href={item.href}
                    className={`flex items-center justify-center p-2 rounded-md transition-all duration-200 ${
                      isActive
                        ? "bg-white text-indigo-700 shadow-lg shadow-indigo-900/20"
                        : "text-indigo-100 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <item.icon className={`w-[18px] h-[18px] ${isActive ? "text-indigo-600" : ""}`} />
                  </Link>
                  <div className="hidden group-hover:block absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2.5 py-1 bg-slate-800 text-white text-xs rounded-lg whitespace-nowrap z-50">
                    {item.name}
                  </div>
                </li>
              );
            }

            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-white text-indigo-700 shadow-lg shadow-indigo-900/20"
                      : "text-indigo-100 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <item.icon className={`w-[18px] h-[18px] ${isActive ? "text-indigo-600" : ""}`} />
                  <span>{item.name}</span>
                  {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-500" />}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Bottom: Role Badge + Logout */}
      <div className={`border-t border-white/10 space-y-2 ${collapsed && !isMobile ? "px-2 py-3" : "px-4 py-4"}`}>
        {collapsed && !isMobile ? (
          <>
            <div className="flex justify-center">
              <div className="w-9 h-9 rounded-lg bg-white/20 flex items-center justify-center text-white font-bold text-xs">
                {role === "admin" ? "A" : role === "parent" ? "O" : "G"}
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center p-2 rounded-md transition-all duration-200 text-indigo-100 hover:bg-rose-500/20 hover:text-rose-200 group relative"
            >
              <LogOut className="w-[18px] h-[18px]" />
              <div className="hidden group-hover:block absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2.5 py-1 bg-slate-800 text-white text-xs rounded-lg whitespace-nowrap z-50">
                Logout
              </div>
            </button>
          </>
        ) : (
          <>
            <div className="flex items-center gap-3 px-3 py-2.5 rounded-md bg-white/10 backdrop-blur-sm">
              <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center text-white font-bold text-xs">
                {role === "admin" ? "A" : role === "parent" ? "O" : "G"}
              </div>
              <div>
                <p className="text-xs font-semibold text-white capitalize">{role === "admin" ? "Administrator" : role === "parent" ? "Orang Tua" : "Guru"}</p>
                <p className="text-[10px] text-indigo-200">Aktif</p>
              </div>
              <div className="ml-auto w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-md text-sm font-medium transition-all duration-200 bg-white/10 text-indigo-100 hover:bg-rose-500/20 hover:text-rose-200"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </>
        )}
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-40 h-screen hidden sm:flex flex-col gradient-primary shadow-xl shadow-indigo-500/20 transition-all duration-300 ${
          collapsed ? "w-[4.5rem]" : "w-64"
        }`}
      >
        {sidebarContent(false)}
      </aside>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 sm:hidden" onClick={onCloseMobile}>
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
        </div>
      )}

      {/* Mobile Sidebar Drawer */}
      <aside
        className={`fixed left-0 top-0 z-50 h-screen w-64 flex flex-col gradient-primary shadow-xl shadow-indigo-500/20 transition-transform duration-300 sm:hidden ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {sidebarContent(true)}
      </aside>
    </>
  );
}
