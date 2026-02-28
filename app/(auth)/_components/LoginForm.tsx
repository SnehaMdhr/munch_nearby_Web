"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useEffect, useState, useTransition } from "react";
import { LoginData, loginSchema } from "../schema";
import { Mail, Lock, EyeOff, Eye, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { handleLogin } from "@/lib/actions/auth-actions";
import { toast } from "react-toastify";
import { useAuth } from "@/context/AuthContext";

interface LoginFormProps {
  isModal?: boolean;
  isOpen?: boolean;
  onClose?: () => void;
  switchToRegister?: () => void;
  switchTOForgetPassword?: () => void;
}

export default function LoginForm({
  isModal = false,
  isOpen,
  onClose,
  switchToRegister,
  switchTOForgetPassword,
}: LoginFormProps) {
  const router = useRouter();
  const { setIsAuthenticated, setUser, checkAuth } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isForgetPasswordOpen, setIsForgetPasswordOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
  });

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

  const submit = async (values: LoginData) => {
    setError("");
    startTransition(async () => {
      try {
        const response = await handleLogin(values);

        if (!response.success) {
          throw new Error(response.message || "Login failed");
        }

        toast.success("Login successful!");

        const role = response.data?.role?.toLowerCase();
        const nextPath =
          role === "admin"
            ? "/admin"
            : role === "customer"
              ? "/customer/dashboard"
              : role === "restaurant owner"
                ? "/restaurantowner/onboarding"
                : "/";

        setUser(response.data ?? null);
        setIsAuthenticated(true);
        await checkAuth();

        if (isModal) onClose?.();

        router.replace(nextPath);
        router.refresh();
      } catch (err: any) {
        const message = err.message || "Login failed";
        setError(message);
        toast.error(message);
      }
    });
  };

  const handleGoToRegister = () => {
    if (isModal && switchToRegister) {
      switchToRegister();
      return;
    }

    if (isModal) onClose?.();
    router.push("/register");
  };

  const handleGoToForgetPassword = () => {
    if (isModal && switchTOForgetPassword) {
      switchTOForgetPassword();
      return;
    }
  };

  const formContent = (
    <form onSubmit={handleSubmit(submit)} className="space-y-5">
      {/* Email */}
      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-700">Email</label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="email"
            {...register("email")}
            placeholder="Enter your email"
            className="h-11 w-full rounded-lg border border-black/10 bg-[#FFF8F4] pl-10 pr-3 text-sm outline-none focus:border-[#E87A5D] transition-colors"
          />
        </div>
        {errors.email && (
          <p className="text-xs text-red-600">{errors.email.message}</p>
        )}
      </div>

      {/* Password */}
      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-700">Password</label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type={showPassword ? "text" : "password"}
            {...register("password")}
            placeholder="Enter your password"
            className="h-11 w-full rounded-lg border border-black/10 bg-[#FFF8F4] pl-10 pr-10 text-sm outline-none focus:border-[#E87A5D] transition-colors"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
          >
            {showPassword ? (
              <Eye className="w-4 h-4" />
            ) : (
              <EyeOff className="w-4 h-4" />
            )}
          </button>
        </div>

        <div className="text-right">
          <button
            type="button"
            onClick={() => {
              if (isModal && switchTOForgetPassword) {
                switchTOForgetPassword();
                onClose?.();
              } else {
                onClose?.();
                router.push("/forgetpassword");
              }
            }}
            className="text-xs text-[#E87A5D] font-medium hover:underline"
          >
            Forgot Password?
          </button>
        </div>

        {errors.password && (
          <p className="text-xs text-red-600">{errors.password.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting || pending}
        className="w-full py-3 bg-linear-to-r from-[#E87A5D] to-[#F6B88F] text-white font-bold rounded-xl hover:opacity-90 disabled:opacity-50 transition-all shadow-lg shadow-orange-200"
      >
        {isSubmitting || pending ? "Logging in..." : "Login"}
      </button>

      <div className="flex items-center gap-3 text-xs text-gray-400">
        <div className="h-px flex-1 bg-gray-200" />
        Or sign in with
        <div className="h-px flex-1 bg-gray-200" />
      </div>

      <div className="flex justify-center">
        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 hover:bg-gray-50 transition-colors"
        >
          <img src="/images/google.png" alt="Google" className="h-5 w-5" />
        </button>
      </div>

      <p className="text-center text-xs text-gray-500">
        Don’t have an account?{" "}
        <button
          type="button"
          onClick={() => {
            if (isModal && switchToRegister) {
              switchToRegister();
              onClose?.();
            } else {
              onClose?.();
              // fallback: navigate to register page
              router.push("/register");
            }
          }}
          className="font-semibold text-[#E87A5D] hover:underline"
        >
          Create Account
        </button>
      </p>
    </form>
  );

  if (!isModal) return <div className="p-4">{formContent}</div>;
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      <div className="relative w-full max-w-md transform rounded-2rem bg-white p-8 md:p-10 shadow-2xl animate-in zoom-in-95 fade-in duration-300">
        <button
          onClick={onClose}
          className="absolute right-6 top-6 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-black text-gray-800">
            Welcome <span className="text-[#E87A5D]">Back</span>
          </h2>
          <p className="text-sm text-gray-500 mt-2">Login to your account</p>
        </div>
        {formContent}
      </div>
    </div>
  );
}
