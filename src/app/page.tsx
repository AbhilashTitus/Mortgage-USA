"use client";

import { YourInfoForm } from "@/components/forms/YourInfoForm";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { ClientOnly } from "@/components/ClientOnly";
import { AppSidebar, AppStep } from "@/components/layout/AppSidebar";
import { MobileNav } from "@/components/layout/MobileNav";
import { StartHere } from "@/components/dashboard/StartHere";
import { useState, useEffect } from "react";

export type DashboardTab = "overview" | "scenarios" | "deep-dive";

export default function Home() {
  const [currentStep, setCurrentStep] = useState<AppStep>("start");
  const [dashboardTab, setDashboardTab] = useState<DashboardTab>("overview");
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [sidebarGlow, setSidebarGlow] = useState(0);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 50); // Small delay ensures React has fully rendered the new tab content before scrolling
    return () => clearTimeout(timeoutId);
  }, [currentStep, dashboardTab]);

  return (
    <div className="flex flex-1">
      {/* Desktop Sidebar Navigation (hidden on mobile) */}
      <AppSidebar 
        currentStep={currentStep} 
        onStepChange={setCurrentStep} 
        dashboardTab={dashboardTab}
        onDashboardTabChange={setDashboardTab}
        isExpanded={isSidebarExpanded}
        onExpandedChange={setIsSidebarExpanded}
        glowIntensity={sidebarGlow}
      />

      {/* Mobile Bottom Tab Bar + Overlay (hidden on desktop) */}
      <MobileNav
        currentStep={currentStep}
        onStepChange={setCurrentStep}
        dashboardTab={dashboardTab}
        onDashboardTabChange={setDashboardTab}
      />

      {/* Main Content Area — scrolls with the body */}
      <main className="flex-1 min-w-0">
        <ClientOnly fallback={
          <div className="flex min-h-[60vh] items-center justify-center">
            <div className="w-10 h-10 rounded-full border-4 border-primary border-t-transparent animate-spin" />
          </div>
        }>
          <div className="px-3 pt-24 sm:px-4 sm:pt-24 md:px-6 md:pt-28 lg:p-8 lg:pt-8 max-w-6xl mx-auto pb-24 lg:pb-8">
            {currentStep === "start" && <StartHere onNext={() => setCurrentStep("info")} onProgressComplete={() => setIsSidebarExpanded(true)} onGlowChange={setSidebarGlow} />}
            
            {currentStep === "info" && (
              <div className="max-w-3xl mx-auto animate-in fade-in zoom-in-95 slide-in-from-bottom-8 duration-700 ease-out fill-mode-both">
                <YourInfoForm onNext={() => { setCurrentStep("dashboard"); setDashboardTab("overview"); }} />
              </div>
            )}
            
            {currentStep === "dashboard" && (
              <div className="animate-in fade-in zoom-in-95 slide-in-from-bottom-8 duration-700 ease-out fill-mode-both">
                <DashboardLayout 
                  activeTab={dashboardTab} 
                  onTabChange={setDashboardTab} 
                  onReturnToOverview={() => setDashboardTab("overview")}
                />
              </div>
            )}
          </div>
        </ClientOnly>
      </main>
    </div>
  );
}

