"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Home, Map, Heart, User, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";


// -------- Types --------
type MenuItemProps = {
  href: string;
  icon: React.ReactNode;
  label: string;
  pathname: string;
};

// -------- Sidebar --------
export default function Sidebar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  return (
    <aside className="w-64 h-screen bg-white border-r border-gray-200 flex flex-col justify-between">
      {/* Top */}
      <div>
        {/* Logo */}
        <div className="px-6 py-6">
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
        </div>

        {/* Menu */}
        <nav className="mt-6 flex flex-col gap-2 px-4">
          <MenuItem
            href="/customer/dashboard"
            icon={<Home size={18} />}
            label="Home"
            pathname={pathname}
          />
          <MenuItem
            href="/customer/map"
            icon={<Map size={18} />}
            label="Map"
            pathname={pathname}
          />
          <MenuItem
            href="/customer/favourites"
            icon={<Heart size={18} />}
            label="Favorites"
            pathname={pathname}
          />
          <MenuItem
            href="/customer/profile"
            icon={<User size={18} />}
            label="Profile"
            pathname={pathname}
          />
        </nav>
      </div>

      {/* Bottom */}
      <div className="px-6 py-6 flex justify-center">
        <button
          onClick={logout}
          disabled={!user}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm font-medium
          text-white bg-[#E87A5D] justify-center hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>

    </aside>
  );
}

// -------- Menu Item --------
function MenuItem({ href, icon, label, pathname }: MenuItemProps) {
  const isActive = pathname === href || pathname.startsWith(href + "/");

  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors duration-200
        ${
          isActive
            ? "bg-[#E87A5D] text-white"
            : "text-gray-600 hover:bg-gray-100"
        }`}
    >
      {icon}
      {label}
    </Link>
  );
}
