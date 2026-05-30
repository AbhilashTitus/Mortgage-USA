import Link from 'next/link';
import Image from 'next/image';
import { Calculator } from 'lucide-react';

export function Footer() {
  return (
    <footer className="relative bg-white mt-auto pb-24 lg:pb-0 overflow-hidden">
      {/* Premium subtle top gradient border */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
      
      <div className="container mx-auto px-6 sm:px-8 lg:px-10 py-12 sm:py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
          <div className="md:col-span-2">
            <Link href="/" className="inline-block mb-6 transition-transform hover:scale-105 duration-300">
              <Image 
                src="/Logo.png" 
                alt="The Mortgage Calculator App" 
                width={400} 
                height={120} 
                className="h-14 sm:h-16 lg:h-20 w-auto object-contain"
              />
            </Link>
            <p className="text-sm sm:text-[15px] text-slate-500 max-w-sm leading-relaxed">
              Enterprise-grade affordability calculations designed to give you clarity and confidence in your home buying journey. Make the right choice, every time.
            </p>
          </div>
          
          <div>
            <h3 className="font-bold text-slate-800 mb-5 tracking-tight uppercase text-xs sm:text-sm tracking-wider text-primary">Resources</h3>
            <ul className="space-y-3.5 text-sm sm:text-[15px] font-medium text-slate-500">
              <li><Link href="#" className="hover:text-[#003087] transition-colors relative group"><span className="absolute -left-3 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-[#003087] opacity-0 group-hover:opacity-100 transition-all" />How it works</Link></li>
              <li><Link href="#" className="hover:text-[#003087] transition-colors relative group"><span className="absolute -left-3 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-[#003087] opacity-0 group-hover:opacity-100 transition-all" />Affordability Theories</Link></li>
              <li><Link href="#" className="hover:text-[#003087] transition-colors relative group"><span className="absolute -left-3 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-[#003087] opacity-0 group-hover:opacity-100 transition-all" />Glossary</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-slate-800 mb-5 tracking-tight uppercase text-xs sm:text-sm tracking-wider text-primary">Legal</h3>
            <ul className="space-y-3.5 text-sm sm:text-[15px] font-medium text-slate-500">
              <li><Link href="#" className="hover:text-[#003087] transition-colors relative group"><span className="absolute -left-3 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-[#003087] opacity-0 group-hover:opacity-100 transition-all" />Terms of Service</Link></li>
              <li><Link href="#" className="hover:text-[#003087] transition-colors relative group"><span className="absolute -left-3 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-[#003087] opacity-0 group-hover:opacity-100 transition-all" />Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-[#003087] transition-colors relative group"><span className="absolute -left-3 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-[#003087] opacity-0 group-hover:opacity-100 transition-all" />Disclaimer</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-16 pt-8 border-t border-slate-100/80 text-[13px] text-slate-400 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
          <p className="max-w-2xl font-medium">Disclaimer: This tool provides estimates for educational purposes only. It is not financial advice.</p>
          <p className="font-semibold text-slate-500">© {new Date().getFullYear()} The Mortgage Calculator App.</p>
        </div>
      </div>
    </footer>
  );
}
