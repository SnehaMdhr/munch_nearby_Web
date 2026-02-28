"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useEffect, useState, useTransition } from "react";
import { RegisterData, registerSchema } from "../schema";
import { Mail, Lock, EyeOff, Eye, User, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { handleRegister } from "@/lib/actions/auth-actions";
import { toast } from "react-toastify";

interface RegisterFormProps {
  isModal?: boolean;
  isOpen?: boolean;
  onClose?: () => void;
  switchToLogin?: () => void; // Prop to switch modals
}

export default function RegisterForm({
  isModal = false,
  isOpen,
  onClose,
  switchToLogin,
}: RegisterFormProps) {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterData>({
    resolver: zodResolver(registerSchema),
  });

  // Handle body scroll locking
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

  const submit = async (values: RegisterData) => {
    setError("");
    startTransition(async () => {
      try {
        const response = await handleRegister(values);
        if (!response.success) {
          throw new Error(response.message || "Registration failed");
        }

        toast.success("Registered successfully!");

        if (isModal) onClose?.();
        router.push("/login");
      } catch (err: any) {
        const message = err.message || "Registration failed";
        setError(message);
        toast.error(message);
      }
    });
  };

  const formContent = (
    <form onSubmit={handleSubmit(submit)} className="space-y-4">
      {/* Name */}
      <div className="space-y-1">
        <label className="text-sm font-medium">Name</label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            {...register("name")}
            placeholder="Enter your name"
            className="h-11 w-full rounded-lg border border-black/10 bg-[#FFF8F4] pl-10 pr-3 text-sm outline-none focus:border-[#E87A5D]"
          />
        </div>
        {errors.name && (
          <p className="text-xs text-red-500">{errors.name.message}</p>
        )}
      </div>

      {/* Email */}
      <div className="space-y-1">
        <label className="text-sm font-medium">Email</label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="email"
            {...register("email")}
            placeholder="Enter your email"
            className="h-11 w-full rounded-lg border border-black/10 bg-[#FFF8F4] pl-10 pr-3 text-sm outline-none focus:border-[#E87A5D]"
          />
        </div>
        {errors.email && (
          <p className="text-xs text-red-600">{errors.email.message}</p>
        )}
      </div>

      {/* Role */}
      <div className="space-y-1">
        <label className="text-sm font-medium">Role</label>
        <select
          {...register("role")}
          className="h-11 w-full rounded-lg border border-black/10 bg-[#FFF8F4] px-3 text-sm outline-none focus:border-[#E87A5D]"
          defaultValue=""
        >
          <option value="" disabled>
            Select your role
          </option>
          <option value="Customer">Customer</option>
          <option value="Restaurant Owner">Restaurant Owner</option>
        </select>
        {errors.role && (
          <p className="text-xs text-red-600">{errors.role.message}</p>
        )}
      </div>

      {/* Password */}
      <div className="space-y-1">
        <label className="text-sm font-medium">Password</label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type={showPassword ? "text" : "password"}
            {...register("password")}
            placeholder="Create password"
            className="h-11 w-full rounded-lg border border-black/10 bg-[#FFF8F4] pl-10 pr-10 text-sm outline-none focus:border-[#E87A5D]"
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
        </div>
        {errors.password && (
          <p className="text-xs text-red-600">{errors.password.message}</p>
        )}
      </div>

      {/* Confirm Password */}
      <div className="space-y-1">
        <label className="text-sm font-medium">Confirm Password</label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type={showConfirmPassword ? "text" : "password"}
            {...register("confirmPassword")}
            placeholder="Confirm password"
            className="h-11 w-full rounded-lg border border-black/10 bg-[#FFF8F4] pl-10 pr-10 text-sm outline-none focus:border-[#E87A5D]"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
          >
            {showConfirmPassword ? (
              <Eye className="w-4 h-4" />
            ) : (
              <EyeOff className="w-4 h-4" />
            )}
          </button>
        </div>
        {errors.confirmPassword && (
          <p className="text-xs text-red-600">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting || pending}
        className="w-full py-3 bg-linear-to-r from-[#E87A5D] to-[#F6B88F] text-white font-bold rounded-xl hover:opacity-90 disabled:opacity-50 transition-all shadow-lg shadow-orange-200"
      >
        {isSubmitting || pending ? "Creating account..." : "Create Account"}
      </button>

      <p className="text-center text-xs text-gray-500">
        Already have an account?{" "}
        {isModal && switchToLogin ? (
          <button
            type="button"
            onClick={switchToLogin}
            className="font-semibold text-[#E87A5D] hover:underline"
          >
            Login
          </button>
        ) : (
          <Link
            href="/login"
            className="font-semibold text-[#E87A5D] hover:underline"
          >
            Login
          </Link>
        )}
      </p>
    </form>
  );

  if (!isModal)
    return <div className="max-w-md mx-auto p-4">{formContent}</div>;
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-md transform rounded-3xl bg-white p-8 shadow-2xl animate-in zoom-in-95 duration-200 max-h-[95vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute right-5 top-5 text-gray-400 hover:text-gray-600"
        >
          <X className="w-5 h-5" />
        </button>
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-black text-gray-800">
            Sign <span className="text-[#E87A5D]">Up</span>
          </h2>
        </div>
        {formContent}
      </div>
    </div>
  );
}
