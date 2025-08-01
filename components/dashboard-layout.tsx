"use client";

import type React from "react";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/lib/auth-context";
import {
  Home,
  CheckSquare,
  Calendar,
  Target,
  User,
  LogOut,
  Menu,
  X,
  Sun,
  Moon,
  MessageCircle,
} from "lucide-react";
import { Logo } from "@/components/logo";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Tasks", href: "/dashboard/tasks", icon: CheckSquare },
  { name: "Calendar", href: "/dashboard/calendar", icon: Calendar },
  { name: "Goals", href: "/dashboard/goals", icon: Target },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();

  return (
    <div className="min-h-screen bg-[#F5F6F5] dark:bg-[#2D3E50]">
      {/* Mobile Sidebar */}
      <div
        className={`fixed inset-0 z-50 lg:hidden ${
          sidebarOpen ? "block" : "hidden"
        }`}
      >
        <div
          className="fixed inset-0 bg-[#2D3E50] bg-opacity-75"
          onClick={() => setSidebarOpen(false)}
        />
        <div className="fixed inset-y-0 left-0 flex w-72 flex-col bg-[#FFFFFF] dark:bg-[#2D3E50] shadow-xl">
          <div className="flex h-20 items-center justify-between px-6 border-b border-[#E5E7EB] dark:border-[#4B5563]">
            <div className="flex items-center space-x-3">
              <Logo className="h-10 w-10" />
              <span className="text-4xl font-extrabold text-[#2D3E50] dark:text-[#F5F6F5]">
                StudyMate
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-6 w-6 text-[#00A6B5]" />
            </Button>
          </div>
          <nav className="flex-1 px-6 py-6 space-y-3">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center space-x-4 px-4 py-4 rounded-xl text-lg font-medium transition-all ${
                    isActive
                      ? "bg-[#00A6B5] text-[#FFFFFF] dark:bg-[#00A6B5]"
                      : "text-[#6B7280] hover:bg-[#E5E7EB] dark:text-[#9CA3AF] dark:hover:bg-[#4B5563]"
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon className="h-7 w-7" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-72 lg:flex-col">
        <div className="flex flex-col flex-grow bg-[#FFFFFF] dark:bg-[#2D3E50] border-r border-[#E5E7EB] dark:border-[#4B5563]">
          <div className="flex h-20 items-center px-6 border-b border-[#E5E7EB] dark:border-[#4B5563]">
            <div className="flex items-center space-x-3">
              <Logo className="h-10 w-10" />
              <span className="text-4xl font-extrabold text-[#2D3E50] dark:text-[#F5F6F5]">
                StudyMate
              </span>
            </div>
          </div>
          <nav className="flex-1 px-6 py-6 space-y-3">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center space-x-4 px-4 py-4 rounded-xl text-lg font-medium transition-all ${
                    isActive
                      ? "bg-[#00A6B5] text-[#FFFFFF] dark:bg-[#00A6B5]"
                      : "text-[#6B7280] hover:bg-[#E5E7EB] dark:text-[#9CA3AF] dark:hover:bg-[#4B5563]"
                  }`}
                >
                  <item.icon className="h-7 w-7" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:pl-72">
        {/* Top Bar */}
        <div className="sticky top-0 z-40 flex h-24 items-center justify-between bg-[#FFFFFF] dark:bg-[#2D3E50] border-b border-[#E5E7EB] dark:border-[#4B5563] px-6 sm:px-8 lg:px-10">
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6 text-[#00A6B5]" />
          </Button>

          <div className="flex items-center space-x-6 ml-auto">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? (
                <Sun className="h-6 w-6 text-[#00A6B5]" />
              ) : (
                <Moon className="h-6 w-6 text-[#00A6B5]" />
              )}
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-12 w-12 rounded-full"
                >
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-[#E5E7EB] text-[#2D3E50] dark:bg-[#4B5563] dark:text-[#F5F6F5]">
                      {user?.name?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64" align="end">
                <div className="flex items-center justify-start gap-3 p-3">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium text-lg text-[#2D3E50] dark:text-[#F5F6F5]">
                      {user?.name}
                    </p>
                    <p className="w-[220px] truncate text-base text-[#6B7280] dark:text-[#9CA3AF]">
                      {user?.email}
                    </p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/profile" className="text-base">
                    <User className="mr-2 h-5 w-5 text-[#00A6B5]" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="text-base">
                  <LogOut className="mr-2 h-5 w-5 text-[#FF6F61]" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Page Content */}
        <main className="py-8">
          <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
