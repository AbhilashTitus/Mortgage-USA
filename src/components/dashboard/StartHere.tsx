"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import {
  Home,
  DollarSign,
  BarChart3,
  TrendingUp,
  Search,
  ShieldCheck,
  FileText,
  ArrowRight,
  Sparkles,
  PiggyBank,
  Calculator,
  CheckCircle2,
} from "lucide-react";

// ─── Story steps ─────────────────────────────────────────────────────────────
const steps = [
  {
    icon: Home,
    color: "from-[#003087] to-[#0072C6]",
    accent: "#003087",
    badge: "Welcome",
    heading: "Your Home Buying Journey Starts Here",
    body: "Buying a home is one of the biggest financial decisions of your life. Most buyers skip the most important step — knowing exactly how much they can comfortably afford before they ever step foot in a house.",
    highlight: "This tool changes that.",
  },
  {
    icon: DollarSign,
    color: "from-[#0072C6] to-[#1a8fd1]",
    accent: "#0072C6",
    badge: "Step 1 · Your Info",
    heading: "Tell Us About Your Finances",
    body: "Start by entering your gross income, existing monthly debts, down payment, interest rate, and loan term. We handle everything else — no spreadsheets, no guesswork.",
    highlight: "The more accurate your inputs, the more powerful your results.",
  },
  {
    icon: Calculator,
    color: "from-[#003087] to-[#0072C6]",
    accent: "#003087",
    badge: "Under the Hood",
    heading: "Powered by Real Mortgage Math",
    body: "We use the industry-standard Debt-to-Income (DTI) ratio — the same formula every lender uses — to calculate precisely how much home you can afford without overextending your budget.",
    highlight: "Real numbers. Real math. Not a rough estimate.",
  },
  {
    icon: ShieldCheck,
    color: "from-[#77BC1F] to-[#5ea318]",
    accent: "#77BC1F",
    badge: "Risk Tiers",
    heading: "Choose Your Comfort Level",
    body: "Not everyone has the same risk appetite. We show you three tiers — Conservative, Moderate, and Aggressive — so you can see what lenders will technically approve vs. what you should actually spend.",
    highlight: "We always recommend the Conservative tier as your ceiling.",
  },
  {
    icon: BarChart3,
    color: "from-[#0072C6] to-[#003087]",
    accent: "#0072C6",
    badge: "Overview Dashboard",
    heading: "See Your Full Payment Picture",
    body: "Instantly visualize your monthly payment breakdown — principal, interest, property tax, insurance, and PMI — alongside exactly how much cash you'll need on closing day.",
    highlight: "No surprises at the closing table.",
  },
  {
    icon: TrendingUp,
    color: "from-[#003087] to-[#77BC1F]",
    accent: "#003087",
    badge: "Explore Scenarios",
    heading: "What If You Spent More — or Less?",
    body: "Explore how different home prices affect your monthly payment and long-term financial health. Test any custom price to see exactly where it lands against your budget.",
    highlight: "Know before you bid.",
  },
  {
    icon: Search,
    color: "from-[#77BC1F] to-[#0072C6]",
    accent: "#77BC1F",
    badge: "Deep Dive",
    heading: "Understand the Expert Theories",
    body: "Compare your numbers against popular affordability rules — the 28% rule, the 3× income rule, and more. See how financial experts' guidelines stack up against your real situation.",
    highlight: "Become the most informed buyer in the room.",
  },
  {
    icon: PiggyBank,
    color: "from-[#0072C6] to-[#003087]",
    accent: "#0072C6",
    badge: "Amortization",
    heading: "See Every Dollar You'll Ever Pay",
    body: "Our amortization table shows you every single month of your loan — how much goes to interest vs. principal, and your remaining balance — so you understand the true cost of your mortgage.",
    highlight: "Knowledge is your greatest financial asset.",
  },
  {
    icon: Sparkles,
    color: "from-[#003087] to-[#77BC1F]",
    accent: "#003087",
    badge: "You're Ready",
    heading: "Start Smart. Buy Confidently.",
    body: 'You now know exactly what this tool will do for you. Head to "Your Info" to enter your numbers and unlock your personalized Affordability Dashboard.',
    highlight: "Smart home buyers set their budget first. Be a smart buyer.",
  },
];

interface StartHereProps {
  onNext?: () => void;
  onProgressComplete?: () => void;
  onGlowChange?: (intensity: number) => void;
}

