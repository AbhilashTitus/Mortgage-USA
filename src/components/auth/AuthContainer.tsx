"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export function AuthContainer() {
  const [isSignIn, setIsSignIn] = useState(true);

  return (
    <div className="min-h-screen w-full bg-slate-50 flex items-center justify-center p-4 sm:p-8">
      {/* Back button */}
      <Link href="/" className="absolute top-4 left-4 sm:top-8 sm:left-8 flex items-center text-slate-500 hover:text-[#003087] transition-colors font-medium text-sm sm:text-base z-50">
        <ArrowLeft className="w-4 h-4 mr-1 sm:mr-2" />
        <span className="hidden sm:inline">Back to Dashboard</span>
        <span className="sm:hidden">Back</span>
      </Link>

      {/* ═══════════════════════════════════════════════════════════════
          DESKTOP LAYOUT (≥768px): Side-by-side with sliding overlay
          ═══════════════════════════════════════════════════════════════ */}
      <div className="hidden md:block relative z-10 w-full max-w-5xl min-h-[650px] -mt-8 sm:-mt-16">
        <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-row min-h-[650px] relative">
        
          {/* ─── SIGN UP FORM (Right Side) ─── */}
          <div 
            className={`absolute top-0 right-0 w-1/2 h-full flex flex-col justify-center px-12 sm:px-16 transition-all duration-1000 ease-in-out
            ${!isSignIn ? 'opacity-100 z-20 translate-x-0' : 'opacity-0 z-10 translate-x-[20%]'}`}
          >
            <div className="w-full max-w-sm mx-auto text-center">
              <h2 className="text-4xl font-extrabold text-slate-800 mb-6 tracking-tight">Create Account</h2>
              
              {/* Google Auth Button */}
              <button className="w-full flex items-center justify-center gap-3 bg-white border-2 border-slate-100 hover:border-slate-200 hover:bg-slate-50 text-slate-700 font-bold py-3 rounded-xl transition-all shadow-sm mb-6">
                <GoogleIcon />
                Sign up with Google
              </button>

              <div className="relative flex items-center mb-6">
                <div className="flex-grow border-t border-slate-100"></div>
                <span className="flex-shrink-0 mx-4 text-slate-400 text-sm font-medium">or use your email</span>
                <div className="flex-grow border-t border-slate-100"></div>
              </div>

              <form className="space-y-4 text-left" onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-slate-600 font-semibold">First Name</Label>
                    <Input type="text" placeholder="John" className="h-12 bg-slate-50 border-slate-200 focus:bg-white rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-600 font-semibold">Last Name</Label>
                    <Input type="text" placeholder="Doe" className="h-12 bg-slate-50 border-slate-200 focus:bg-white rounded-xl" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-600 font-semibold">Email</Label>
                  <Input type="email" placeholder="john@example.com" className="h-12 bg-slate-50 border-slate-200 focus:bg-white rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-600 font-semibold">Password</Label>
                  <Input type="password" placeholder="••••••••" className="h-12 bg-slate-50 border-slate-200 focus:bg-white rounded-xl" />
                </div>
                <Button className="w-full h-12 mt-6 rounded-xl text-white font-bold text-lg bg-[#003087] hover:bg-[#002266] shadow-lg shadow-[#003087]/30 transition-all">
                  Sign Up
                </Button>
              </form>
            </div>
          </div>

          {/* ─── SIGN IN FORM (Left Side) ─── */}
          <div 
            className={`absolute top-0 left-0 w-1/2 h-full flex flex-col justify-center px-12 sm:px-16 transition-all duration-1000 ease-in-out
            ${isSignIn ? 'opacity-100 z-20 translate-x-0' : 'opacity-0 z-10 -translate-x-[20%]'}`}
          >
            <div className="w-full max-w-sm mx-auto text-center">
              <h2 className="text-4xl font-extrabold text-slate-800 mb-2 tracking-tight">Welcome back</h2>
              <p className="text-slate-500 mb-8 font-medium">Log in to access your personalized dashboard.</p>
              
              {/* Google Auth Button */}
              <button className="w-full flex items-center justify-center gap-3 bg-white border-2 border-slate-100 hover:border-slate-200 hover:bg-slate-50 text-slate-700 font-bold py-3 rounded-xl transition-all shadow-sm mb-6">
                <GoogleIcon />
                Sign in with Google
              </button>

              <div className="relative flex items-center mb-6">
                <div className="flex-grow border-t border-slate-100"></div>
                <span className="flex-shrink-0 mx-4 text-slate-400 text-sm font-medium">or use your email</span>
                <div className="flex-grow border-t border-slate-100"></div>
              </div>

              <form className="space-y-5 text-left" onSubmit={(e) => e.preventDefault()}>
                <div className="space-y-2">
                  <Label className="text-slate-600 font-semibold">Email</Label>
                  <Input type="email" placeholder="john@example.com" className="h-12 bg-slate-50 border-slate-200 focus:bg-white rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-600 font-semibold">Password</Label>
                  <Input type="password" placeholder="••••••••" className="h-12 bg-slate-50 border-slate-200 focus:bg-white rounded-xl" />
                </div>
                <div className="flex justify-start">
                  <a href="#" className="text-sm font-semibold text-slate-500 hover:text-slate-700 hover:underline">Forgot Your Password?</a>
                </div>
                <Button className="w-full h-12 mt-4 rounded-xl text-white font-bold text-lg bg-[#003087] hover:bg-[#002266] shadow-lg shadow-[#003087]/30 transition-all">
                  Sign In
                </Button>
              </form>
            </div>
          </div>

          {/* ─── SLIDING OVERLAY PANEL ─── */}
          <div 
            className={`absolute top-0 left-0 w-1/2 h-full z-30 pointer-events-none transition-transform duration-1000 ease-in-out
            ${isSignIn ? 'translate-x-full' : 'translate-x-0'}`}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#003087] to-[#002266] text-white overflow-hidden pointer-events-auto rounded-[2.5rem] shadow-2xl">
              
              {/* Overlay background decorative elements */}
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-[#77BC1F]/20 rounded-full blur-3xl"></div>

              {/* Overlay content container (200% width to hold both states side-by-side) */}
              <div 
                className={`absolute top-0 left-0 w-[200%] h-full flex transition-transform duration-1000 ease-in-out
                ${isSignIn ? '-translate-x-1/2' : 'translate-x-0'}`}
              >
                
                {/* Left Side Content (Visible when Sign Up form is active, i.e. panel is on left) */}
                <div className="w-1/2 h-full flex flex-col items-center justify-center p-12 text-center">
                  <h2 className="text-4xl font-extrabold mb-4 tracking-tight">Welcome back</h2>
                  <p className="text-white/80 mb-8 max-w-[280px] leading-relaxed text-lg">
                    To keep connected with us please login with your personal info.
                  </p>
                  <button 
                    onClick={() => setIsSignIn(true)} 
                    className="border-2 border-white/30 text-white rounded-xl px-12 py-3.5 font-bold hover:bg-white hover:text-[#003087] hover:border-white transition-all shadow-lg"
                  >
                    Sign In
                  </button>
                </div>

                {/* Right Side Content (Visible when Sign In form is active, i.e. panel is on right) */}
                <div className="w-1/2 h-full flex flex-col items-center justify-center p-12 text-center">
                  <h2 className="text-4xl font-extrabold mb-4 tracking-tight">Create your account</h2>
                  <p className="text-white/80 mb-8 max-w-[280px] leading-relaxed text-lg">
                    Set up your affordability dashboard and start exploring your options in minutes.
                  </p>
                  <button 
                    onClick={() => setIsSignIn(false)} 
                    className="border-2 border-white/30 text-white rounded-xl px-12 py-3.5 font-bold hover:bg-white hover:text-[#003087] hover:border-white transition-all shadow-lg"
                  >
                    Sign Up
                  </button>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          MOBILE LAYOUT (<768px): Sliding Forms
          ═══════════════════════════════════════════════════════════════ */}
      <div className="md:hidden w-full max-w-md mx-auto mt-12 relative overflow-hidden pb-12">
        {/* Toggle Pill */}
        <div className="flex justify-center mb-6">
          <div className="bg-white rounded-full p-1 shadow-sm border border-slate-200 inline-flex relative w-64">
            <div 
              className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-[#003087] rounded-full transition-transform duration-300 ease-in-out ${!isSignIn ? 'translate-x-full left-1' : 'left-1'}`}
            ></div>
            <button 
              onClick={() => setIsSignIn(true)} 
              className={`relative z-10 flex-1 py-2 rounded-full text-sm font-bold transition-colors duration-300 ${isSignIn ? 'text-white' : 'text-slate-600'}`}
            >
              Sign In
            </button>
            <button 
              onClick={() => setIsSignIn(false)} 
              className={`relative z-10 flex-1 py-2 rounded-full text-sm font-bold transition-colors duration-300 ${!isSignIn ? 'text-white' : 'text-slate-600'}`}
            >
              Sign Up
            </button>
          </div>
        </div>

        {/* Sliding Container */}
        <div className="relative w-full">
          <div 
            className={`flex w-[200%] transition-transform duration-500 ease-in-out ${isSignIn ? 'translate-x-0' : '-translate-x-1/2'}`}
          >
            {/* Sign In View */}
            <div className="w-1/2 px-1">
              <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-6 sm:p-8">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 mb-1 tracking-tight">
                  Welcome <span className="text-[#003087]">back</span>
                </h2>
                <p className="text-slate-500 mb-6 text-sm">
                  Sign in to access your dashboard and explore options.
                </p>

                {/* Google Auth */}
                <button className="w-full flex items-center justify-center gap-3 bg-white border-2 border-slate-100 hover:border-slate-200 text-slate-700 font-bold py-3 rounded-xl transition-all shadow-sm mb-5">
                  <GoogleIcon />
                  <span className="text-sm">Sign in with Google</span>
                </button>

                <div className="relative flex items-center mb-5">
                  <div className="flex-grow border-t border-slate-100"></div>
                  <span className="flex-shrink-0 mx-3 text-slate-400 text-xs font-medium">or use your email</span>
                  <div className="flex-grow border-t border-slate-100"></div>
                </div>

                <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                  <div className="space-y-1.5">
                    <Label className="text-slate-600 font-semibold text-sm">Email</Label>
                    <Input type="email" placeholder="you@example.com" className="h-12 bg-slate-50/50 border-slate-200 focus:bg-white rounded-xl text-base" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-slate-600 font-semibold text-sm">Password</Label>
                    <Input type="password" placeholder="••••••••" className="h-12 bg-slate-50/50 border-slate-200 focus:bg-white rounded-xl text-base" />
                  </div>
                  <div className="flex justify-start">
                    <a href="#" className="text-sm font-semibold text-[#0072C6] hover:underline">Forgot Your Password?</a>
                  </div>
                  <Button className="w-full h-12 mt-2 rounded-xl text-white font-bold text-base bg-gradient-to-r from-[#003087] to-[#0072C6] hover:opacity-90 shadow-lg shadow-[#003087]/20 transition-all">
                    Sign In
                  </Button>
                </form>
              </div>
            </div>

            {/* Sign Up View */}
            <div className="w-1/2 px-1">
              <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-6 sm:p-8">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 mb-1 tracking-tight">
                  Create <span className="text-[#003087]">Account</span>
                </h2>
                <p className="text-slate-500 mb-6 text-sm">
                  Set up your dashboard and start your journey.
                </p>

                {/* Google Auth */}
                <button className="w-full flex items-center justify-center gap-3 bg-white border-2 border-slate-100 hover:border-slate-200 text-slate-700 font-bold py-3 rounded-xl transition-all shadow-sm mb-5">
                  <GoogleIcon />
                  <span className="text-sm">Sign up with Google</span>
                </button>

                <div className="relative flex items-center mb-5">
                  <div className="flex-grow border-t border-slate-100"></div>
                  <span className="flex-shrink-0 mx-3 text-slate-400 text-xs font-medium">or use your email</span>
                  <div className="flex-grow border-t border-slate-100"></div>
                </div>

                <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label className="text-slate-600 font-semibold text-sm">First Name</Label>
                      <Input type="text" placeholder="John" className="h-12 bg-slate-50/50 border-slate-200 focus:bg-white rounded-xl text-base" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-slate-600 font-semibold text-sm">Last Name</Label>
                      <Input type="text" placeholder="Doe" className="h-12 bg-slate-50/50 border-slate-200 focus:bg-white rounded-xl text-base" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-slate-600 font-semibold text-sm">Email</Label>
                    <Input type="email" placeholder="you@example.com" className="h-12 bg-slate-50/50 border-slate-200 focus:bg-white rounded-xl text-base" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-slate-600 font-semibold text-sm">Password</Label>
                    <Input type="password" placeholder="••••••••" className="h-12 bg-slate-50/50 border-slate-200 focus:bg-white rounded-xl text-base" />
                  </div>
                  <Button className="w-full h-12 mt-2 rounded-xl text-white font-bold text-base bg-gradient-to-r from-[#003087] to-[#0072C6] hover:opacity-90 shadow-lg shadow-[#003087]/20 transition-all">
                    Sign Up
                  </Button>
                </form>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

// Extracted Google SVG icon to keep component clean
function GoogleIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}
