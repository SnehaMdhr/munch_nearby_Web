"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Home,
  Map,
  Heart,
  User,
  LogOut,
  ChevronDown,
  KeyRound,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import ProfileForm from "../profile/_components/ProfileForm";
import ChangePasswordModal from "@/app/_components/ChangePasswordModel";

type NavItemProps = {
  href: string;
  icon: React.ReactNode;
  label: string;
  pathname: string;
};

export default function Header() {
  const { user, logout, checkAuth } = useAuth();
  const pathname = usePathname();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  const getProfileImageSrc = (imageUrl?: string) => {
    if (!imageUrl) return null;

    const normalizedPath = imageUrl.replace(/\\/g, "/");

    if (
      normalizedPath.startsWith("http://") ||
      normalizedPath.startsWith("https://")
    ) {
      return normalizedPath;
    }

    const apiBase =
      process.env.NEXT_PUBLIC_API_BASE ||
      process.env.NEXT_PUBLIC_API_BASE_URL ||
      "";

    if (!apiBase) return normalizedPath;

    const base = apiBase.endsWith("/") ? apiBase.slice(0, -1) : apiBase;
    const path = normalizedPath.startsWith("/")
      ? normalizedPath
      : `/${normalizedPath}`;

    return `${base}${path}`;
  };

  const profileImageSrc = getProfileImageSrc(user?.imageUrl);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setDropdownOpen(false);
  }, [pathname]);

  useEffect(() => {
    function handleEsc(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setShowProfileModal(false);
        setShowChangePasswordModal(false);
      }
    }

    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, []);

  return (
    <>
      <header className="w-full sticky top-0 z-3000 bg-white border-b border-gray-200">
        <div className="w-full px-8 py-2 flex items-center justify-between">
          {/* LEFT - Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/images/logo_without_background.png"
              alt="MunchNearby logo"
              width={32}
              height={32}
              priority
            />
            <h2 className="text-lg font-bold tracking-tight">MunchNearby</h2>
          </Link>

          {/* RIGHT SECTION - Navigation + Profile */}
          <div className="flex items-center gap-6 ml-auto">
            <nav className="flex items-center gap-4">
              <NavItem
                href="/customer/dashboard"
                icon={<Home size={15} />}
                label="Home"
                pathname={pathname}
              />
              <NavItem
                href="/customer/map"
                icon={<Map size={15} />}
                label="Map"
                pathname={pathname}
              />
              <NavItem
                href="/customer/favourites"
                icon={<Heart size={15} />}
                label="Favorites"
                pathname={pathname}
              />
            </nav>

            <div className="h-8 w-px bg-gray-200 mx-2 hidden sm:block" />

            {/* Profile Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-3 bg-gray-100 hover:bg-gray-200 transition px-2 py-1 rounded-lg"
              >
                <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center bg-[#E87A5D] text-white font-semibold">
                  {profileImageSrc ? (
                    <Image
                      src={profileImageSrc}
                      alt="Profile"
                      width={40}
                      height={40}
                      unoptimized
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    user?.name?.charAt(0).toUpperCase() || "U"
                  )}
                </div>

                <div className="text-left hidden sm:block">
                  <p className="text-sm font-semibold text-gray-800">
                    {user?.name?.split(" ")[0] || "User"}
                  </p>
                </div>

                <ChevronDown size={16} className="text-gray-600" />
              </button>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 z-3100 w-48 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      setShowProfileModal(true);
                    }}
                    className="flex items-center gap-2 w-full px-4 py-3 text-sm hover:bg-gray-100 text-gray-700"
                  >
                    <User size={16} />
                    Profile
                  </button>

                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      setShowChangePasswordModal(true);
                    }}
                    className="flex items-center gap-2 w-full px-4 py-3 text-sm hover:bg-gray-100 text-gray-700"
                  >
                    <KeyRound size={16} />
                    Change Password
                  </button>

                  <button
                    onClick={logout}
                    className="flex items-center gap-2 w-full px-4 py-3 text-sm text-red-500 hover:bg-gray-100 border-t border-gray-100"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* PROFILE MODAL */}
      {showProfileModal && (
        <div
          className="fixed inset-0 z-4000 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          onClick={() => setShowProfileModal(false)}
        >
          <div
            className="bg-white w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-xl relative p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowProfileModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-black text-lg"
            >
              ✕
            </button>

            <ProfileForm
              user={user}
              onSuccess={async () => {
                await checkAuth();
                setShowProfileModal(false);
              }}
              onCancel={() => setShowProfileModal(false)}
            />
          </div>
        </div>
      )}

      {/* CHANGE PASSWORD MODAL */}
      <ChangePasswordModal
        isOpen={showChangePasswordModal}
        onClose={() => setShowChangePasswordModal(false)}
      />
    </>
  );
}

function NavItem({ href, icon, label, pathname }: NavItemProps) {
  const isActive = pathname === href || pathname.startsWith(href + "/");

  return (
    <Link
      href={href}
      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
        isActive ? "bg-[#E87A5D] text-white" : "text-gray-600 hover:bg-gray-100"
      }`}
    >
      {icon}
      {label}
    </Link>
  );
}
