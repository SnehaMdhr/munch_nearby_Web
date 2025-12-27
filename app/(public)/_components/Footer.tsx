import Image from "next/image";
export default function Footer() {
    return (
        <footer className="sticky top-0 z-50 backdrop-blur color-black border-b border-white/10 dark:border-black/10">
            <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Global">
                <div className="flex h-16 items-center justify-between md:grid md:grid-cols-[1fr_auto_1fr] w-full">
                    {/* Left: Logo */}
                    <div className="flex items-center gap-2">
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
                    </div>
                    <div className="flex items-center gap-2 md:justify-self-end">
                        <div className="hidden sm:flex items-center gap-2">
                            <span className="text-base font-semibold tracking-tight text-[#6b5848] group-hover:opacity-80 transition-opacity">
                                @2025 Munch Nearby. All rights reserved.
                            </span>
                        </div>
                    </div>
                </div>
            </nav>
        </footer>
    );
}