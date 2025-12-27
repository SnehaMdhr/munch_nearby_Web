import Image from "next/image";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <section className="min-h-screen">
      <div className="grid min-h-screen md:grid-cols-2">

        <div className="relative hidden md:block">
          <Image
            src="/images/auth.png"
            alt="Welcome illustration"
            fill
            priority
            className="object-cover"
          />
        </div>

        <div className="flex items-center justify-center px-4 md:px-10">
          <div className="w-full rounded-xl p-6 bg-white">
            {children}
          </div>
        </div>

      </div>
    </section>
  );
}
