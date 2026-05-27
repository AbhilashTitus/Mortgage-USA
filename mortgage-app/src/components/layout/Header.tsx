import { Calculator, HelpCircle, Menu } from 'lucide-react';
import Link from 'next/link';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary text-primary-foreground group-hover:bg-primary/90 transition-colors">
              <Calculator className="w-5 h-5" />
            </div>
            <span className="font-bold text-lg hidden sm:inline-block">Mortgage<span className="text-primary">Master</span></span>
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link href="#dashboard" className="text-muted-foreground hover:text-foreground transition-colors">Dashboard</Link>
          <Link href="#scenarios" className="text-muted-foreground hover:text-foreground transition-colors">Scenarios</Link>
          <Link href="#breakdown" className="text-muted-foreground hover:text-foreground transition-colors">Breakdown</Link>
          <Link href="#rates" className="text-muted-foreground hover:text-foreground transition-colors">Live Rates</Link>
        </nav>

        <div className="flex items-center gap-4">
          <button className="hidden md:flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <HelpCircle className="w-4 h-4" />
            Help
          </button>
          
          <button className="md:hidden flex items-center justify-center p-2 rounded-md hover:bg-accent text-accent-foreground">
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
