"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import LoginForm from "@/app/(auth)/_components/LoginForm";
import RegisterForm from "@/app/(auth)/_components/RegisterForm";
import ResetPasswordModal from "@/app/(auth)/_components/ResetPasswordModal";

export default function Header() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isResetPasswordOpen, setIsResetPasswordOpen] = useState(false);

  return (
    <>
      <header className="w-full sticky top-0 z-50 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-1 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/images/logo_without_background.png"
              alt="Logo"
              width={32}
              height={32}
              priority
            />
            <h2 className="text-lg font-bold">MunchNearby</h2>
          </Link>

          <div className="flex gap-2">
            <button
              onClick={() => setIsLoginOpen(true)}
              className="hidden sm:flex items-center h-9 px-4 rounded-full font-bold hover:bg-orange-50 transition-colors text-gray-700"
            >
              Log In
            </button>

            <button
              onClick={() => setIsRegisterOpen(true)}
              className="flex items-center h-9 px-4 rounded-full bg-[#E87A5D] text-white font-bold hover:bg-orange-600 transition-colors shadow-sm"
            >
              Sign Up
            </button>
          </div>
        </div>
      </header>

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
    </>
  );
}
