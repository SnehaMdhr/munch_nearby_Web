export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50 p-6 animate-pulse">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="rounded-2xl border bg-white p-6">
          <div className="h-7 w-56 rounded bg-gray-200" />
          <div className="mt-3 h-4 w-80 max-w-full rounded bg-gray-100" />
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-2xl border bg-white p-5">
              <div className="h-4 w-24 rounded bg-gray-200" />
              <div className="mt-4 h-8 w-16 rounded bg-gray-300" />
              <div className="mt-3 h-3 w-28 rounded bg-gray-100" />
            </div>
          ))}
        </div>

        {/* Main content */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Left section */}
          <div className="lg:col-span-2 rounded-2xl border bg-white p-6">
            <div className="h-5 w-40 rounded bg-gray-200" />
            <div className="mt-5 space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="rounded-xl border p-4">
                  <div className="h-4 w-48 rounded bg-gray-200" />
                  <div className="mt-3 h-3 w-full rounded bg-gray-100" />
                  <div className="mt-2 h-3 w-5/6 rounded bg-gray-100" />
                </div>
              ))}
            </div>
          </div>

          {/* Right section */}
          <div className="rounded-2xl border bg-white p-6">
            <div className="h-5 w-32 rounded bg-gray-200" />
            <div className="mt-5 space-y-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-10 rounded-lg bg-gray-100" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
