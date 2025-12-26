import Link from "next/link";
import Image from "next/image";

export default function Header() {
  return (
    <header className="w-full sticky top-0 z-50 bg-background-light bg-white dark:bg-background-dark">
      <div className="max-w-7xl mx-auto px-4 md:px-2 py-1 flex items-center justify-between">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/images/logo_without_background.png"
            alt="MunchNearby logo"
            width={32}
            height={32}
            priority
            className="object-contain"
          />
          <h2 className="text-lg font-bold tracking-tight">
            MunchNearby
          </h2>
        </Link>

        {/* Actions */}
        <div className="flex gap-2">
          <Link
            href="/login"
            className="hidden sm:flex items-center h-9 px-4 rounded-full font-bold hover:dark:bg-orange-900/30 transition-colors"
          >
            Log In
          </Link>

          <Link
            href="/register"
            className="flex items-center h-9 px-4 rounded-full bg-[#E87A5D] text-white font-bold hover:bg-orange-600 transition-colors"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </header>
  );
}
