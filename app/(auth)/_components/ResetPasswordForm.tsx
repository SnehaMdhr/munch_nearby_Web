"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import Link from "next/link";
import { Lock } from "lucide-react";
import { ResetPasswordData, resetPasswordSchema } from "../schema";
import { handleResetPassword } from "@/lib/actions/auth-actions";

export default function ResetPasswordForm({
  token,
}: {
  token: string;
}) {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const [pending, startTransition] = useTransition();

  const submit = (values: ResetPasswordData) => {
    startTransition(async () => {
      try {
        const result = await handleResetPassword(
          token,
          values.newPassword
        );

        if (result.success) {
          toast.success("Password has been reset successfully.");
          router.push("/login");
        } else {
          throw new Error(
            result.message || "Failed to reset password"
          );
        }
      } catch (err: any) {
        toast.error(
          err.message || "Failed to reset password"
        );
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-6">
      {/* New Password */}
      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-700">
          New Password
        </label>

        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />

          <input
            type="password"
            autoComplete="new-password"
            {...register("newPassword")}
            placeholder="••••••••"
            className="
              h-11 w-full
              rounded-lg
              border border-black/10
              bg-[#FFF8F4]
              pl-10 pr-3
              text-sm
              outline-none
              transition
              focus:border-[#E87A5D]
              focus:ring-2 focus:ring-[#E87A5D]/20
            "
          />
        </div>

        {errors.newPassword && (
          <p className="text-xs text-red-600">
            {errors.newPassword.message}
          </p>
        )}
      </div>

      {/* Confirm Password */}
      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-700">
          Confirm Password
        </label>

        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />

          <input
            type="password"
            autoComplete="new-password"
            {...register("confirmNewPassword")}
            placeholder="••••••••"
            className="
              h-11 w-full
              rounded-lg
              border border-black/10
              bg-[#FFF8F4]
              pl-10 pr-3
              text-sm
              outline-none
              transition
              focus:border-[#E87A5D]
              focus:ring-2 focus:ring-[#E87A5D]/20
            "
          />
        </div>

        {errors.confirmNewPassword && (
          <p className="text-xs text-red-600">
            {errors.confirmNewPassword.message}
          </p>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting || pending}
        className="
          h-11 w-full
          rounded-full
          bg-[#E87A5D]
          text-white
          font-semibold
          transition
          hover:opacity-90
          disabled:opacity-60
        "
      >
        {isSubmitting || pending
          ? "Resetting password..."
          : "Reset Password"}
      </button>

      {/* Back to Login */}
      <p className="text-center text-xs text-gray-500">
        Want to log in?{" "}
        <Link
          href="/login"
          className="font-semibold text-[#E87A5D] hover:underline"
        >
          Login
        </Link>
      </p>
    </form>
  );
}