export function StartHere({ onNext, onProgressComplete, onGlowChange }: StartHereProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const timelineTrackRef = useRef<HTMLDivElement>(null);
  const ctaContainerRef = useRef<HTMLDivElement>(null);
  const [timelineProgress, setTimelineProgress] = useState(0);
  const [activeStep, setActiveStep] = useState(0);
  const [visibleSteps, setVisibleSteps] = useState<Set<number>>(new Set([0]));
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);
  const dotRefs = useRef<(HTMLDivElement | null)[]>([]);

  const handleScroll = useCallback(() => {
    const track = timelineTrackRef.current;
    if (track) {
      // Calculate timeline progress based on the track element's position
      const trackRect = track.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const triggerPoint = viewportHeight * 0.4; // where we consider "active"

      // The progress line fills from the top of the track down to the trigger point
      const trackTop = trackRect.top;
      const trackHeight = trackRect.height;

      // How far into the track has the trigger point penetrated
      const penetration = triggerPoint - trackTop;
      const progress = Math.max(0, Math.min(1, penetration / trackHeight));
      setTimelineProgress(progress);

      // Calculate active step based on which step container is closest to the trigger point
      let closestIndex = 0;
      let closestDistance = Infinity;
      stepRefs.current.forEach((ref, i) => {
        if (!ref) return;
        const rect = ref.getBoundingClientRect();
        const center = rect.top + rect.height / 2;
        const distance = Math.abs(center - triggerPoint);
        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = i;
        }
      });
      setActiveStep(closestIndex);
    }

    // Calculate CTA scroll progress for sidebar glow
    const cta = ctaContainerRef.current;
    if (cta) {
      const ctaRect = cta.getBoundingClientRect();
      const startStickyPoint = window.innerHeight / 2;
      
      // If the CTA container's top has passed the middle of the screen (it is now sticking)
      if (ctaRect.top <= startStickyPoint) {
        const scrolled = startStickyPoint - ctaRect.top;
        // Peak the glow slightly before the end of the sticky container
        const glowProgress = Math.max(0, Math.min(1, scrolled / (ctaRect.height * 0.7)));
        onGlowChange?.(glowProgress);
      } else {
        onGlowChange?.(0);
      }
    }
  }, [onGlowChange]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });
    handleScroll();
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [handleScroll]);

  // Trigger completion when progress hits 100%
  const hasTriggeredComplete = useRef(false);
  useEffect(() => {
    if (timelineProgress >= 0.99 && !hasTriggeredComplete.current) {
      hasTriggeredComplete.current = true;
      onProgressComplete?.();
    } else if (timelineProgress < 0.95 && hasTriggeredComplete.current) {
      hasTriggeredComplete.current = false;
    }
  }, [timelineProgress, onProgressComplete]);

  // Intersection Observer for fade-in animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = stepRefs.current.indexOf(entry.target as HTMLDivElement);
            if (index !== -1) {
              setVisibleSteps((prev) => {
                const next = new Set(prev);
                next.add(index);
                return next;
              });
            }
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -5% 0px" }
    );

    const timer = setTimeout(() => {
      stepRefs.current.forEach((ref) => ref && observer.observe(ref));
    }, 100);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, []);

  const ActiveIcon = steps[activeStep]?.icon;
  const activeAccent = steps[activeStep]?.accent;

  return (
    <div ref={containerRef} className="relative max-w-5xl mx-auto py-4 sm:py-8 px-1 sm:px-4">
      
      {/* ── Faded Background Icon of Active Step ── */}
      <div 
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0 transition-all duration-1000 ease-out"
        style={{ opacity: 0.04 }}
      >
        <ActiveIcon 
          className="w-[500px] h-[500px] sm:w-[600px] sm:h-[600px] md:w-[700px] md:h-[700px] transition-colors duration-1000"
          style={{ color: activeAccent }}
          strokeWidth={0.5}
        />
      </div>

      {/* Hero */}
      <div className="text-center mb-10 sm:mb-20 pt-2 sm:pt-4 relative z-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 sm:w-80 h-48 sm:h-80 bg-blue-100/40 rounded-full blur-[100px] pointer-events-none" />
        <h1
          className="text-3xl sm:text-4xl md:text-6xl font-extrabold tracking-tight mb-4 sm:mb-6 leading-[1.1] relative"
          style={{ color: "#003087" }}
        >
          Start Here.
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-slate-500 max-w-xl mx-auto leading-relaxed relative px-2">
          Scroll through to discover what this tool does — then jump in and
          calculate your true home buying budget.
        </p>
      </div>

      {/* ── Story Timeline ── */}
      <div className="relative z-10" ref={timelineTrackRef}>
        {steps.map((step, i) => {
          const Icon = step.icon;
          const isVisible = visibleSteps.has(i);
          const isActive = activeStep === i;
          const isLast = i === steps.length - 1;
          const isEven = i % 2 !== 0;

          return (
            <div
              key={i}
              ref={(el) => { stepRefs.current[i] = el; }}
              className={`
                relative z-20 transition-all duration-700 ease-out
                ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-16"}
              `}
            >
              {/* ── MOBILE LAYOUT: Single column, left-aligned timeline ── */}
              <div className="md:hidden">
                <div className="flex gap-3 sm:gap-4">
                  {/* Left: Timeline (number + line) */}
                  <div className="flex flex-col items-center shrink-0">
                    {/* Step Number */}
                    <div 
                      ref={(el) => { dotRefs.current[i] = el; }}
                      className={`
                        relative z-20 w-10 h-10 rounded-full flex items-center justify-center 
                        font-bold text-sm shrink-0
                        transition-all duration-500
                        ${isActive 
                          ? "text-white scale-110" 
                          : isVisible 
                            ? "bg-white border-2 border-slate-200 text-slate-400 shadow-sm" 
                            : "bg-slate-100 border-2 border-slate-100 text-slate-300"
                        }
                      `}
                      style={isActive ? { 
                        background: `linear-gradient(135deg, ${step.accent}, ${step.accent}cc)`,
                        boxShadow: `0 4px 20px ${step.accent}40`
                      } : {}}
                    >
                      {i + 1}
                    </div>
                    
                    {/* Vertical Line */}
                    {!isLast && (
                      <div className="w-[2px] flex-1 min-h-[80px] bg-slate-200/50" />
                    )}
                  </div>

                  {/* Right: Content */}
                  <div className={`
                    pb-8 flex-1 min-w-0
                    transition-all duration-700 ease-out
                    ${isActive ? "opacity-100" : "opacity-60"}
                  `}>
                    {/* Icon + Badge row */}
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`
                        relative w-12 h-12 sm:w-14 sm:h-14 rounded-xl 
                        flex items-center justify-center
                        bg-gradient-to-br ${step.color}
                        transition-all duration-500
                        ${isActive ? "shadow-lg" : "shadow-md"}
                      `}>
                        <div className="absolute inset-0 rounded-xl overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-b from-white/25 via-transparent to-black/10" />
                        </div>
                        <Icon className="relative z-10 w-6 h-6 sm:w-7 sm:h-7 text-white stroke-[1.5]" />
                      </div>
                      <span
                        className="text-[10px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded-full shadow-sm"
                        style={{
                          background: `${step.accent}12`,
                          color: step.accent,
                        }}
                      >
                        {step.badge}
                      </span>
                    </div>

                    {/* Heading */}
                    <h2 className={`
                      text-lg sm:text-xl font-bold tracking-tight leading-tight mb-2
                      transition-colors duration-500
                    `}
                      style={{ color: isActive ? step.accent : "#64748b" }}
                    >
                      {step.heading}
                    </h2>

                    {/* Body */}
                    <p className="text-sm text-slate-500 leading-relaxed mb-3">
                      {step.body}
                    </p>

                    {/* Highlight callout */}
                    <div
                      className={`
                        inline-flex items-start gap-2 rounded-lg px-3 py-2 transition-all duration-500
                        ${isActive ? "shadow-sm" : ""}
                      `}
                      style={{
                        background: `${step.accent}08`,
                        borderLeft: `3px solid ${step.accent}`,
                      }}
                    >
                      <CheckCircle2
                        className="w-4 h-4 shrink-0 mt-0.5"
                        style={{ color: step.accent }}
                      />
                      <p
                        className="text-xs sm:text-sm font-semibold leading-relaxed"
                        style={{ color: step.accent }}
                      >
                        {step.highlight}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* ── DESKTOP LAYOUT: 3-column alternating grid ── */}
              <div className="hidden md:block">
                <div className="grid grid-cols-[1fr_60px_1fr] md:grid-cols-[1fr_80px_1fr] items-start">
                  
                  {/* Icon Area */}
                  <div className={`
                    flex items-start pt-1
                    ${isEven ? "justify-start pl-4 md:pl-8 order-3" : "justify-end pr-4 md:pr-8 order-1"}
                  `}>
                    <div className={`
                      relative transition-all duration-700 ease-out
                      ${isActive ? "scale-100 opacity-100" : "scale-90 opacity-30"}
                    `}>
                      {/* Background glow */}
                      <div 
                        className={`absolute inset-0 rounded-3xl blur-[50px] transition-opacity duration-700 ${isActive ? "opacity-25" : "opacity-0"}`}
                        style={{ background: step.accent }}
                      />
                      {/* Icon container */}
                      <div className={`
                        relative w-20 h-20 sm:w-28 sm:h-28 md:w-36 md:h-36 rounded-2xl md:rounded-3xl 
                        flex items-center justify-center
                        bg-gradient-to-br ${step.color}
                        transition-all duration-500
                        ${isActive ? "shadow-2xl" : "shadow-lg"}
                      `}>
                        {/* Inner glass reflection */}
                        <div className="absolute inset-0 rounded-2xl md:rounded-3xl overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-b from-white/25 via-transparent to-black/10" />
                        </div>
                        <Icon className="relative z-10 w-8 h-8 sm:w-12 sm:h-12 md:w-16 md:h-16 text-white stroke-[1.5]" />
                      </div>
                    </div>
                  </div>

                  {/* CENTER: Continuous Timeline */}
                  <div className="flex flex-col items-center relative order-2">
                    {/* Dot / Step Number */}
                    <div 
                      ref={(el) => { dotRefs.current[i] = el; }}
                      className={`
                        relative z-20 w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center 
                        font-bold text-base md:text-lg shrink-0
                        transition-all duration-500
                        ${isActive 
                          ? "text-white scale-110" 
                          : isVisible 
                            ? "bg-white border-2 border-slate-200 text-slate-400 shadow-sm" 
                            : "bg-slate-100 border-2 border-slate-100 text-slate-300"
                        }
                      `}
                      style={isActive ? { 
                        background: `linear-gradient(135deg, ${step.accent}, ${step.accent}cc)`,
                        boxShadow: `0 4px 20px ${step.accent}40`
                      } : {}}
                    >
                      {i + 1}
                    </div>
                    
                    {/* Continuous Vertical Line Segment */}
                    {!isLast && (
                      <div className="w-[3px] flex-1 min-h-[220px] bg-slate-200/50" />
                    )}
                  </div>

                  {/* Content Area */}
                  <div className={`
                    pb-16 flex flex-col
                    transition-all duration-700 ease-out
                    ${isEven ? "pr-4 md:pr-8 order-1 items-end text-right" : "pl-4 md:pl-8 order-3 items-start text-left"}
                    ${isActive ? "opacity-100" : "opacity-50"}
                  `}>
                    {/* Badge */}
                    <span
                      className="inline-block text-[11px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full mb-4 shadow-sm"
                      style={{
                        background: `${step.accent}12`,
                        color: step.accent,
                      }}
                    >
                      {step.badge}
                    </span>

                    <h2 className={`
                      text-xl sm:text-2xl md:text-3xl font-bold tracking-tight leading-tight mb-4
                      transition-colors duration-500
                    `}
                      style={{ color: isActive ? step.accent : "#64748b" }}
                    >
                      {step.heading}
                    </h2>

                    <p className="text-sm sm:text-base md:text-lg text-slate-500 leading-relaxed mb-5">
                      {step.body}
                    </p>

                    {/* Highlight callout */}
                    <div
                      className={`
                        inline-flex items-start gap-3 rounded-xl px-4 py-3 transition-all duration-500
                        ${isEven ? "flex-row-reverse text-right" : "flex-row text-left"}
                        ${isActive ? "shadow-sm" : ""}
                      `}
                      style={{
                        background: `${step.accent}08`,
                        ...(isEven ? { borderRight: `3px solid ${step.accent}` } : { borderLeft: `3px solid ${step.accent}` })
                      }}
                    >
                      <CheckCircle2
                        className="w-4 h-4 sm:w-5 sm:h-5 shrink-0 mt-0.5"
                        style={{ color: step.accent }}
                      />
                      <p
                        className="text-xs sm:text-sm md:text-[15px] font-semibold leading-relaxed"
                        style={{ color: step.accent }}
                      >
                        {step.highlight}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* ── Continuous Progress Fill Overlay ── */}
        {/* Mobile progress line: left-aligned */}
        <div 
          className="absolute top-0 left-[19px] w-[2px] pointer-events-none z-10 md:hidden"
          style={{ height: "100%" }}
        >
          <div
            className="w-full rounded-full transition-[height] duration-150 ease-out"
            style={{
              height: `${timelineProgress * 100}%`,
              background: "linear-gradient(to bottom, #003087 0%, #0072C6 50%, #77BC1F 100%)",
              boxShadow: "0 2px 12px rgba(0, 114, 198, 0.35)",
            }}
          />
        </div>

        {/* Desktop progress line: centered */}
        <div 
          className="absolute left-1/2 top-0 w-[3px] pointer-events-none z-10 hidden md:block"
          style={{
            transform: "translateX(-50%)",
            height: "100%",
          }}
        >
          <div
            className="w-full rounded-full transition-[height] duration-150 ease-out"
            style={{
              height: `${timelineProgress * 100}%`,
              background: "linear-gradient(to bottom, #003087 0%, #0072C6 50%, #77BC1F 100%)",
              boxShadow: "0 2px 12px rgba(0, 114, 198, 0.35)",
            }}
          />
        </div>
      </div>

      {/* ── Sticky Progress Indicator (bottom-right) ── */}
      <div className="fixed bottom-20 lg:bottom-8 right-4 sm:right-8 z-40 flex items-center gap-3 bg-white/90 backdrop-blur-lg shadow-xl border border-slate-200/60 rounded-full px-3 sm:px-4 py-2">
        <div className="w-16 sm:w-24 h-1.5 bg-slate-200/60 rounded-full overflow-hidden">
          <div 
            className="h-full rounded-full transition-all duration-300 ease-out"
            style={{
              width: `${timelineProgress * 100}%`,
              background: "linear-gradient(to right, #003087, #0072C6, #77BC1F)",
            }}
          />
        </div>
        <span className="text-xs font-bold text-slate-500 tabular-nums min-w-[36px]">
          {Math.round(timelineProgress * 100)}%
        </span>
      </div>

      {/* CTA with Scroll Jacking Pause */}
      <div ref={ctaContainerRef} className="relative z-10 h-[150vh] sm:h-[250vh] mt-[15vh] sm:mt-[30vh]">
        <div className="sticky top-1/2 -translate-y-1/2 pt-8 sm:pt-16 pb-4 sm:pb-8 px-2 sm:px-0">
          <div
            className="rounded-2xl sm:rounded-[2.5rem] p-1 shadow-2xl overflow-hidden transform hover:scale-[1.02] transition-transform duration-500 max-w-4xl mx-auto"
            style={{
              background: "linear-gradient(135deg, #003087 0%, #0072C6 50%, #77BC1F 100%)",
            }}
          >
            <div className="bg-white/95 backdrop-blur-xl rounded-xl sm:rounded-[2.35rem] px-5 py-8 sm:px-16 sm:py-16 text-center relative overflow-hidden">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[200%] h-64 bg-[#0072C6] blur-[120px] opacity-10 pointer-events-none rounded-[100%]" />
              
              <div className="relative z-10 flex flex-col items-center">
                <div className="w-14 h-14 sm:w-20 sm:h-20 bg-blue-50 rounded-full flex items-center justify-center mb-4 sm:mb-6 shadow-inner">
                  <FileText className="w-7 h-7 sm:w-10 sm:h-10" style={{ color: "#003087" }} />
                </div>
                
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-3 sm:mb-4 tracking-tight" style={{ color: "#003087" }}>
                  Ready to find your number?
                </h3>
                
                <p className="text-slate-500 text-sm sm:text-lg max-w-md mx-auto leading-relaxed mb-6 sm:mb-8">
                  Click <strong className="text-slate-700">Your Info</strong> in the navigation to enter your financial details and unlock your personalized dashboard.
                </p>
                
                <button 
                  onClick={() => {
                    window.scrollTo({ top: 0, behavior: "smooth" });
                    onNext?.();
                  }}
                  className="inline-flex items-center justify-center gap-2 sm:gap-3 bg-slate-900 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full font-bold shadow-lg shadow-slate-900/20 hover:bg-slate-800 transition-all duration-300 group cursor-pointer text-sm sm:text-base"
                >
                  <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: "#77BC1F" }} />
                  <span>Step 2 → Your Info</span>
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
