import Link from "next/link";

const resolveImageSrc = (imageValue?: string) => {
  if (!imageValue) return null;

  const normalizedPath = imageValue.replace(/\\/g, "/");
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

interface ViewUserFormProps {
  id: string;
  user: {
    imageUrl?: string;
    name?: string;
    email?: string;
    role?: string;
  };
  showNavigation?: boolean;
  onClose?: () => void;
}

export default function ViewUserForm({
  id,
  user,
  showNavigation = true,
  onClose,
}: ViewUserFormProps) {
  const imageSrc = resolveImageSrc(user.imageUrl);

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        {showNavigation ? (
          <Link
            href="/admin/users"
            className="text-sm font-medium text-[#E87A5D] hover:underline"
          >
            ← Back to Users
          </Link>
        ) : (
          <p className="text-sm font-medium text-gray-500">User Preview</p>
        )}

        <div className="flex items-center gap-2">
          {showNavigation && (
            <Link
              href={`/admin/users/${id}/edit`}
              className="h-9 px-4 rounded-lg bg-[#E87A5D] text-white text-sm font-medium hover:opacity-90 transition flex items-center justify-center"
            >
              Edit User
            </Link>
          )}

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="h-9 px-3 rounded-lg bg-slate-100 text-slate-600 text-sm font-medium hover:bg-slate-200 transition"
            >
              Close
            </button>
          )}
        </div>
      </div>

      <div className="bg-[#FFF8F4] border border-black/10 rounded-xl shadow-sm p-6">
        <h1 className="text-xl font-semibold mb-4 text-gray-900">
          User Details
        </h1>

        <div className="mb-5 flex items-center gap-3">
          <div className="h-14 w-14 rounded-full border border-orange-100 overflow-hidden bg-orange-50 shrink-0">
            {imageSrc ? (
              <img
                src={imageSrc}
                alt={user.name || "User"}
                className="h-full w-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    `https://ui-avatars.com/api/?name=${user.name || "U"}&background=FFEDD5&color=E87A5D`;
                }}
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center text-[#E87A5D] font-bold">
                {(user.name || "U").charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div>
            <p className="text-sm text-gray-500">Profile Photo</p>
            <p className="text-xs text-gray-400">Stored user avatar</p>
          </div>
        </div>

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
              {user.email || "—"}
            </span>
          </p>

          <p className="flex items-center gap-2">
            <span className="text-gray-500 font-medium">Role:</span>
            <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-[#E87A5D]/10 text-[#E87A5D]">
              {user.role || "—"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
