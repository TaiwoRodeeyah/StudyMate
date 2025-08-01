"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useAuth } from "@/lib/auth-context";
import { useData } from "@/lib/data-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  User,
  Mail,
  Calendar,
  Target,
  CheckSquare,
  TrendingUp,
  ArrowLeft,
  Sun,
  Moon,
  LogOut,
} from "lucide-react";
import { Logo } from "@/components/logo";

export default function ProfilePage() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const { user, logout } = useAuth();
  const { tasks, goals, events } = useData();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would update the user profile here
    setIsEditing(false);
  };

  const handleBack = () => {
    router.back();
  };

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const completedTasks = tasks.filter((task) => task.completed).length;
  const totalTasks = tasks.length;
  const taskCompletionRate =
    totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  const completedGoals = goals.filter((goal) => goal.progress === 100).length;
  const averageGoalProgress =
    goals.length > 0
      ? goals.reduce((sum, goal) => sum + goal.progress, 0) / goals.length
      : 0;

  const upcomingEvents = events.filter(
    (event) => new Date(event.date) >= new Date()
  ).length;

  const recentActivity = [
    ...tasks.slice(-5).map((task) => ({
      type: "task",
      title: task.completed
        ? `Completed: ${task.title}`
        : `Created: ${task.title}`,
      date: task.createdAt,
      icon: CheckSquare,
    })),
    ...goals.slice(-3).map((goal) => ({
      type: "goal",
      title: `Goal: ${goal.title} (${goal.progress}%)`,
      date: goal.createdAt,
      icon: Target,
    })),
    ...events.slice(-3).map((event) => ({
      type: "event",
      title: `Event: ${event.title}`,
      date: event.createdAt,
      icon: Calendar,
    })),
  ]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 8);

  return (
    <div className="min-h-screen bg-[#F5F6F5] dark:bg-[#2D3E50]">
      {/* Custom Header */}
      <div className="sticky top-0 z-40 bg-[#FFFFFF] dark:bg-[#2D3E50] border-b border-[#E5E7EB] dark:border-[#4B5563]">
        <div className="flex items-center justify-between px-6 sm:px-8 lg:px-10 h-20">
          <div className="flex items-center space-x-6">
            <Button variant="ghost" size="sm" onClick={handleBack}>
              <ArrowLeft className="h-6 w-6 mr-3 text-[#00A6B5]" />
              <span className="text-lg">Back</span>
            </Button>
            <div className="flex items-center space-x-3">
              <Logo className="h-10 w-10" />
              <span className="text-3xl font-bold text-[#2D3E50] dark:text-[#F5F6F5]">
                StudyMate
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-6">
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
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="h-6 w-6 mr-3 text-[#FF6F61]" />
              <span className="text-lg">Logout</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="py-8">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">
          <div className="space-y-8">
            {/* Header */}
            <div className="text-center">
              <h1 className="text-5xl font-bold text-[#2D3E50] dark:text-[#F5F6F5]">
                Profile
              </h1>
              <p className="text-lg text-[#6B7280] dark:text-[#9CA3AF] mt-3">
                Manage your profile and view your academic progress
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              {/* Profile Information */}
              <div className="lg:col-span-1">
                <Card className="h-fit bg-[#FFFFFF] dark:bg-[#2D3E50] border-[#E5E7EB] dark:border-[#4B5563]">
                  <CardHeader>
                    <CardTitle className="text-xl text-[#2D3E50] dark:text-[#F5F6F5]">
                      Profile Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-8">
                    <div className="flex flex-col items-center space-y-5">
                      <Avatar className="h-28 w-28">
                        <AvatarFallback className="bg-[#E5E7EB] text-[#2D3E50] dark:bg-[#4B5563] dark:text-[#F5F6F5] text-4xl">
                          {user?.name?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="text-center">
                        <h3 className="text-2xl font-semibold text-[#2D3E50] dark:text-[#F5F6F5]">
                          {user?.name}
                        </h3>
                        <p className="text-base text-[#6B7280] dark:text-[#9CA3AF]">
                          {user?.email}
                        </p>
                      </div>
                    </div>

                    <Separator className="bg-[#E5E7EB] dark:bg-[#4B5563]" />

                    {isEditing ? (
                      <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-4">
                          <Label
                            htmlFor="name"
                            className="text-lg text-[#2D3E50] dark:text-[#F5F6F5]"
                          >
                            Full Name
                          </Label>
                          <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) =>
                              setFormData({ ...formData, name: e.target.value })
                            }
                            className="h-12 text-lg border-2 border-[#E5E7EB] dark:border-[#4B5563] focus:border-[#00A6B5] focus:ring-0 rounded-lg"
                          />
                        </div>
                        <div className="space-y-4">
                          <Label
                            htmlFor="email"
                            className="text-lg text-[#2D3E50] dark:text-[#F5F6F5]"
                          >
                            Email
                          </Label>
                          <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                email: e.target.value,
                              })
                            }
                            className="h-12 text-lg border-2 border-[#E5E7EB] dark:border-[#4B5563] focus:border-[#00A6B5] focus:ring-0 rounded-lg"
                          />
                        </div>
                        <div className="flex space-x-4">
                          <Button
                            type="submit"
                            size="sm"
                            className="bg-[#00A6B5] hover:bg-[#008C9E] text-[#FFFFFF] h-12 px-6 text-lg rounded-lg shadow-md"
                          >
                            Save
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setIsEditing(false)}
                            className="h-12 px-6 text-lg border-2 border-[#E5E7EB] hover:border-[#00A6B5] text-[#2D3E50] dark:text-[#F5F6F5] rounded-lg"
                          >
                            Cancel
                          </Button>
                        </div>
                      </form>
                    ) : (
                      <div className="space-y-6">
                        <div className="flex items-center space-x-4">
                          <User className="h-5 w-5 text-[#00A6B5]" />
                          <span className="text-base text-[#2D3E50] dark:text-[#F5F6F5]">
                            {user?.name}
                          </span>
                        </div>
                        <div className="flex items-center space-x-4">
                          <Mail className="h-5 w-5 text-[#00A6B5]" />
                          <span className="text-base text-[#2D3E50] dark:text-[#F5F6F5]">
                            {user?.email}
                          </span>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setIsEditing(true)}
                          className="w-full h-12 text-lg border-2 border-[#E5E7EB] hover:border-[#00A6B5] text-[#2D3E50] dark:text-[#F5F6F5] rounded-lg"
                        >
                          Edit Profile
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Statistics and Activity */}
              <div className="lg:col-span-2 space-y-8">
                {/* Recent Activity */}
                <Card className="bg-[#FFFFFF] dark:bg-[#2D3E50] border-[#E5E7EB] dark:border-[#4B5563]">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-3 text-[#2D3E50] dark:text-[#F5F6F5] text-lg">
                      <TrendingUp className="h-6 w-6 text-[#00A6B5]" />
                      <span>Recent Activity</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {recentActivity.length > 0 ? (
                      <div className="space-y-5">
                        {recentActivity.map((activity, index) => (
                          <div
                            key={index}
                            className="flex items-center space-x-4 p-4 bg-[#F5F6F5] dark:bg-[#4B5563] rounded-lg"
                          >
                            <activity.icon className="h-6 w-6 text-[#00A6B5]" />
                            <div className="flex-1">
                              <p className="text-base font-medium text-[#2D3E50] dark:text-[#F5F6F5]">
                                {activity.title}
                              </p>
                              <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF]">
                                {new Date(activity.date).toLocaleDateString()}
                              </p>
                            </div>
                            <Badge
                              variant="outline"
                              className="text-sm text-[#00A6B5] border-[#00A6B5] dark:text-[#00A6B5] dark:border-[#00A6B5]"
                            >
                              {activity.type}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center text-[#6B7280] dark:text-[#9CA3AF] py-16">
                        <TrendingUp className="h-16 w-16 mx-auto mb-5 opacity-50" />
                        <p className="text-base">No recent activity</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
