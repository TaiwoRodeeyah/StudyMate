"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/lib/auth-context";
import { Loader2 } from "lucide-react";
import { Logo } from "@/components/logo";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login, isLoading } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    const success = await login(email, password);
    if (success) {
      router.push("/dashboard");
    } else {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F5F6F5] to-[#FFFFFF] dark:from-[#2D3E50] dark:to-[#4B5563] p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-[#E5E7EB] dark:bg-[#4B5563] rounded-full">
              <Logo className="h-8 w-8" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-[#2D3E50] dark:text-[#F5F6F5]">
            Welcome to StudyMate
          </CardTitle>
          <CardDescription className="text-[#6B7280] dark:text-[#9CA3AF]">
            Sign in to your account
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <Alert
                variant="destructive"
                className="bg-[#FF6F61] text-[#FFFFFF] border-[#FF6F61]"
              >
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-[#2D3E50] dark:text-[#F5F6F5]"
              >
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                className="border-2 border-[#E5E7EB] dark:border-[#4B5563] focus:border-[#00A6B5] focus:ring-0"
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="text-[#2D3E50] dark:text-[#F5F6F5]"
              >
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                className="border-2 border-[#E5E7EB] dark:border-[#4B5563] focus:border-[#00A6B5] focus:ring-0"
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button
              type="submit"
              className="w-full bg-[#00A6B5] hover:bg-[#008C9E] text-[#FFFFFF]"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
            <p className="text-sm text-center text-[#6B7280] dark:text-[#9CA3AF]">
              {"Don't have an account? "}
              <Link
                href="/signup"
                className="text-[#00A6B5] hover:text-[#008C9E] font-medium"
              >
                Sign up
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
