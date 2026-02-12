"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { forgetPasswordSchema, ForgetPasswordData } from "../schema";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { Mail } from "lucide-react";
import { handleRequestPasswordReset } from "@/lib/actions/auth-actions";

export default function ForgetPasswordForm() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgetPasswordData>({
    resolver: zodResolver(forgetPasswordSchema),
  });

  const [pending, startTransition] = useTransition();

  const submit = (values: ForgetPasswordData) => {
    startTransition(async () => {
      try {
        const result = await handleRequestPasswordReset(values.email);

        if (result.success) {
          toast.success(
            "If the email is registered, a reset link has been sent."
          );
          router.push("/login");
        } else {
          throw new Error(result.message || "Failed to send reset link");
        }
      } catch (err: any) {
        toast.error(err.message || "Failed to send reset link");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-6">
      {/* Email Field */}
      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-700">
          Email Address
        </label>

        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />

          <input
            type="email"
            {...register("email")}
            placeholder="Enter Your Email"
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

        {errors.email && (
          <p className="text-xs text-red-600">{errors.email.message}</p>
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
        {isSubmitting || pending ? "Sending link..." : "Send Reset Link"}
      </button>

      {/* Back to Login */}
      <p className="text-center text-xs text-gray-500">
        Remembered your password?{" "}
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
