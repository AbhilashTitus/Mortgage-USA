"use client";

import { YourInfoForm } from "@/components/forms/YourInfoForm";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { ClientOnly } from "@/components/ClientOnly";
import { AppSidebar, AppStep } from "@/components/layout/AppSidebar";
import { StartHere } from "@/components/dashboard/StartHere";
import { useState } from "react";

export type DashboardTab = "overview" | "scenarios" | "deep-dive";

export default function Home() {
  const [currentStep, setCurrentStep] = useState<AppStep>("start");
  const [dashboardTab, setDashboardTab] = useState<DashboardTab>("overview");
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [sidebarGlow, setSidebarGlow] = useState(0);

  return (
    <div className="flex flex-1">
      {/* Sticky Sidebar Navigation */}
      <AppSidebar 
        currentStep={currentStep} 
        onStepChange={setCurrentStep} 
        dashboardTab={dashboardTab}
        onDashboardTabChange={setDashboardTab}
        isExpanded={isSidebarExpanded}
        onExpandedChange={setIsSidebarExpanded}
        glowIntensity={sidebarGlow}
      />

      {/* Main Content Area — scrolls with the body */}
      <main className="flex-1 min-w-0">
        <ClientOnly fallback={
          <div className="flex min-h-[60vh] items-center justify-center">
            <div className="w-10 h-10 rounded-full border-4 border-primary border-t-transparent animate-spin" />
          </div>
        }>
          <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">
            {currentStep === "start" && <StartHere onNext={() => setCurrentStep("info")} onProgressComplete={() => setIsSidebarExpanded(true)} onGlowChange={setSidebarGlow} />}
            
            {currentStep === "info" && (
              <div className="max-w-3xl mx-auto animate-in fade-in duration-500">
                <YourInfoForm />
              </div>
            )}
            
            {currentStep === "dashboard" && (
              <div className="animate-in fade-in duration-500">
                <DashboardLayout activeTab={dashboardTab} />
              </div>
            )}
          </div>
        </ClientOnly>
      </main>
    </div>
  );
}
