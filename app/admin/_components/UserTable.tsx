"use client";

import DeleteModal from "@/app/_components/DeleteModel";
import { handleDeleteUser } from "@/lib/actions/admin/user-actions";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

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
  const [searchTerm, setSearchTerm] = useState(search);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/admin/users?search=${searchTerm}`);
  };

  const [deleteId, setDeleteId] = useState(null);

  const onDelete = async () => {
    try {
      await handleDeleteUser(deleteId!);
      toast.success("User deleted successfully");
    } catch (err: Error | any) {
      toast.error(err.message || "Failed to delete User");
    } finally {
      setDeleteId(null);
    }
  };

  return (
    <div className="space-y-4">
      {/* DELETE MODAL */}
      <DeleteModal
        isOpen={deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={onDelete}
        title="Delete Confirmation"
        description="Are you sure you want to delete this item? This action cannot be undone."
      />

      <div className="flex items-center justify-between gap-4">
        {/* SEARCH */}
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search Users..."
            className="h-11 w-full max-w-sm
              rounded-lg
              border border-black/10 bg-[#FFF8F4]
              px-4 text-sm outline-none
              focus:border-[#E87A5D]"
          />

          <button
            type="submit"
            className="h-11 px-5
              rounded-lg
              bg-[#E87A5D] text-white
              text-sm font-medium
              hover:opacity-90 transition"
          >
            Search
          </button>
        </form>

        {/* CREATE USER */}
        <Link
          href="/admin/users/create"
          className="h-11 px-6
            rounded-lg
            flex items-center gap-2
           text-black
            text-sm font-medium
            hover:bg-black/90 transition"
        >
          + Create User
        </Link>
      </div>



      {/* TABLE CARD */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[#E87A5D] text-white text-xs uppercase">
              <tr>
                <th className="px-6 py-3">ID</th>
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Email</th>
                <th className="px-6 py-3">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {users.map((user) => (
                <tr
                  key={user._id}
                  className="hover:bg-gray-50 transition"
                >
                  <td className="px-6 py-4 text-xs text-gray-500">
                    {user._id}
                  </td>

                  <td className="px-6 py-4 font-medium text-gray-900">
                    {user.name}
                  </td>

                  <td className="px-6 py-4 text-gray-700">
                    {user.email}
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2">
                      <Link
                        href={`/admin/users/${user._id}`}
                        className="px-3 py-1.5 rounded-full text-xs
                          border border-gray-300 text-gray-700
                          hover:bg-gray-100 transition"
                      >
                        View
                      </Link>

                      <Link
                        href={`/admin/users/${user._id}/edit`}
                        className="px-3 py-1.5 rounded-full text-xs
                          border border-[#E87A5D] text-[#E87A5D]
                          hover:bg-[#E87A5D]/10 transition"
                      >
                        Edit
                      </Link>

                      <button
                        onClick={() => setDeleteId(user._id)}
                        className="
                          ml-2 inline-flex items-center gap-1
                          px-3 py-1.5 text-xs font-semibold
                          text-red-600 border border-red-500
                          rounded-full
                          hover:bg-red-500 hover:text-white
                          transition-all duration-200
                          focus:outline-none focus:ring-2 focus:ring-red-400
                        "
                      >
                        Delete
                      </button>

                    </div>
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
                  className="px-3 py-1.5 rounded-full border text-sm
                    hover:bg-gray-100 transition"
                  href={`/admin/users?page=${pagination.page - 1}&size=${pagination.size}&search=${search}`}
                >
                  Previous
                </Link>
              )}

              {pagination.page < pagination.totalPages && (
                <Link
                  className="px-3 py-1.5 rounded-full border text-sm
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
    </div>
  );
}
