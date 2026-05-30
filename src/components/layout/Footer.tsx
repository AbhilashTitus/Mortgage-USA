import Link from 'next/link';
import Image from 'next/image';
import { Calculator } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 mt-auto pb-20 lg:pb-0">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
          <div className="md:col-span-2">
            <Link href="/" className="inline-block mb-6">
              <Image 
                src="/Logo.png" 
                alt="The Mortgage Calculator App" 
                width={400} 
                height={120} 
                className="h-16 sm:h-24 w-auto object-contain"
              />
            </Link>
            <p className="text-[15px] text-slate-500 max-w-sm leading-relaxed">
              Enterprise-grade affordability calculations designed to give you clarity and confidence in your home buying journey.
            </p>
          </div>
          
          <div>
            <h3 className="font-bold text-slate-800 mb-6 tracking-tight">Resources</h3>
            <ul className="space-y-3 text-[15px] text-slate-500">
              <li><Link href="#" className="hover:text-foreground transition-colors">How it works</Link></li>
              <li><Link href="#" className="hover:text-foreground transition-colors">Affordability Theories</Link></li>
              <li><Link href="#" className="hover:text-foreground transition-colors">Glossary</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-slate-800 mb-6 tracking-tight">Legal</h3>
            <ul className="space-y-3 text-[15px] text-slate-500">
              <li><Link href="#" className="hover:text-foreground transition-colors">Terms of Service</Link></li>
              <li><Link href="#" className="hover:text-foreground transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-foreground transition-colors">Disclaimer</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-slate-100 text-sm text-slate-400 flex flex-col md:flex-row justify-between items-center gap-4">
          <p>Disclaimer: This tool provides estimates for educational purposes only. It is not financial advice.</p>
          <p>© {new Date().getFullYear()} MortgageMaster. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
