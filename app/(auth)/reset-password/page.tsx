"use client";

import { useEffect, useState } from "react";
import ResetPasswordModal from "../_components/ResetPasswordModal";

export default function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const token = searchParams.token as string | undefined;
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (token) {
      setIsModalOpen(true);
    }
  }, [token]);

  if (!token) {
    return (
      <div className="text-center p-8">
        <h1 className="text-xl text-red-500 font-semibold">
          Invalid or missing token
        </h1>
      </div>
    );
  }

  return (
    <div>
      <ResetPasswordModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {
          setIsModalOpen(false);
        }}
      />
    </div>
  );
}
