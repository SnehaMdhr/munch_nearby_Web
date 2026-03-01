"use client";

import DeleteModal from "@/app/_components/DeleteModel";
import { handleDeleteUser } from "@/lib/actions/admin/user-actions";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import {
  Eye,
  Edit2,
  Trash2,
  Search,
  Plus,
  User as UserIcon,
} from "lucide-react";
import CreateUserForm from "./CreateUserForm";
import UpdateUserForm from "./UpdateUserForm";
import ViewUserForm from "./ViewUserForm";

interface User {
  _id: string;
  name?: string;
  email: string;
  role?: string;
  imageUrl?: string;
}

interface Pagination {
  page?: number;
  currentPage?: number;
  size?: number;
  total?: number;
  pages?: number;
  totalPages?: number;
}

export default function UserTable({
  users,
  pagination,
  search,
  basePath = "/admin/users",
  tabParam,
}: {
  users: User[];
  pagination: Pagination;
  search: string;
  basePath?: string;
  tabParam?: string;
}) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState(search);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [viewUser, setViewUser] = useState<User | null>(null);

  const isInitialMount = useRef(true);
  const currentPage = pagination?.page ?? pagination?.currentPage ?? 1;
  const totalPages = pagination?.pages ?? pagination?.totalPages ?? 1;

  // Helper to create the URL for pagination and search
  const createUrl = (page?: number, nextSearch?: string) => {
    const params = new URLSearchParams();
    if (tabParam) params.set("tab", tabParam);
    if (typeof page === "number") params.set("page", String(page));
    if (pagination?.size) params.set("size", String(pagination.size));

    if (nextSearch !== undefined) {
      if (nextSearch) params.set("search", nextSearch);
    } else if (search) {
      params.set("search", search);
    }

    const queryString = params.toString();
    return queryString ? `${basePath}?${queryString}` : basePath;
  };

  // Debounced search logic
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    const delayDebounceFn = setTimeout(() => {
      router.push(createUrl(1, searchTerm));
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, router]);

  const onDelete = async () => {
    if (!deleteId) return;
    try {
      await handleDeleteUser(deleteId);
      toast.success("User deleted successfully");
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete User");
    } finally {
      setDeleteId(null);
    }
  };

  return (
    <div className="space-y-6">
      <DeleteModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={onDelete}
        title="Delete User"
        description="Are you sure you want to delete this user? This action is permanent."
      />

      {/* SEARCH + CREATE SECTION */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 rounded-2xl shadow-sm border border-gray-100 bg-white">
        <div className="relative flex w-full flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name or email..."
            className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-[#E87A5D]/20 focus:border-[#E87A5D] transition-all"
          />
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="inline-flex h-11 items-center gap-2 px-6 bg-linear-to-r from-[#E87A5D] to-[#F6B88F] text-white font-bold rounded-xl hover:opacity-90 transition-all shadow-lg shadow-orange-200"
        >
          <Plus className="w-5 h-5" />
          Add New User
        </button>
      </div>

      {/* MODALS */}
      <CreateUserForm
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={() => {
          router.refresh();
          setIsCreateModalOpen(false);
        }}
      />

      {editUser && (
        <UpdateUserForm
          user={editUser}
          isOpen={!!editUser}
          onClose={() => setEditUser(null)}
          onSuccess={() => {
            router.refresh();
            setEditUser(null);
          }}
        />
      )}

      {viewUser && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="absolute inset-0" onClick={() => setViewUser(null)} />
          <div className="relative w-full max-w-3xl my-auto bg-white rounded-3xl shadow-2xl border border-orange-100">
            <ViewUserForm
              id={viewUser._id}
              user={viewUser}
              showNavigation={false}
              onClose={() => setViewUser(null)}
            />
          </div>
        </div>
      )}

      {/* TABLE CARD */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="px-6 py-4 text-[11px] font-black text-gray-400 uppercase tracking-widest">
                  User Info
                </th>
                <th className="px-6 py-4 text-[11px] font-black text-gray-400 uppercase tracking-widest">
                  Contact
                </th>
                <th className="px-6 py-4 text-[11px] font-black text-gray-400 uppercase tracking-widest">
                  Role
                </th>
                <th className="px-6 py-4 text-[11px] font-black text-gray-400 uppercase tracking-widest text-right">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-50">
              {users.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="text-center py-20 text-gray-400 italic"
                  >
                    No users found matching "{searchTerm}"
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr
                    key={user._id}
                    className="group hover:bg-[#FFF8F4]/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {/* DYNAMIC AVATAR */}
                        <div className="h-10 w-10 rounded-full border-2 border-orange-100 overflow-hidden bg-orange-50 shrink-0 relative">
                          {user.imageUrl ? (
                            <img
                              src={`${process.env.NEXT_PUBLIC_API_BASE}${user.imageUrl}`}
                              alt={user.name || "User"}
                              className="h-full w-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src =
                                  `https://ui-avatars.com/api/?name=${user.name || "U"}&background=FFEDD5&color=E87A5D`;
                              }}
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-[#E87A5D]">
                              <UserIcon className="h-5 w-5" />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 text-sm leading-tight">
                            {user.name || "Anonymous"}
                          </p>
                          <p className="text-[10px] text-gray-400 font-mono tracking-tighter mt-0.5 uppercase">
                            ID: {user._id.slice(-8)}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-600 font-medium">
                      {user.email}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                          user.role === "admin"
                            ? "bg-purple-50 text-purple-600 border border-purple-100"
                            : "bg-blue-50 text-blue-600 border border-blue-100"
                        }`}
                      >
                        {user.role || "Customer"}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end items-center gap-3">
                        <button
                          type="button"
                          onClick={() => setViewUser(user)}
                          className="p-2 text-gray-400 hover:text-[#E87A5D] hover:bg-orange-50 rounded-xl transition-all"
                        >
                          <Eye className="h-4 w-4" />
                        </button>

                        <button
                          onClick={() => setEditUser(user)}
                          className="p-2 text-blue-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>

                        <button
                          onClick={() => setDeleteId(user._id)}
                          className="p-2.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION SECTION */}
        {pagination && (pagination.pages ?? pagination.totalPages ?? 0) > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50/30">
            <p className="text-xs text-gray-500 font-medium">
              Page{" "}
              <span className="text-gray-900 font-bold">{currentPage}</span> of{" "}
              {totalPages}
            </p>
            <div className="flex gap-2">
              <Link
                className={`px-4 py-2 rounded-xl border text-xs font-bold transition-all ${
                  currentPage > 1
                    ? "bg-white text-gray-700 hover:border-orange-200 hover:text-[#E87A5D]"
                    : "bg-gray-100 text-gray-300 pointer-events-none"
                }`}
                href={createUrl(currentPage - 1, searchTerm)}
              >
                Previous
              </Link>
              <Link
                className={`px-4 py-2 rounded-xl border text-xs font-bold transition-all ${
                  currentPage < totalPages
                    ? "bg-white text-gray-700 hover:border-orange-200 hover:text-[#E87A5D]"
                    : "bg-gray-100 text-gray-300 pointer-events-none"
                }`}
                href={createUrl(currentPage + 1, searchTerm)}
              >
                Next
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
