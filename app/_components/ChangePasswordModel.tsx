"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { handleChangePassword } from "@/lib/actions/auth-actions";
import { toast } from "react-toastify";
import { Eye, EyeOff } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const changePasswordSchema = z
  .object({
    oldPassword: z.string().min(6, "Old password is required"),
    newPassword: z
      .string()
      .min(8, "New password must be at least 8 characters"),
    confirmPassword: z.string().min(8, "Confirm password is required"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type ChangePasswordData = z.infer<typeof changePasswordSchema>;

export default function ChangePasswordModal({ isOpen, onClose }: Props) {
  const [isPending, startTransition] = useTransition();
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword1, setShowPassword1] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ChangePasswordData>({
    resolver: zodResolver(changePasswordSchema),
  });

  const onSubmit = (data: ChangePasswordData) => {
    startTransition(async () => {
      const res = await handleChangePassword(data);

      if (res.success) {
        toast.success("Password changed successfully!");
        reset();
        setTimeout(() => {
          onClose();
        }, 1500);
      } else {
        toast.error(res.message || "Failed to change password");
      }
    });
  };

  if (!isOpen) return null;

  const inputType = showPassword ? "text" : "password";

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-black text-lg"
        >
          ✕
        </button>

        <div className="mb-8 text-center">
          <h2 className="text-3xl font-black text-gray-800">
            Change <span className="text-[#E87A5D]">Password</span>
          </h2>
          <p className="text-sm text-gray-500 mt-2">
            Make your account Secure.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Old Password */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Old Password
            </label>
            <input
              type={inputType}
              placeholder="Enter old password"
              {...register("oldPassword")}
              className="h-11 w-full rounded-lg border border-black/10 bg-[#FFF8F4] pl-4 pr-10 text-sm outline-none focus:border-[#E87A5D]"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-9 text-gray-500"
            >
              {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
            </button>
            {errors.oldPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.oldPassword.message}
              </p>
            )}
          </div>

          {/* New Password */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-600 mb-1">
              New Password
            </label>
            <input
              type={inputType}
              placeholder="Enter new password"
              {...register("newPassword")}
              className="h-11 w-full rounded-lg border border-black/10 bg-[#FFF8F4] pl-4 pr-10 text-sm outline-none focus:border-[#E87A5D]"
            />
            <button
              type="button"
              onClick={() => setShowPassword1(!showPassword1)}
              className="absolute right-3 top-9 text-gray-500"
            >
              {showPassword1 ? <Eye size={18} /> : <EyeOff size={18} />}
            </button>
            {errors.newPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.newPassword.message}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Confirm Password
            </label>
            <input
              type={inputType}
              placeholder="Confirm new password"
              {...register("confirmPassword")}
              className="h-11 w-full rounded-lg border border-black/10 bg-[#FFF8F4] pl-4 pr-10 text-sm outline-none focus:border-[#E87A5D]"
            />
            <button
              type="button"
              onClick={() => setShowPassword2(!showPassword2)}
              className="absolute right-3 top-9 text-gray-500"
            >
              {showPassword2 ? <Eye size={18} /> : <EyeOff size={18} />}
            </button>
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-gray-300 text-gray-600 hover:bg-gray-100"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isPending}
              className="px-6 py-2.5 bg-linear-to-r from-[#E87A5D] to-[#F6B88F] text-white font-bold rounded-xl hover:opacity-90 disabled:opacity-50"
            >
              {isPending ? "Changing..." : "Change Password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
