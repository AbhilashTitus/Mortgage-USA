import Link from 'next/link';
import { Calculator } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="flex items-center justify-center w-6 h-6 rounded bg-primary text-primary-foreground">
                <Calculator className="w-3.5 h-3.5" />
              </div>
              <span className="font-semibold text-base">MortgageMaster</span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-sm">
              Enterprise-grade affordability calculations designed to give you clarity and confidence in your home buying journey.
            </p>
          </div>
          
          <div>
            <h3 className="font-medium mb-4">Resources</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="#" className="hover:text-foreground transition-colors">How it works</Link></li>
              <li><Link href="#" className="hover:text-foreground transition-colors">Affordability Theories</Link></li>
              <li><Link href="#" className="hover:text-foreground transition-colors">Glossary</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium mb-4">Legal</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="#" className="hover:text-foreground transition-colors">Terms of Service</Link></li>
              <li><Link href="#" className="hover:text-foreground transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-foreground transition-colors">Disclaimer</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t text-sm text-muted-foreground flex flex-col md:flex-row justify-between items-center gap-4">
          <p>Disclaimer: This tool provides estimates for educational purposes only. It is not financial advice.</p>
          <p>© {new Date().getFullYear()} MortgageMaster. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
