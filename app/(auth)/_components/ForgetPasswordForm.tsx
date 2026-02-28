"use client";

import { useEffect, useTransition } from "react";
import { useForm } from "react-hook-form";
import { forgetPasswordSchema, ForgetPasswordData } from "../schema";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { Mail, X, ArrowLeft } from "lucide-react";
import { handleRequestPasswordReset } from "@/lib/actions/auth-actions";

interface ForgetPasswordFormProps {
  isModal?: boolean;
  isOpen?: boolean;
  onClose?: () => void;
  switchToLogin?: () => void;
}

export default function ForgetPasswordForm({
  isModal = false,
  isOpen,
  onClose,
  switchToLogin,
}: ForgetPasswordFormProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgetPasswordData>({
    resolver: zodResolver(forgetPasswordSchema),
  });

  // Prevent scrolling when modal is open
  useEffect(() => {
    if (isModal && isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isModal, isOpen]);

  const submit = (values: ForgetPasswordData) => {
    startTransition(async () => {
      try {
        const result = await handleRequestPasswordReset(values.email);

        if (result.success) {
          toast.success(
            "If the email is registered, a reset link has been sent.",
          );
          if (isModal) {
            onClose?.();
          } else {
            router.push("/login");
          }
        } else {
          throw new Error(result.message || "Failed to send reset link");
        }
      } catch (err: any) {
        toast.error(err.message || "Failed to send reset link");
      }
    });
  };

  const handleGoToLogin = (e?: React.MouseEvent) => {
    if (isModal && switchToLogin) {
      e?.preventDefault();
      switchToLogin();
      return;
    }
    if (isModal) onClose?.();
  };

  const formContent = (
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
            className="h-11 w-full rounded-lg border border-black/10 bg-[#FFF8F4] pl-10 pr-3 text-sm outline-none transition focus:border-[#E87A5D] focus:ring-2 focus:ring-[#E87A5D]/20"
          />
        </div>
        {errors.email && (
          <p className="text-xs text-red-600 font-medium">
            {errors.email.message}
          </p>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting || pending}
        className="w-full py-3 bg-linear-to-r from-[#E87A5D] to-[#F6B88F] text-white font-bold rounded-xl hover:opacity-90 disabled:opacity-50 transition-all shadow-lg shadow-orange-200"
      >
        {isSubmitting || pending ? "Sending link..." : "Send Reset Link"}
      </button>

      {/* Back to Login */}
      <div className="text-center">
        {/* <Link
          href="/login"
          onClick={handleGoToLogin}
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#E87A5D] hover:underline"
        >
          <ArrowLeft className="w-3 h-3" />
          Back to Login
        </Link> */}

        <button
          type="button"
          onClick={() => {
            if (isModal && switchToLogin) {
              switchToLogin();
            } else {
              router.push("/login");
            }
          }}
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#E87A5D] hover:underline"
        >
          <ArrowLeft className="w-3 h-3" />
          Back to LogIn
        </button>
      </div>
    </form>
  );

  if (!isModal)
    return <div className="max-w-md mx-auto p-4">{formContent}</div>;
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-md transform rounded-2rem bg-white p-8 md:p-10 shadow-2xl animate-in zoom-in-95 fade-in duration-300">
        <button
          onClick={onClose}
          className="absolute right-6 top-6 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-8 text-center">
          <h2 className="text-3xl font-black text-gray-800">
            Forgot <span className="text-[#E87A5D]">Password?</span>
          </h2>
          <p className="text-sm text-gray-500 mt-2 px-4">
            No worries! Enter your email and we'll send you a link to reset it.
          </p>
        </div>

        {formContent}
      </div>
    </div>
  );
}
