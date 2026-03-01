"use client";

import { useMemo, useState, useTransition } from "react";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useAuth } from "@/context/AuthContext";

type TabKey = "users" | "approvals";

interface AdminTabSwitcherProps {
  usersContent: React.ReactNode;
  approvalsContent: React.ReactNode;
  initialTab?: TabKey;
}

export default function AdminTabSwitcher({
  usersContent,
  approvalsContent,
  initialTab = "users",
}: AdminTabSwitcherProps) {
  const [activeTab, setActiveTab] = useState<TabKey>(initialTab);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  // Destructure logout if your context provides it,
  // otherwise we use setIsAuthenticated/setUser manually.
  const { setIsAuthenticated, setUser, logout } = useAuth();

  const tabTitle = useMemo(
    () => (activeTab === "users" ? "User Management" : "Restaurant Management"),
    [activeTab],
  );

  const onLogout = () => {
    startTransition(async () => {
      try {
        if (logout) {
          await logout();
        } else {
          setIsAuthenticated(false);
          setUser(null);
        }

        router.push("/");
        router.refresh();
      } catch (error: any) {
        console.error("Logout Error:", error);
      }
    });
  };

  return (
    <div className="min-h-screen bg-[#FFF7ED] p-12">
      <div className="max-w-6xl mx-auto">
        {/* TOP HEADER SECTION */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black text-gray-800 tracking-tight">
              Admin <span className="text-[#E87A5D]">Dashboard</span>
            </h1>
            <p className="text-gray-500 font-medium">
              Manage users and account approvals.
            </p>
          </div>

          {/* RIGHT SIDE LOGOUT BUTTON */}
          <button
            onClick={onLogout}
            disabled={isPending}
            className="group flex items-center gap-2 px-5 py-2.5 rounded-full border border-red-100 bg-white text-red-600 font-bold text-sm hover:bg-red-600 hover:text-white transition-all shadow-sm active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <LogOut
              className={`w-4 h-4 transition-transform group-hover:-translate-x-1 ${isPending ? "animate-pulse" : ""}`}
            />
            {isPending ? "Logging out..." : "Logout"}
          </button>
        </div>

        {/* TAB NAVIGATION */}
        <div className="flex items-center gap-3 mb-8 border-b border-orange-200 pb-4">
          <button
            type="button"
            onClick={() => setActiveTab("users")}
            className={`px-6 py-2.5 rounded-xl font-bold transition-all duration-200 ${
              activeTab === "users"
                ? "bg-linear-to-r from-[#E87A5D] to-[#F6B88F] text-white shadow-md scale-105"
                : "border border-[#E87A5D]/30 text-[#E87A5D] bg-white hover:bg-[#FFF3EC]"
            }`}
          >
            User Management
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("approvals")}
            className={`px-6 py-2.5 rounded-xl font-bold transition-all duration-200 ${
              activeTab === "approvals"
                ? "bg-linear-to-r from-[#E87A5D] to-[#F6B88F] text-white shadow-md scale-105"
                : "border border-[#E87A5D]/30 text-[#E87A5D] bg-white hover:bg-[#FFF3EC]"
            }`}
          >
            Restaurant Management
          </button>
        </div>

        {/* INFO BANNER */}
        <div className="bg-orange-100 border-2 border-dashed border-orange-300 rounded-2xl p-8 text-center mb-8">
          <div className="inline-block p-3 rounded-2xl mb-4">
            <h2 className="text-xl font-black text-gray-800-700">{tabTitle}</h2>
          </div>
          <p className="text-gray-500 max-w-lg mx-auto leading-relaxed">
            {activeTab === "users"
              ? "Manage all users, search quickly, and handle account updates."
              : "Review and manage restaurant creation requests."}
          </p>
        </div>

        {/* DYNAMIC CONTENT AREA */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          {activeTab === "users" ? usersContent : approvalsContent}
        </div>
      </div>
    </div>
  );
}
