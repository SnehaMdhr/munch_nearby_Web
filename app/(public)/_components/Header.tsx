import Link from "next/link";

export default function Header() {
    return (
         <header className="sticky top-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b border-black/10 dark:border-white/10">
            <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Global">
                <div className="flex h-16 items-center justify-between md:grid md:grid-cols-[1fr_auto_1fr] w-full">
                    {/* Left: Logo */}
                    <div className="flex items-center gap-2">
                            <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-foreground">
                                <img
                                src="/logo_without_background.png"
                                alt="Munch logo"
                                className="h-6 w-6 object-contain"
                                />
                            </span>
                            <span className="text-base font-semibold tracking-tight group-hover:opacity-80 transition-opacity">
                                Munch Nearby
                            </span>
                    </div>

                    {/* Right: Auth + Mobile Toggle */}
                    <div className="flex items-center gap-2 md:justify-self-end">
                        <div className="hidden sm:flex items-center gap-2">
                            <Link
                                href="/login"
                                className="h-9 px-3 inline-flex items-center justify-center rounded-md border border-black/10 dark:border-white/15 text-sm font-medium hover:bg-foreground/5 transition-colors"
                            >
                                Log in
                            </Link>
                            <Link
                                href="/register"
                                className="h-9 px-3 inline-flex items-center justify-center rounded-md bg-foreground text-background text-sm font-semibold hover:opacity-90 transition-opacity"
                            >
                                Sign up
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>
        </header>
    );
}