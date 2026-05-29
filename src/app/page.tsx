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

  return (
    <div className="h-full flex overflow-hidden bg-slate-50">
      {/* Retractable Sidebar Navigation */}
      <AppSidebar 
        currentStep={currentStep} 
        onStepChange={setCurrentStep} 
        dashboardTab={dashboardTab}
        onDashboardTabChange={setDashboardTab}
      />

      {/* Main Content Area */}
      <main className="flex-1 h-full overflow-y-auto styled-scrollbar">
        <ClientOnly fallback={
          <div className="flex h-full items-center justify-center">
            <div className="w-10 h-10 rounded-full border-4 border-primary border-t-transparent animate-spin" />
          </div>
        }>
          <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto h-full min-h-full">
            {currentStep === "start" && <StartHere />}
            
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
