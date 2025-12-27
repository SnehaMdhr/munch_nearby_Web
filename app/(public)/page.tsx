import { ArrowRight,  MapPin, Utensils, Star  } from "lucide-react";
import Link from "next/link";
export default function Page() {
    return (
    
      <main className=" from-white to-[#fffaf5]">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-4 md:px-10 py-16 md:py-24 ">
          <div className="flex flex-col-reverse lg:flex-row gap-16 items-center">
            {/* Text */}
            <div className="flex-1 text-center lg:text-left">

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight">
                Discover Local{" "}
                <span className="text-primary text-[#E87A5D] ">Flavors</span> at Your Fingertips
              </h1>

              <p className="mt-6 text-lg text-[#6b5848] dark:text-[#b0a090] max-w-lg">
                Explore menus, read honest reviews, and find the best restaurants
                around you in seconds.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Link
                  href="/login"
                  className="flex items-center h-9 px-4 rounded-full bg-[#E87A5D] text-white font-bold hover:bg-orange-600 transition-colors"
                >
                  Get Started
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
            </div>

            {/* Image */}
            <div className="flex-1 relative w-full">
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{
                    backgroundImage:
                      "url('https://lh3.googleusercontent.com/aida-public/AB6AXuANQELtgjBU2ENq29_C6fTLLvrrVImZONx0wy1_11p4S2K-BFAFpixcFcnvq08IdNxIE0A2l1MTaGVaIOqnDPVN-3Ah1gIQOWF-D-E366nFGvg_QQcp8Sv9ohF3TVB2W8VmqrYj2tBxmg_D9-HWnJWA4VaiVniSlJx9KIVavILtH8baqC57a01VAfrGbzgy6kyOkeufE_auj_XZV_s2TxzQWUn_m1SSSqfrxR29Ru_Jy6X6driXf8J-J2hB4hIZRJIETIB-3O-Ba4gq')",
                  }}
                />
              </div>
            </div>
          </div>
        </section>

       {/* Features */}
        <section className="bg-white py-20">
          <div className="max-w-7xl mx-auto px-4 md:px-10">
            <div className="text-center mb-14">
              <h2 className="text-3xl font-black mb-4 text-[#2a2016]">
                Why MunchNearby?
              </h2>
              <p className="text-[#6b5848]">
                Everything you need to satisfy cravings.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: MapPin,
                  title: "Find Nearby",
                  text: "Locate the best spots around the corner.",
                },
                {
                  icon: Utensils,
                  title: "View Menus",
                  text: "Browse menus with prices & photos.",
                },
                {
                  icon: Star,
                  title: "Rate & Review",
                  text: "Share experiences with the community.",
                },
              ].map((f) => (
                <div
                  key={f.title}
                  className="p-6 rounded-2xl bg-[#fffaf5] border border-[#e8dbce] text-center hover:-translate-y-1 transition"
                >
                  <div className="w-14 h-14 mx-auto mb-6 rounded-full bg-orange-100 flex items-center justify-center text-primary">
                    <f.icon className="w-7 h-7" />
                  </div>

                  <h3 className="text-xl font-bold mb-2 text-[#2a2016]">
                    {f.title}
                  </h3>
                  <p className="text-[#6b5848]">
                    {f.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

    );
}