"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function UserTable({
  users,
  pagination,
  search,
}: {
  users: any[];
  pagination: any;
  search: string;
}) {
  const router = useRouter();

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
         <thead className="bg-[#E87A5D] text-white text-xs uppercase">
            <tr>
                <th className="px-6 py-3">ID</th>
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Email</th>
            </tr>
            </thead>

          <tbody className="divide-y">
            {users.map((user) => (
              <tr
                key={user._id}
                className="hover:bg-gray-50 transition"
              >
                <td className="px-6 py-4 text-gray-500 text-xs">
                  {user._id}
                </td>

                <td className="px-6 py-4 font-medium text-gray-900">
                  {user.name}
                </td>

                <td className="px-6 py-4 text-gray-700">
                  {user.email}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      {pagination && (
        <div className="flex items-center justify-between px-6 py-4 border-t bg-gray-50">
          <div className="text-sm text-gray-600">
            Page <span className="font-medium">{pagination.page}</span> of{" "}
            <span className="font-medium">{pagination.totalPages}</span>
          </div>

          <div className="flex gap-2">
            {pagination.page > 1 && (
              <Link
                className="px-3 py-1.5 border rounded-md text-sm
                  hover:bg-gray-100 transition"
                href={`/admin/users?page=${pagination.page - 1}&size=${pagination.size}&search=${search}`}
              >
                Previous
              </Link>
            )}

            {pagination.page < pagination.totalPages && (
              <Link
                className="px-3 py-1.5 border rounded-md text-sm
                  hover:bg-gray-100 transition"
                href={`/admin/users?page=${pagination.page + 1}&size=${pagination.size}&search=${search}`}
              >
                Next
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
