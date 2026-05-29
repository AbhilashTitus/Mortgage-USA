"use client";

import { cn } from "@/lib/utils";
import { ChevronRight, FileText, LayoutDashboard, PlayCircle, BarChart3, TrendingUp, Search, Calculator } from "lucide-react";
import { useState } from "react";
import { DashboardTab } from "@/app/page";
import { useAppStore } from "@/lib/store";
import { Slider } from "@/components/ui/slider";

export type AppStep = "start" | "info" | "dashboard";

interface AppSidebarProps {
  currentStep: AppStep;
  onStepChange: (step: AppStep) => void;
  dashboardTab: DashboardTab;
  onDashboardTabChange: (tab: DashboardTab) => void;
  isExpanded: boolean;
  onExpandedChange: (expanded: boolean) => void;
  glowIntensity?: number;
}

export function AppSidebar({ currentStep, onStepChange, dashboardTab, onDashboardTabChange, isExpanded, onExpandedChange, glowIntensity = 0 }: AppSidebarProps) {
  const { userInputs, updateUserInputs } = useAppStore();

  const handleStepClick = (step: AppStep) => {
    onStepChange(step);
    if (!isExpanded) onExpandedChange(true);
  };

  const dashboardSubTabs = [
    { id: "overview" as const, label: "Overview", icon: BarChart3 },
    { id: "scenarios" as const, label: "Explore Scenarios", icon: TrendingUp },
    { id: "deep-dive" as const, label: "Deep Dive", icon: Search },
  ];

  return (
    <aside 
      className={cn(
        "sticky top-20 h-[calc(100vh-5rem)] bg-white border-r transition-all duration-300 ease-in-out shrink-0 flex flex-col z-20",
        isExpanded ? "w-80" : "w-[72px]",
        glowIntensity === 0 && "border-slate-200"
      )}
      style={{
        boxShadow: glowIntensity > 0 ? `0 0 ${glowIntensity * 50}px ${glowIntensity * 10}px rgba(119, 188, 31, ${glowIntensity * 0.5})` : undefined,
        borderColor: glowIntensity > 0 ? `rgba(119, 188, 31, ${glowIntensity * 0.8})` : undefined,
      }}
    >
      <button
        onClick={() => onExpandedChange(!isExpanded)}
        className="absolute -right-6 top-6 flex items-center justify-center w-12 h-12 rounded-full bg-[#003087] border-2 border-white text-white hover:bg-[#0072C6] shadow-lg shadow-[#003087]/20 transition-all duration-300 z-50 group"
      >
        <ChevronRight className={cn("w-8 h-8 transition-transform duration-500 ease-in-out group-hover:scale-110", isExpanded && "rotate-180")} />
      </button>

      {/* Nav items — scrollable if content overflows */}
      <div className="flex-1 pt-24 pb-8 px-3 space-y-6 overflow-y-auto overflow-x-hidden styled-scrollbar min-h-0">
        {/* 1. Start Here */}
        <div>
          <button
            onClick={() => handleStepClick("start")}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors group relative",
              currentStep === "start" 
                ? "bg-primary/10 text-primary font-bold" 
                : "text-slate-600 hover:bg-slate-100"
            )}
          >
            <PlayCircle className={cn("w-5 h-5 shrink-0", currentStep === "start" ? "text-primary" : "text-slate-400 group-hover:text-slate-600")} />
            <span className={cn("text-[15px] whitespace-nowrap transition-opacity duration-300 text-left", 
              isExpanded ? "opacity-100" : "opacity-0 w-0 hidden"
            )}>
              1. Start Here
            </span>
          </button>
        </div>

        {/* 2. Your Info */}
        <div>
          <button
            onClick={() => handleStepClick("info")}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors group relative",
              currentStep === "info" 
                ? "bg-primary/10 text-primary font-bold" 
                : "text-slate-600 hover:bg-slate-100"
            )}
          >
            <FileText className={cn("w-5 h-5 shrink-0", currentStep === "info" ? "text-primary" : "text-slate-400 group-hover:text-slate-600")} />
            <span className={cn("text-[15px] whitespace-nowrap transition-opacity duration-300 text-left", 
              isExpanded ? "opacity-100" : "opacity-0 w-0 hidden"
            )}>
              2. Your Info
            </span>
          </button>

          {/* Quick Edit Sub-Panel */}
          {isExpanded && currentStep === "dashboard" && (
            <div className="mt-1 ml-4 pl-4 border-l-2 border-slate-100 space-y-1 py-1 animate-in fade-in slide-in-from-top-2">
              <CompactLivePreview />
            </div>
          )}
        </div>

        {/* 3. Dashboard */}
        <div>
          <button
            onClick={() => handleStepClick("dashboard")}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors group relative",
              currentStep === "dashboard" 
                ? "bg-primary/10 text-primary font-bold" 
                : "text-slate-600 hover:bg-slate-100"
            )}
          >
            <LayoutDashboard className={cn("w-5 h-5 shrink-0", currentStep === "dashboard" ? "text-primary" : "text-slate-400 group-hover:text-slate-600")} />
            <span className={cn("text-[15px] whitespace-nowrap transition-opacity duration-300 text-left", 
              isExpanded ? "opacity-100" : "opacity-0 w-0 hidden"
            )}>
              3. Affordability Dashboard
            </span>
          </button>

          {/* Sub-Tabs Navigation */}
          {isExpanded && currentStep === "dashboard" && (
            <div className="mt-2 ml-4 pl-6 border-l-2 border-primary/20 space-y-1 py-2 animate-in fade-in slide-in-from-top-2">
              {dashboardSubTabs.map((tab) => {
                const TabIcon = tab.icon;
                const isActive = dashboardTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => onDashboardTabChange(tab.id)}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group",
                      isActive 
                        ? "bg-primary/5 text-primary font-semibold" 
                        : "text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                    )}
                  >
                    <TabIcon className={cn("w-4 h-4 shrink-0", isActive ? "text-primary" : "text-slate-400")} />
                    <span className="text-sm">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>


    </aside>
  );
}

function CompactLivePreview() {
  const { userInputs, updateUserInputs } = useAppStore();
  
  return (
    <div className="space-y-2 pb-2 pr-2">
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Key Info</p>
      
      <CompactInput
        label="Gross Income"
        value={userInputs?.yearlyGrossIncome || 0}
        min={0} max={1000000}
        onChange={(v) => updateUserInputs({ yearlyGrossIncome: v })}
        prefix="$" suffix="/yr"
      />
      <CompactInput
        label="Down Payment"
        value={userInputs?.downPaymentPercent || 0}
        min={0} max={100}
        onChange={(v) => updateUserInputs({ downPaymentPercent: v })}
        suffix="%"
      />
      <CompactInput
        label="Interest Rate"
        value={userInputs?.interestRate || 0}
        min={1} max={15}
        onChange={(v) => updateUserInputs({ interestRate: v })}
        suffix="%"
      />
      <CompactInput
        label="Loan Term"
        value={userInputs?.mortgageTermYears || 30}
        min={10} max={40}
        onChange={(v) => updateUserInputs({ mortgageTermYears: v })}
        suffix=" yrs"
      />
      <CompactInput
        label="Property Tax"
        value={(userInputs?.propertyTaxRate || 0) / 100}
        min={0} max={20}
        onChange={(v) => updateUserInputs({ propertyTaxRate: Math.round(v * 100) })}
        suffix="%"
      />
    </div>
  );
}

interface CompactInputProps {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (val: number) => void;
  prefix?: string;
  suffix?: string;
}

function CompactInput({ label, value, min, max, onChange, prefix = "", suffix = "" }: CompactInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [localVal, setLocalVal] = useState(value.toString());

  // Sync local value when external value changes
  if (!isFocused && localVal !== value.toString()) {
    setLocalVal(value.toString());
  }

  const handleBlur = () => {
    setIsFocused(false);
    const num = parseFloat(localVal);
    if (!isNaN(num)) {
      // Clamp to min/max
      const clamped = Math.max(min, Math.min(max, num));
      onChange(clamped);
      setLocalVal(clamped.toString());
    } else {
      setLocalVal(value.toString());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.currentTarget.blur();
    }
  };

  const formattedValue = `${prefix}${value.toLocaleString("en-US")}${suffix}`;

  return (
    <div className="group relative rounded transition-colors flex justify-between items-center text-xs py-1.5 border-b border-slate-100/50 last:border-0">
      <span className="text-slate-500 font-medium">{label}</span>
      
      {isFocused ? (
        <div className="flex items-center">
          {prefix && <span className="text-slate-400 mr-0.5 text-xs">{prefix}</span>}
          <input
            type="number"
            className="w-16 text-right bg-white border border-primary/30 rounded text-slate-700 font-semibold focus:outline-none focus:border-primary px-1 py-0.5 text-xs"
            value={localVal}
            onChange={(e) => setLocalVal(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            autoFocus
          />
          {suffix && <span className="text-slate-400 ml-0.5 text-xs">{suffix}</span>}
        </div>
      ) : (
        <span 
          className="font-semibold text-slate-700 cursor-text hover:text-primary transition-colors px-1 rounded hover:bg-slate-100"
          onClick={() => setIsFocused(true)}
        >
          {formattedValue}
        </span>
      )}
    </div>
  );
}
