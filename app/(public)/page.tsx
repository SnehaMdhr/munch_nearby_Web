export default function Page() {
    return (
    
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-4 md:px-10 py-16 md:py-24">
          <div className="flex flex-col-reverse lg:flex-row gap-16 items-center">
            {/* Text */}
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 dark:bg-orange-900/30 text-primary text-xs font-bold mb-4">
                <span className="material-symbols-outlined text-sm">
                  local_fire_department
                </span>
                New in Town?
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight">
                Discover Local{" "}
                <span className="text-primary">Flavors</span> at Your Fingertips
              </h1>

              <p className="mt-6 text-lg text-[#6b5848] dark:text-[#b0a090] max-w-lg">
                Explore menus, read honest reviews, and find the best restaurants
                around you in seconds.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <button className="h-12 px-8 rounded-xl bg-primary text-white font-bold flex items-center gap-2 hover:bg-orange-600">
                  Get Started
                  <span className="material-symbols-outlined text-sm">
                    arrow_forward
                  </span>
                </button>

                <button className="h-12 px-8 rounded-xl border border-[#e8dbce] dark:border-[#524133] font-bold hover:bg-[#fcfaf8] dark:hover:bg-[#2f241a]">
                  Browse as Guest
                </button>
              </div>

              <p className="mt-6 text-sm text-[#9c7349] dark:text-[#8a7565]">
                Join 2,000+ foodies nearby
              </p>
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
        <section className="bg-white dark:bg-[#2a2016] py-20">
          <div className="max-w-7xl mx-auto px-4 md:px-10">
            <div className="text-center mb-14">
              <h2 className="text-3xl font-black mb-4">Why MunchNearby?</h2>
              <p className="text-[#6b5848] dark:text-[#b0a090]">
                Everything you need to satisfy cravings.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: "location_on",
                  title: "Find Nearby",
                  text: "Locate the best spots around the corner.",
                },
                {
                  icon: "restaurant_menu",
                  title: "View Menus",
                  text: "Browse menus with prices & photos.",
                },
                {
                  icon: "reviews",
                  title: "Rate & Review",
                  text: "Share experiences with the community.",
                },
              ].map((f) => (
                <div
                  key={f.title}
                  className="p-6 rounded-2xl bg-background-light dark:bg-[#221910] border border-[#e8dbce] dark:border-[#3a2d21] text-center hover:-translate-y-1 transition"
                >
                  <div className="w-14 h-14 mx-auto mb-6 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-3xl">
                      {f.icon}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold mb-2">{f.title}</h3>
                  <p className="text-[#6b5848] dark:text-[#b0a090]">
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