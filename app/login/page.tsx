"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import ClipLoader from "react-spinners/ClipLoader";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import { useAuth } from "@/context/authContext";

// Get API base URL from environment
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// Smart API handler function
const handleApiCall = async (
  endpoint: string,
  data: any,
  successMessage: string,
  redirectPath: string = "/hub"
) => {
  if (!API_BASE_URL) {
    throw new Error("API configuration is missing");
  }

  try {
    const response = await axios.post(`${API_BASE_URL}${endpoint}`, data, {
      timeout: 10000, // 10 second timeout
      headers: {
        'Content-Type': 'application/json',
      }
    });

    const { token, user } = response.data;

    if (!token) {
      throw new Error("Authentication token not received");
    }

    // Validate token structure
    try {
      const decoded = jwtDecode(token);
      if (!decoded) {
        throw new Error("Invalid token format");
      }
    } catch (decodeError) {
      throw new Error("Received invalid authentication token");
    }

    // Store token securely
    Cookies.set("token", token, {
      expires: 7,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return { token, user, success: true };
  } catch (error) {
    console.error(`API call failed for ${endpoint}:`, error);

    // Handle different error types
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const serverMessage = error.response?.data?.message;

      switch (status) {
        case 400:
          throw new Error(serverMessage || "Invalid request data");
        case 401:
          throw new Error(
            "Invalid credentials - please check your email and password"
          );
        case 403:
          throw new Error("Account access is restricted");
        case 409:
          throw new Error(
            "Email already registered. Please use the login tab instead."
          );
        case 429:
          throw new Error("Too many attempts - please try again later");
        case 500:
        case 502:
        case 503:
          throw new Error(
            "Server is temporarily unavailable - please try again"
          );
        default:
          throw new Error(
            serverMessage || `Request failed with status ${status}`
          );
      }
    }

    if ((error as any)?.code === "ECONNABORTED") {
      throw new Error("Request timeout - please check your connection");
    }

    if ((error as any)?.code === "ERR_NETWORK") {
      throw new Error("Network error - please check your internet connection");
    }

    throw new Error((error as any)?.message || "An unexpected error occurred");
  }
};

// Zod schemas for validation
const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

const registerSchema = z.object({
  firstName: z.string().min(1, { message: "First name is required" }),
  lastName: z.string().min(1, { message: "Last name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

type LoginFormData = z.infer<typeof loginSchema>;
type RegisterFormData = z.infer<typeof registerSchema>;

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"login" | "register">("register");
  const router = useRouter();
  const { login } = useAuth();

  // Login Form
  const {
    register: registerLogin,
    handleSubmit: handleLoginSubmit,
    formState: { errors: loginErrors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  // Register Form
  const {
    register: registerRegister,
    handleSubmit: handleRegisterSubmit,
    formState: { errors: registerErrors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { firstName: "", lastName: "", email: "", password: "" },
  });

  const onLoginSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    toast.loading("Signing in...", { duration: Infinity });

    try {
      const result = await handleApiCall(
        "/auth/login",
        data,
        "Login successful! Redirecting...",
        "/hub"
      );

      // Update auth context with token
      login(result.token);

      toast.dismiss();
      toast.success("Login successful! Redirecting...");

      // Small delay for better UX
      setTimeout(() => {
        router.push("/hub");
      }, 1500);
    } catch (error) {
      toast.dismiss();
      const errorMessage = (error as Error).message;
      console.error("Login error:", errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const onRegisterSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    toast.loading("Creating account...", { duration: Infinity });

    try {
      const result = await handleApiCall(
        "/auth/register",
        data,
        "Registration successful! Redirecting...",
        "/hub"
      );

      // Update auth context with token
      login(result.token);

      toast.dismiss();
      toast.success("Registration successful! Redirecting...");

      // Small delay for better UX
      setTimeout(() => {
        router.push("/hub");
      }, 1500);
    } catch (error) {
      toast.dismiss();
      const errorMessage = (error as Error).message;
      console.error("Registration error:", errorMessage);

      // If user already exists, suggest login and switch tabs
      if (
        errorMessage.includes("Account already exists") ||
        errorMessage.includes("409")
      ) {
        toast.error(
          "Account already exists with this email. Please login instead.",
          {
            duration: 4000,
          }
        );
        // Auto-switch to login tab after a short delay
        setTimeout(() => {
          setActiveTab("login");
        }, 2000);
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900">
      <Header />

      <div className="container mx-auto px-4 py-20">
        <div className="max-w-md mx-auto">
          <Tabs
            value={activeTab}
            onValueChange={(value) =>
              setActiveTab(value as "login" | "register")
            }
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2 bg-slate-800 border border-slate-700">
              <TabsTrigger
                value="login"
                className="data-[state=active]:bg-slate-700 data-[state=active]:text-white text-gray-400"
              >
                Login
              </TabsTrigger>
              <TabsTrigger
                value="register"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-blue-600 data-[state=active]:text-white text-gray-400"
              >
                Register
              </TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader className="text-center">
                  <CardTitle className="text-white text-2xl">
                    Welcome Back
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Sign in to your Eagle Investors account
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form
                    onSubmit={handleLoginSubmit(onLoginSubmit)}
                    className="space-y-4"
                  >
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-white">
                        Email
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        {...registerLogin("email")}
                        required
                        className="bg-slate-700 border-slate-600 text-white placeholder:text-gray-400"
                      />
                      {loginErrors.email && (
                        <p className="text-red-400 text-sm">
                          {loginErrors.email.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-white">
                        Password
                      </Label>
                      <Input
                        id="password"
                        type="password"
                        {...registerLogin("password")}
                        required
                        className="bg-slate-700 border-slate-600 text-white"
                      />
                      {loginErrors.password && (
                        <p className="text-red-400 text-sm">
                          {loginErrors.password.message}
                        </p>
                      )}
                    </div>
                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <span className="flex items-center justify-center">
                          <ClipLoader color="#ffffff" size={20} />
                          Signing In...
                        </span>
                      ) : (
                        "Sign In"
                      )}
                    </Button>
                  </form>
                  <p className="text-center text-sm text-gray-400 mt-4">
                    Don't have an account?{" "}
                    <button
                      type="button"
                      onClick={() => setActiveTab("register")}
                      className="text-cyan-400 hover:underline cursor-pointer"
                    >
                      Register here
                    </button>
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="register">
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader className="text-center">
                  <CardTitle className="text-white text-2xl">
                    Create Account
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Join Eagle Investors today
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form
                    onSubmit={handleRegisterSubmit(onRegisterSubmit)}
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName" className="text-white">
                          First Name
                        </Label>
                        <Input
                          id="firstName"
                          {...registerRegister("firstName")}
                          required
                          className="bg-slate-700 border-slate-600 text-white"
                        />
                        {registerErrors.firstName && (
                          <p className="text-red-400 text-sm">
                            {registerErrors.firstName.message}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName" className="text-white">
                          Last Name
                        </Label>
                        <Input
                          id="lastName"
                          {...registerRegister("lastName")}
                          required
                          className="bg-slate-700 border-slate-600 text-white"
                        />
                        {registerErrors.lastName && (
                          <p className="text-red-400 text-sm">
                            {registerErrors.lastName.message}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-white">
                        Email
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        {...registerRegister("email")}
                        required
                        className="bg-slate-700 border-slate-600 text-white placeholder:text-gray-400"
                      />
                      {registerErrors.email && (
                        <p className="text-red-400 text-sm">
                          {registerErrors.email.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-white">
                        Password
                      </Label>
                      <Input
                        id="password"
                        type="password"
                        {...registerRegister("password")}
                        required
                        className="bg-slate-700 border-slate-600 text-white"
                      />
                      {registerErrors.password && (
                        <p className="text-red-400 text-sm">
                          {registerErrors.password.message}
                        </p>
                      )}
                    </div>
                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <span className="flex items-center justify-center">
                          <ClipLoader color="#ffffff" size={20} />
                          Creating Account...
                        </span>
                      ) : (
                        "Create Account"
                      )}
                    </Button>
                  </form>
                  <p className="text-center text-sm text-gray-400 mt-4">
                    Already have an account?{" "}
                    <button
                      type="button"
                      onClick={() => setActiveTab("login")}
                      className="text-cyan-400 hover:underline cursor-pointer"
                    >
                      Login here
                    </button>
                  </p>
                  <p className="text-center text-sm text-gray-400 mt-2">
                    By signing up, you agree to our{" "}
                    <Link
                      href="/disclosures/terms-conditions"
                      className="text-cyan-400 hover:underline"
                    >
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link
                      href="/disclosures/privacy-policy"
                      className="text-cyan-400 hover:underline"
                    >
                      Privacy Policy
                    </Link>
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Promotional Flair */}
          <div className="mt-6 bg-green-900/30 border border-green-600 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-green-400 font-semibold">
                Free Access Available!
              </span>
            </div>
            <p className="text-gray-300 text-sm">
              Create a free account to access basic educational content and get
              started with your trading journey.
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
