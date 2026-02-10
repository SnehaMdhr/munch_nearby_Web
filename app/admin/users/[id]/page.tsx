import { handleGetOneUser } from "@/lib/actions/admin/user-actions";
import Link from "next/link";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const response = await handleGetOneUser(id);

  if (!response.success) {
    throw new Error(response.message || "Failed to load user");
  }

  const user = response.data;

  return (
    <div className="max-w-2xl mx-auto p-6">
      {/* Header actions */}
      <div className="flex items-center justify-between mb-6">
        <Link
          href="/admin/users"
          className="text-sm font-medium text-[#E87A5D] hover:underline"
        >
          ← Back to Users
        </Link>

        <Link
            href={`/admin/users/${id}/edit`}
            className="
                h-9 px-4 rounded-lg
                bg-[#E87A5D] text-white
                text-sm font-medium
                hover:opacity-90 transition
                flex items-center justify-center
            "
            >
            Edit User
        </Link>

      </div>

      {/* Card */}
      <div
        className="
          bg-[#FFF8F4]
          border border-black/10
          rounded-xl
          shadow-sm
          p-6
        "
      >
        <h1 className="text-xl font-semibold mb-4 text-gray-900">
          User Details
        </h1>

        <div className="space-y-3 text-sm">
          <p>
            <span className="text-gray-500 font-medium">Name:</span>{" "}
            <span className="text-gray-900 font-medium">
              {user.name || "—"}
            </span>
          </p>

          <p>
            <span className="text-gray-500 font-medium">Email:</span>{" "}
            <span className="text-gray-900 font-medium">
              {user.email}
            </span>
          </p>

          <p className="flex items-center gap-2">
            <span className="text-gray-500 font-medium">Role:</span>
            <span
              className="
                inline-flex items-center
                px-2 py-1
                rounded-md
                text-xs font-medium
                bg-[#E87A5D]/10
                text-[#E87A5D]
              "
            >
              {user.role}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
