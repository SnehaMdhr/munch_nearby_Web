"use client";

import { useAuth } from "@/context/AuthContext";
import Sidebar from "../_components/SideBar";

export default function Page() {
  const { user } = useAuth();

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-6">
        <h1 className="text-xl font-semibold">HomePage</h1>

        {user ? (
          <p className="mt-2 text-gray-600">
            Welcome, {user.email}
          </p>
        ) : (
          <p className="mt-2 text-gray-400">
            Loading user...
          </p>
        )}
      </div>
    </div>
  );
}
