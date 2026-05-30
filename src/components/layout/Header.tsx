import Image from 'next/image';
import Link from 'next/link';

export function Header() {
  return (
    <header className="hidden lg:block sticky top-0 z-50 w-full border-b border-slate-200/60 bg-white/70 backdrop-blur-xl shadow-sm">
      <div className="w-full pl-4 sm:pl-7 pr-4 sm:pr-6 lg:pr-8 h-14 sm:h-16 lg:h-20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center">
            <Image 
              src="/Logo.png" 
              alt="The Mortgage Calculator App" 
              width={400} 
              height={80} 
              className="max-h-10 sm:max-h-12 lg:max-h-16 w-auto object-contain"
              priority
            />
          </Link>
        </div>

        <nav className="hidden lg:flex items-center gap-8 text-[15px] font-medium text-slate-700">
          <Link href="/login" className="relative px-6 py-2.5 rounded-xl font-medium text-[15px] text-white bg-gradient-to-b from-[#005a9e] to-[#003087] shadow-sm hover:shadow-md transition-all duration-300 ring-1 ring-inset ring-white/20 hover:-translate-y-0.5 overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="relative z-10 tracking-wide">Login</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}

