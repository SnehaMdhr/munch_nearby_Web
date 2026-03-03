"use client";

import { useState } from "react";
import { ArrowRight, MapPin, Utensils, Star } from "lucide-react";
import LoginForm from "../(auth)/_components/LoginForm";
import RegisterForm from "../(auth)/_components/RegisterForm";
import ResetPasswordModal from "../(auth)/_components/ResetPasswordModal";

export default function Page() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isResetPasswordOpen, setIsResetPasswordOpen] = useState(false);

  return (
    <main className="bg-linear-to-b from-white to-[#fffaf5]">
      <section className="max-w-7xl mx-auto px-4 md:px-10 py-16 md:py-24">
        <div className="flex flex-col-reverse lg:flex-row gap-16 items-center">
          <div className="flex-1 text-center lg:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight">
              Discover Local <span className="text-[#E87A5D]">Flavors</span> at
              Your Fingertips
            </h1>

            <p className="mt-6 text-lg text-[#6b5848] max-w-lg">
              Explore menus, read honest reviews, and find the best restaurants
              around you in seconds.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => setIsLoginOpen(true)}
                className="flex items-center justify-center h-12 px-8 rounded-full bg-[#E87A5D] text-white font-bold hover:bg-orange-600 transition-all shadow-lg shadow-orange-200"
              >
                Get Started
                <ArrowRight className="w-4 h-4 ml-2" />
              </button>
            </div>
          </div>

          <div className="flex-1 relative w-full">
            <div className="relative aspect-4/3 rounded-2xl overflow-hidden shadow-2xl">
              <div
                className="absolute inset-0 bg-cover bg-center bg-gray-100"
                style={{
                  backgroundImage:
                    "url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80')",
                }}
              />
            </div>
          </div>
        </div>
      </section>
      \
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
                className="p-6 rounded-2xl bg-[#fffaf5] border border-[#e8dbce] text-center hover:-translate-y-1 transition shadow-sm"
              >
                <div className="w-14 h-14 mx-auto mb-6 rounded-full bg-orange-100 flex items-center justify-center text-[#E87A5D]">
                  <f.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-[#2a2016]">
                  {f.title}
                </h3>
                <p className="text-[#6b5848]">{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      \
      <LoginForm
        isModal={true}
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        switchToRegister={() => {
          setIsLoginOpen(false);
          setIsRegisterOpen(true);
        }}
        switchToResetPassword={() => {
          setIsLoginOpen(false);
          setIsResetPasswordOpen(true);
        }}
      />
      \
      <RegisterForm
        isModal={true}
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        onSuccess={() => {
          setIsRegisterOpen(false);
          setIsLoginOpen(true);
        }}
        switchToLogin={() => {
          setIsRegisterOpen(false);
          setIsLoginOpen(true);
        }}
      />
      <ResetPasswordModal
        isOpen={isResetPasswordOpen}
        onClose={() => setIsResetPasswordOpen(false)}
        onSuccess={() => {
          setIsResetPasswordOpen(false);
          setIsLoginOpen(true);
        }}
        switchToLogin={() => {
          setIsResetPasswordOpen(false);
          setIsLoginOpen(true);
        }}
      />
    </main>
  );
}
