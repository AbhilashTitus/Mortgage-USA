import Image from 'next/image';
import Link from 'next/link';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center">
            <Image 
              src="/Logo.png" 
              alt="The Mortgage Calculator App" 
              width={250} 
              height={50} 
              className="h-10 w-auto object-contain"
              priority
            />
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-[15px] font-medium text-slate-700">
          <Link href="#" className="hover:text-primary transition-colors">About Us</Link>
          <Link href="#" className="hover:text-primary transition-colors">Calculators</Link>
          <Link href="#" className="hover:text-primary transition-colors">Contact</Link>
          <Link href="#" className="hover:text-primary transition-colors">Login</Link>
        </nav>
      </div>
    </header>
  );
}
