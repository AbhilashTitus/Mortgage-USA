"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { cn } from "@/lib/utils";
import {
  PlayCircle,
  FileText,
  LayoutDashboard,
  BarChart3,
  TrendingUp,
  Search,
  ChevronRight,
  X,
  Menu,
  LogIn,
  UserCircle,
  ChevronDown
} from "lucide-react";
import { AppStep, CompactLivePreview } from "./AppSidebar";
import { DashboardTab } from "@/app/page";
import Link from "next/link";
import Image from "next/image";

interface MobileNavProps {
  currentStep: AppStep;
  onStepChange: (step: AppStep) => void;
  dashboardTab: DashboardTab;
  onDashboardTabChange: (tab: DashboardTab) => void;
}

const dashboardSubTabs = [
  { id: "overview" as const, label: "Overview", icon: BarChart3 },
  { id: "scenarios" as const, label: "Explore Scenarios", icon: TrendingUp },
  { id: "deep-dive" as const, label: "Deep Dive", icon: Search },
];

export function MobileNav({
  currentStep,
  onStepChange,
  dashboardTab,
  onDashboardTabChange,
}: MobileNavProps) {
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>(
    currentStep === "dashboard" ? "dashboard" : null
  );

  const [isTopNavVisible, setIsTopNavVisible] = useState(true);
  const [isBottomNavMinimized, setIsBottomNavMinimized] = useState(false);
  const [isUserInfoOpen, setIsUserInfoOpen] = useState(false);
  const [isUserInfoClosing, setIsUserInfoClosing] = useState(false);
  const [isDashboardMenuOpen, setIsDashboardMenuOpen] = useState(false);
  
  const lastScrollY = useRef(0);

  // Auto-hide Top Nav on scroll
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY.current && currentScrollY > 60) {
        setIsTopNavVisible(false);
      } else {
        setIsTopNavVisible(true);
      }
      lastScrollY.current = currentScrollY;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when overlay is open
  useEffect(() => {
    if (isOverlayOpen || isUserInfoOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOverlayOpen, isUserInfoOpen]);

  const closeOverlay = useCallback(() => {
    setIsClosing(true);
    setTimeout(() => {
      setIsOverlayOpen(false);
      setIsClosing(false);
    }, 280);
  }, []);

  const closeUserInfo = useCallback(() => {
    setIsUserInfoClosing(true);
    setTimeout(() => {
      setIsUserInfoOpen(false);
      setIsUserInfoClosing(false);
    }, 280);
  }, []);

  const handleStepClick = (step: AppStep) => {
    onStepChange(step);
    window.scrollTo({ top: 0, behavior: "smooth" });
    closeOverlay();
  };

  const handleTabBarClick = (step: AppStep) => {
    if (step === "dashboard") {
      if (currentStep === "dashboard") {
        setIsDashboardMenuOpen(prev => !prev);
      } else {
        onStepChange(step);
        setIsDashboardMenuOpen(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } else {
      onStepChange(step);
      setIsDashboardMenuOpen(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSubTabClick = (tab: DashboardTab) => {
    onDashboardTabChange(tab);
    onStepChange("dashboard");
    window.scrollTo({ top: 0, behavior: "smooth" });
    closeOverlay();
  };

  return (
    <>
      {/* ── Top Nav Pill (Mobile) ── */}
      <div 
        className={cn(
          "fixed top-4 left-4 right-4 z-50 lg:hidden transition-transform duration-300 ease-in-out",
          isTopNavVisible ? "translate-y-0" : "-translate-y-[150%]"
        )}
      >
        <div className="bg-white/95 backdrop-blur-md shadow-lg border border-slate-200/60 rounded-full flex items-center justify-between px-4 h-14">
          <Link href="/" className="flex items-center" onClick={() => handleTabBarClick("start")}>
            <Image 
              src="/Logo.png" 
              alt="The Mortgage Calculator App" 
              width={200} 
              height={40} 
              className="max-h-8 w-auto object-contain"
            />
          </Link>
          <button
            onClick={() => setIsOverlayOpen(true)}
            className="flex items-center justify-center p-2 -mr-2 text-slate-600 hover:text-[#003087] transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* ── Restore Bottom Nav Button ── */}
      {isBottomNavMinimized && (
        <button 
          onClick={() => setIsBottomNavMinimized(false)}
          className="fixed bottom-6 right-4 z-50 lg:hidden bg-white/95 backdrop-blur-md shadow-xl border border-slate-200/60 rounded-full p-3 text-[#003087] animate-in fade-in zoom-in-50 duration-300"
        >
           <Menu className="w-6 h-6" />
        </button>
      )}

      {/* Invisible Backdrop to close Dashboard Menu */}
      {isDashboardMenuOpen && currentStep === "dashboard" && (
        <div 
          className="fixed inset-0 z-40 lg:hidden" 
          onClick={() => setIsDashboardMenuOpen(false)} 
        />
      )}

      {/* ── Bottom Nav Pill (Mobile) ── */}
      <nav 
        className={cn(
          "fixed bottom-6 left-1/2 -translate-x-1/2 z-50 lg:hidden transition-all duration-500 ease-out",
          isBottomNavMinimized ? "translate-y-32 opacity-0 pointer-events-none" : "translate-y-0 opacity-100"
        )}
      >
        {/* Dashboard Sub-Menu Popover */}
        <div className={cn(
          "absolute bottom-[calc(100%+16px)] left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-xl border border-slate-200/60 shadow-2xl rounded-2xl p-2 flex flex-col gap-1 transition-all duration-300 origin-bottom",
          isDashboardMenuOpen && currentStep === "dashboard" ? "scale-100 opacity-100" : "scale-95 opacity-0 pointer-events-none"
        )}>
          {dashboardSubTabs.map((tab) => {
            const TabIcon = tab.icon;
            const isActive = dashboardTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  onDashboardTabChange(tab.id);
                  setIsDashboardMenuOpen(false);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors min-w-[180px]",
                  isActive 
                    ? "bg-[#003087]/10 text-[#003087]" 
                    : "text-slate-600 hover:bg-slate-100"
                )}
              >
                <TabIcon className={cn("w-5 h-5 shrink-0", isActive ? "text-[#003087]" : "text-slate-400")} />
                {tab.label}
                {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[#003087]" />}
              </button>
            );
          })}
          {/* Triangle pointer */}
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-b border-r border-slate-200/60 rotate-45 shadow-sm"></div>
        </div>

        {/* Glassmorphism floating pill */}
        <div className="bg-white/95 backdrop-blur-xl border border-slate-200/60 shadow-xl rounded-full px-2 py-1.5 flex items-center gap-1 relative">
          
          {/* Quick Info Tab */}
          <button
            onClick={() => setIsUserInfoOpen(true)}
            className="flex flex-col items-center justify-center gap-0.5 px-4 py-2 rounded-full transition-all duration-300 min-w-[72px] text-slate-400 hover:text-slate-600"
          >
            <UserCircle className="w-5 h-5 transition-all duration-300" />
            <span className="text-[10px] font-semibold mt-0.5">Key Info</span>
          </button>

          {/* Your Info Tab */}
          <button
            onClick={() => handleTabBarClick("info")}
            className={cn(
              "flex flex-col items-center justify-center gap-0.5 px-4 py-2 rounded-full transition-all duration-300 min-w-[72px]",
              currentStep === "info"
                ? "bg-[#003087]/5 text-[#003087]"
                : "text-slate-400 hover:text-slate-600"
            )}
          >
            <div className="relative">
              <FileText
                className={cn(
                  "w-5 h-5 transition-all duration-300",
                  currentStep === "info" && "scale-110"
                )}
              />
              {currentStep === "info" && (
                <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#003087]" />
              )}
            </div>
            <span className="text-[10px] font-semibold mt-0.5">Edit Info</span>
          </button>

          {/* Dashboard Tab */}
          <button
            onClick={() => handleTabBarClick("dashboard")}
            className={cn(
              "flex flex-col items-center justify-center gap-0.5 px-4 py-2 rounded-full transition-all duration-300 min-w-[72px]",
              currentStep === "dashboard"
                ? "bg-[#003087]/5 text-[#003087]"
                : "text-slate-400 hover:text-slate-600"
            )}
          >
            <div className="relative">
              <LayoutDashboard
                className={cn(
                  "w-5 h-5 transition-all duration-300",
                  currentStep === "dashboard" && "scale-110"
                )}
              />
              {currentStep === "dashboard" && !isDashboardMenuOpen && (
                <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-red-500 border-2 border-white animate-pulse shadow-sm" />
              )}
              {currentStep === "dashboard" && (
                <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#003087]" />
              )}
            </div>
            <span className="text-[10px] font-semibold mt-0.5">Dashboard</span>
          </button>

          {/* Minimize Divider */}
          <div className="w-[1px] h-8 bg-slate-200 mx-1"></div>

          {/* Minimize Button */}
          <button
            onClick={() => setIsBottomNavMinimized(true)}
            className="flex items-center justify-center p-2 rounded-full text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors mr-1"
          >
            <ChevronDown className="w-5 h-5" />
          </button>
        </div>
      </nav>

      {/* ── Full-Screen Overlay ── */}
      {isOverlayOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden">
          {/* Backdrop */}
          <div
            className={cn(
              "absolute inset-0 bg-black/30 backdrop-blur-sm",
              isClosing ? "mobile-overlay-exit" : "mobile-overlay-enter"
            )}
            onClick={closeOverlay}
          />

          {/* Drawer */}
          <div
            className={cn(
              "absolute inset-0 bg-white flex flex-col",
              isClosing ? "mobile-drawer-exit" : "mobile-drawer-enter"
            )}
          >
            {/* Overlay Header */}
            <div className="flex items-center justify-between px-6 h-16 border-b border-slate-100">
              <span className="text-lg font-bold text-[#003087] tracking-tight">
                Navigation
              </span>
              <button
                onClick={closeOverlay}
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors text-slate-500"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Nav Items */}
            <div className="flex-1 overflow-y-auto px-4 py-4">
              {/* 1. Start Here */}
              <button
                onClick={() => handleStepClick("start")}
                className={cn(
                  "w-full flex items-center justify-between px-4 py-4 rounded-xl transition-colors",
                  currentStep === "start"
                    ? "bg-[#003087]/5 text-[#003087] font-bold"
                    : "text-slate-700 hover:bg-slate-50"
                )}
              >
                <div className="flex items-center gap-3">
                  <PlayCircle
                    className={cn(
                      "w-5 h-5",
                      currentStep === "start"
                        ? "text-[#003087]"
                        : "text-slate-400"
                    )}
                  />
                  <span className="text-[15px] font-semibold">
                    1. Start Here
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-300" />
              </button>
              <div className="mx-4 border-b border-slate-100" />

              {/* 2. Your Info */}
              <button
                onClick={() => handleStepClick("info")}
                className={cn(
                  "w-full flex items-center justify-between px-4 py-4 rounded-xl transition-colors",
                  currentStep === "info"
                    ? "bg-[#003087]/5 text-[#003087] font-bold"
                    : "text-slate-700 hover:bg-slate-50"
                )}
              >
                <div className="flex items-center gap-3">
                  <FileText
                    className={cn(
                      "w-5 h-5",
                      currentStep === "info"
                        ? "text-[#003087]"
                        : "text-slate-400"
                    )}
                  />
                  <span className="text-[15px] font-semibold">
                    2. Your Info
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-300" />
              </button>
              <div className="mx-4 border-b border-slate-100" />

              {/* 3. Dashboard (with expandable sub-tabs) */}
              <button
                onClick={() => {
                  if (currentStep === "dashboard") {
                    setExpandedSection(
                      expandedSection === "dashboard" ? null : "dashboard"
                    );
                  } else {
                    handleStepClick("dashboard");
                    setExpandedSection("dashboard");
                  }
                }}
                className={cn(
                  "w-full flex items-center justify-between px-4 py-4 rounded-xl transition-colors",
                  currentStep === "dashboard"
                    ? "bg-[#003087]/5 text-[#003087] font-bold"
                    : "text-slate-700 hover:bg-slate-50"
                )}
              >
                <div className="flex items-center gap-3">
                  <LayoutDashboard
                    className={cn(
                      "w-5 h-5",
                      currentStep === "dashboard"
                        ? "text-[#003087]"
                        : "text-slate-400"
                    )}
                  />
                  <span className="text-[15px] font-semibold">
                    3. Affordability Dashboard
                  </span>
                </div>
                <ChevronRight
                  className={cn(
                    "w-4 h-4 text-slate-300 transition-transform duration-300",
                    expandedSection === "dashboard" && "rotate-90"
                  )}
                />
              </button>

              {/* Dashboard Sub-Tabs */}
              {expandedSection === "dashboard" && (
                <div className="ml-8 mr-2 border-l-2 border-[#003087]/15 pl-4 py-2 space-y-1">
                  {dashboardSubTabs.map((tab) => {
                    const TabIcon = tab.icon;
                    const isActive =
                      currentStep === "dashboard" && dashboardTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => handleSubTabClick(tab.id)}
                        className={cn(
                          "w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-colors",
                          isActive
                            ? "bg-[#003087]/5 text-[#003087] font-semibold"
                            : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
                        )}
                      >
                        <TabIcon
                          className={cn(
                            "w-4 h-4",
                            isActive ? "text-[#003087]" : "text-slate-400"
                          )}
                        />
                        <span className="text-sm">{tab.label}</span>
                      </button>
                    );
                  })}
                </div>
              )}
              <div className="mx-4 border-b border-slate-100" />
            </div>

            {/* Login CTA at bottom */}
            <div className="p-6 border-t border-slate-100">
              <Link
                href="/login"
                onClick={closeOverlay}
                className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-bold text-[15px] text-white bg-gradient-to-b from-[#005a9e] to-[#003087] shadow-lg shadow-[#003087]/20 transition-all active:scale-[0.98]"
              >
                <LogIn className="w-4 h-4" />
                Login
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* ── Key Info Overlay Drawer ── */}
      {isUserInfoOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden">
          <div
            className={cn(
              "absolute inset-0 bg-black/30 backdrop-blur-sm",
              isUserInfoClosing ? "mobile-overlay-exit" : "mobile-overlay-enter"
            )}
            onClick={closeUserInfo}
          />
          <div
            className={cn(
              "absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl flex flex-col max-h-[85vh]",
              isUserInfoClosing ? "slideDown" : "slideUp"
            )}
            style={{ animationDuration: '0.3s' }}
          >
            <div className="flex items-center justify-between px-6 h-16 border-b border-slate-100">
              <span className="text-lg font-bold text-[#003087] tracking-tight">
                Your Key Info
              </span>
              <button
                onClick={closeUserInfo}
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors text-slate-500"
              >
                <ChevronDown className="w-6 h-6" />
              </button>
            </div>
            <div className="overflow-y-auto p-6">
              <CompactLivePreview />
              <button 
                onClick={() => {
                  handleTabBarClick("info");
                  closeUserInfo();
                }}
                className="w-full mt-6 py-3 rounded-xl bg-slate-100 text-[#003087] font-bold text-sm hover:bg-slate-200 transition-colors"
              >
                Go to Full Edit Form
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
