"use client";

import { X } from "lucide-react";

interface MenuModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export default function MenuModal({
  isOpen,
  onClose,
  children,
}: MenuModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="relative bg-white rounded-2xl shadow-xl max-h-[90vh] overflow-y-auto w-full max-w-2xl p-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-black"
        >
          <X size={20} />
        </button>

        {children}
      </div>
    </div>
  );
}