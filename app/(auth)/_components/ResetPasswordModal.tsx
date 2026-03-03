"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  handleRequestPasswordReset,
  handleResetPassword,
} from "@/lib/actions/auth-actions";
import { ArrowLeft, Eye, EyeOff, X } from "lucide-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// ---------------------- SCHEMAS ----------------------
const requestResetSchema = z.object({
  email: z.string().email("Enter a valid email"),
});

const resetPasswordSchema = z
  .object({
    email: z.string().email("Enter a valid email"),
    otp: z.string().min(4, "Enter valid OTP"),
    newPassword: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// ---------------------- COMPONENT ----------------------
interface ResetPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void; // called after successful reset
  switchToLogin?: () => void; // called when Back to Login clicked
}

export default function ResetPasswordModal({
  isOpen,
  onClose,
  onSuccess,
  switchToLogin,
}: ResetPasswordModalProps) {
  const [step, setStep] = useState<"request" | "reset">("request");
  const [showPassword, setShowPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");

  // ---------------- Request OTP Form ----------------
  const {
    register: registerRequest,
    handleSubmit: handleSubmitRequest,
    formState: { errors: requestErrors },
  } = useForm<{ email: string }>({ resolver: zodResolver(requestResetSchema) });

  // ---------------- Reset Password Form ----------------
  const {
    register: registerReset,
    handleSubmit: handleSubmitReset,
    setValue: setResetValue,
    formState: { errors: resetErrors },
  } = useForm<{
    email: string;
    otp: string;
    newPassword: string;
    confirmPassword: string;
  }>({ resolver: zodResolver(resetPasswordSchema) });

  // ---------------- Handlers ----------------
  const onRequestReset = async (data: { email: string }) => {
    const res = await handleRequestPasswordReset(data.email);
    if (res.success) {
      setResetEmail(data.email);
      setResetValue("email", data.email);
      toast.success(res.message || "OTP sent successfully!");
      setStep("reset");
    } else {
      toast.error(res.message || "Failed to send OTP.");
    }
  };

  const onResetPassword = async (data: {
    email: string;
    otp: string;
    newPassword: string;
    confirmPassword: string;
  }) => {
    const res = await handleResetPassword(data);
    if (res.success) {
      toast.success(res.message || "Password reset successful!");
      setTimeout(() => {
        setStep("request");
        setResetEmail("");
        if (onSuccess) onSuccess();
        else onClose();
      }, 1500);
    } else {
      toast.error(res.message || "Password reset failed.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-md rounded-2rem bg-white p-8 md:p-10 shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-6 top-6 text-gray-400 hover:text-gray-600"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-black text-gray-800">
            Password <span className="text-[#E87A5D]">Reset</span>
          </h2>
          <p className="text-sm text-gray-500 mt-2">
            {step === "request"
              ? "Enter your email to get OTP"
              : "Enter OTP and new password"}
          </p>
        </div>

        {/* Request OTP Form */}
        {step === "request" && (
          <form
            onSubmit={handleSubmitRequest(onRequestReset)}
            className="space-y-5"
          >
            <input
              type="email"
              {...registerRequest("email")}
              placeholder="Enter your email"
              className="h-11 w-full rounded-lg border border-black/10 bg-[#FFF8F4] pl-3 pr-3 text-sm outline-none focus:border-[#E87A5D]"
            />
            {requestErrors.email && (
              <p className="text-xs text-red-600">
                {requestErrors.email.message}
              </p>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-linear-to-r from-[#E87A5D] to-[#F6B88F] text-white font-bold rounded-xl"
            >
              Send OTP
            </button>

            {/* Back to Login */}
            <button
              type="button"
              onClick={() => switchToLogin && switchToLogin()}
              className="inline-flex items-center gap-2 text-xs font-semibold text-[#E87A5D] hover:underline"
            >
              <ArrowLeft className="w-3 h-3" />
              Back to LogIn
            </button>
          </form>
        )}

        {/* Reset Password Form */}
        {step === "reset" && (
          <form
            onSubmit={handleSubmitReset(onResetPassword)}
            className="space-y-5"
          >
            <input
              type="hidden"
              {...registerReset("email")}
              value={resetEmail}
            />

            {/* OTP */}
            <input
              type="text"
              {...registerReset("otp")}
              placeholder="OTP"
              className="h-11 w-full rounded-lg border border-black/10 bg-[#FFF8F4] pl-3 pr-3 text-sm outline-none focus:border-[#E87A5D]"
            />
            {resetErrors.otp && (
              <p className="text-xs text-red-600">{resetErrors.otp.message}</p>
            )}

            {/* New Password */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                {...registerReset("newPassword")}
                placeholder="New Password"
                className="h-11 w-full rounded-lg border border-black/10 bg-[#FFF8F4] pl-3 pr-10 text-sm outline-none focus:border-[#E87A5D]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              >
                {showPassword ? (
                  <Eye className="w-4 h-4" />
                ) : (
                  <EyeOff className="w-4 h-4" />
                )}
              </button>
              {resetErrors.newPassword && (
                <p className="text-xs text-red-600">
                  {resetErrors.newPassword.message}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                {...registerReset("confirmPassword")}
                placeholder="Confirm Password"
                className="h-11 w-full rounded-lg border border-black/10 bg-[#FFF8F4] pl-3 pr-10 text-sm outline-none focus:border-[#E87A5D]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              >
                {showPassword ? (
                  <Eye className="w-4 h-4" />
                ) : (
                  <EyeOff className="w-4 h-4" />
                )}
              </button>
              {resetErrors.confirmPassword && (
                <p className="text-xs text-red-600">
                  {resetErrors.confirmPassword.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-linear-to-r from-[#E87A5D] to-[#F6B88F] text-white font-bold rounded-xl"
            >
              Reset Password
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
