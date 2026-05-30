"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";

export function FaqSection() {
  return (
    <div className="relative group mt-16 sm:mt-24 mb-8">
      <div className="absolute inset-0 bg-gradient-to-r from-[#003087]/5 to-sky-500/5 rounded-[2rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      <div className="relative bg-white/80 backdrop-blur-xl border border-slate-200/60 shadow-2xl shadow-slate-200/40 rounded-[2rem] p-6 sm:p-8 md:p-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 mb-10 border-b border-slate-100 pb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#003087] to-sky-500 flex items-center justify-center shadow-lg shadow-sky-500/20 text-white shrink-0 transform transition-transform duration-500 group-hover:scale-105 group-hover:rotate-3">
            <HelpCircle className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight">Frequently Asked Questions</h2>
            <p className="text-sm sm:text-base text-slate-500 mt-1">Get clarity on the most common home buying concerns.</p>
          </div>
        </div>

        <Accordion className="w-full space-y-4">
          <AccordionItem value="item-1" className="border border-slate-100 bg-slate-50/50 rounded-2xl px-6 data-[state=open]:bg-white shadow-sm data-[state=open]:shadow-md transition-all duration-300">
            <AccordionTrigger className="text-left font-bold text-[15px] sm:text-base text-slate-700 hover:text-[#003087] hover:no-underline py-5">
              What should I decide is my maximum purchase price?
            </AccordionTrigger>
            <AccordionContent className="text-slate-600 text-sm sm:text-[15px] leading-relaxed pb-6">
              The best way to find your maximum purchase price is to look at your budget. We recommend using the Conservative risk as your maximum, but this calculator can only help you understand how lenders find your maximum purchase price and understanding a bit more about what a comfortable payment looks like according to different theories. Use a budget to find out what you&apos;re comfortable spending each month, only you can actually understand what works for you. Don&apos;t rely on someone&apos;s opinion of what you should spend if you&apos;re uncomfortable with the payment.
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-2" className="border border-slate-100 bg-slate-50/50 rounded-2xl px-6 data-[state=open]:bg-white shadow-sm data-[state=open]:shadow-md transition-all duration-300">
            <AccordionTrigger className="text-left font-bold text-[15px] sm:text-base text-slate-700 hover:text-[#003087] hover:no-underline py-5">
              What if there are no homes in my area below my max purchase price?
            </AccordionTrigger>
            <AccordionContent className="text-slate-600 text-sm sm:text-[15px] leading-relaxed pb-6">
              That&apos;s always frustrating! There is no magic button that will make home prices come down. Sometimes we have to be brutally honest with ourself about what we can afford and what we will practically do about it. If you can&apos;t afford a home in the area you want, you either need to find a way to increase your income or add someone on the loan with you OR look into lower cost areas.
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-3" className="border border-slate-100 bg-slate-50/50 rounded-2xl px-6 data-[state=open]:bg-white shadow-sm data-[state=open]:shadow-md transition-all duration-300">
            <AccordionTrigger className="text-left font-bold text-[15px] sm:text-base text-slate-700 hover:text-[#003087] hover:no-underline py-5">
              What does being house poor mean?
            </AccordionTrigger>
            <AccordionContent className="text-slate-600 text-sm sm:text-[15px] leading-relaxed pb-6">
              &quot;House poor&quot; is a phrase that doesn&apos;t have a technical definition. But rather it just means that your budget is a slave to your house payment... You can afford your mortgage payment but don&apos;t have money for much else. You don&apos;t want that. No one wants their life to revolve around a house payment. You can avoid becoming house poor by making sure you understand the costs of buying a home and refuse to go above a house payment that makes you uncomfortable. Remember, you know the mortgage payment before you buy a home. If the payment is too high, don&apos;t buy the home.
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-4" className="border border-slate-100 bg-slate-50/50 rounded-2xl px-6 data-[state=open]:bg-white shadow-sm data-[state=open]:shadow-md transition-all duration-300">
            <AccordionTrigger className="text-left font-bold text-[15px] sm:text-base text-slate-700 hover:text-[#003087] hover:no-underline py-5">
              What happens if I buy a home and eventually cannot make the monthly payment?
            </AccordionTrigger>
            <AccordionContent className="text-slate-600 text-sm sm:text-[15px] leading-relaxed pb-6">
              The CFPB has great resources on understanding what to do if you cannot make your monthly payment. The worst thing you can do is to stop paying and not let anyone know. There are programs that help millions of people stay out of foreclosure.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}
