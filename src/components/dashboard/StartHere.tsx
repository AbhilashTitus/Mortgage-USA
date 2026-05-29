import { Card, CardContent } from "@/components/ui/card";
import { PlayCircle } from "lucide-react";

export function StartHere() {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-6">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight mb-4">Start Here</h1>
          <p className="text-lg leading-relaxed text-slate-700 dark:text-slate-300">
            Welcome to your Max Purchase Price Calculator! <strong>The main goal of this calculator</strong> is to help you understand the maximum purchase price for the home you buy. Smart home buyers figure out their budget BEFORE they start the process of buying a home so they don&apos;t get stuck in a mortgage payment that is uncomfortable.
          </p>
        </div>

        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
          <p className="text-blue-900 font-medium">
            Make sure to watch the tutorial below FIRST. And only edit numbers/text that are in <span className="text-blue-600 font-bold">blue</span>.
          </p>
        </div>

        <Card className="overflow-hidden border-0 shadow-xl bg-slate-900 text-white mt-8 group cursor-pointer relative rounded-2xl">
          {/* Placeholder for a video player */}
          <div className="aspect-video relative flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-950">
            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-300" />
            <div className="text-center space-y-4 relative z-10 transform group-hover:scale-110 transition-transform duration-300">
              <PlayCircle className="w-20 h-20 mx-auto text-blue-400 opacity-80" />
              <p className="font-semibold tracking-wider text-sm uppercase text-slate-300">Watch Tutorial Video</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
