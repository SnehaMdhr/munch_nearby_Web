"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Tabs({ id }: { id: string }) {
  const pathname = usePathname();

  const isMenu = pathname === `/customer/dashboard/${id}/menu`;
  const isReviews = pathname === `/customer/dashboard/${id}/reviews`;

  return (
    <div className="px-4 flex border-b border-gray-300 py-4 w-full">
      <Link
        href={`/customer/dashboard/${id}/menu`}
        className={`flex-1 text-center py-2 rounded-full transition font-semibold ${
          isMenu
            ? "bg-[#E87A5D] text-white"
            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
        }`}
      >
        Menu
      </Link>

      <Link
        href={`/customer/dashboard/${id}/reviews`}
        className={`flex-1 text-center py-2 rounded-full transition font-semibold ${
          isReviews
            ? "bg-[#E87A5D] text-white"
            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
        }`}
      >
        Reviews
      </Link>
    </div>
  );
}