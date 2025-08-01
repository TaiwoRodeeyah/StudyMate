"use client";

import { useAuth } from "@/lib/auth-context";
import { useData } from "@/lib/data-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

import {
  CheckSquare,
  Target,
  Calendar,
  TrendingUp,
  Clock,
  AlertCircle,
} from "lucide-react";
import DashboardLayout from "@/components/dashboard-layout";
import DailyQuote from "@/components/daily-quotes";

export default function DashboardPage() {
  const { user } = useAuth();
  const { tasks, goals, events } = useData();

  const completedTasks = tasks.filter((task) => task.completed).length;
  const totalTasks = tasks.length;
  const taskCompletionRate =
    totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  const upcomingDeadlines = tasks
    .filter((task) => !task.completed && new Date(task.dueDate) > new Date())
    .sort(
      (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
    )
    .slice(0, 5);

  const overdueTasks = tasks.filter(
    (task) => !task.completed && new Date(task.dueDate) < new Date()
  ).length;

  const averageGoalProgress =
    goals.length > 0
      ? goals.reduce((sum, goal) => sum + goal.progress, 0) / goals.length
      : 0;

  const upcomingEvents = events
    .filter((event) => new Date(event.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3);

  return (
    <DashboardLayout>
      <div className="space-y-12">
        {/* Welcome Section */}
        <div>
          <h1 className="text-5xl font-bold text-[#2D3E50] dark:text-[#F5F6F5]">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-lg text-[#6B7280] dark:text-[#9CA3AF] mt-3">
            Here's what's happening with your academic progress today.
          </p>
          <div className="mt-6">
            <DailyQuote />
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <Card className="bg-[#FFFFFF] dark:bg-[#2D3E50] shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-base font-medium text-[#2D3E50] dark:text-[#F5F6F5]">
                Total Tasks
              </CardTitle>
              <CheckSquare className="h-6 w-6 text-[#00A6B5]" />
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-[#2D3E50] dark:text-[#F5F6F5]">
                {totalTasks}
              </div>
              <p className="text-base text-[#6B7280] dark:text-[#9CA3AF]">
                {completedTasks} completed
              </p>
            </CardContent>
          </Card>

          <Card className="bg-[#FFFFFF] dark:bg-[#2D3E50] shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-base font-medium text-[#2D3E50] dark:text-[#F5F6F5]">
                Active Goals
              </CardTitle>
              <Target className="h-6 w-6 text-[#00A6B5]" />
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-[#2D3E50] dark:text-[#F5F6F5]">
                {goals.length}
              </div>
              <p className="text-base text-[#6B7280] dark:text-[#9CA3AF]">
                {averageGoalProgress.toFixed(0)}% avg progress
              </p>
            </CardContent>
          </Card>

          <Card className="bg-[#FFFFFF] dark:bg-[#2D3E50] shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-base font-medium text-[#2D3E50] dark:text-[#F5F6F5]">
                Upcoming Events
              </CardTitle>
              <Calendar className="h-6 w-6 text-[#00A6B5]" />
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-[#2D3E50] dark:text-[#F5F6F5]">
                {upcomingEvents.length}
              </div>
              <p className="text-base text-[#6B7280] dark:text-[#9CA3AF]">
                Next 7 days
              </p>
            </CardContent>
          </Card>

          <Card className="bg-[#FFFFFF] dark:bg-[#2D3E50] shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-base font-medium text-[#2D3E50] dark:text-[#F5F6F5]">
                Overdue Tasks
              </CardTitle>
              <AlertCircle className="h-6 w-6 text-[#FF6F61]" />
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-[#FF6F61]">
                {overdueTasks}
              </div>
              <p className="text-base text-[#FF6F61]">Needs attention</p>
            </CardContent>
          </Card>
        </div>

        {/* Task Progress & Deadlines */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="bg-[#FFFFFF] dark:bg-[#2D3E50] shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-[#2D3E50] dark:text-[#F5F6F5] text-lg">
                <TrendingUp className="h-6 w-6 text-[#00A6B5]" />
                <span>Task Progress</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div>
                <div className="flex justify-between text-base text-[#6B7280] dark:text-[#9CA3AF]">
                  <span>Completion Rate</span>
                  <span>{taskCompletionRate.toFixed(0)}%</span>
                </div>
                <Progress value={taskCompletionRate} className="h-3" />
              </div>
              <p className="text-base text-[#6B7280] dark:text-[#9CA3AF]">
                {completedTasks} of {totalTasks} tasks completed
              </p>
            </CardContent>
          </Card>

          <Card className="bg-[#FFFFFF] dark:bg-[#2D3E50] shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-[#2D3E50] dark:text-[#F5F6F5] text-lg">
                <Clock className="h-6 w-6 text-[#00A6B5]" />
                <span>Upcoming Deadlines</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {upcomingDeadlines.length > 0 ? (
                <div className="space-y-4">
                  {upcomingDeadlines.map((task) => (
                    <div
                      key={task.id}
                      className="flex items-center justify-between"
                    >
                      <div className="flex-1">
                        <p className="text-base font-medium text-[#2D3E50] dark:text-[#F5F6F5] truncate">
                          {task.title}
                        </p>
                        <p className="text-sm text-[#6B7280]">
                          {new Date(task.dueDate).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge
                        variant={
                          task.priority === "high"
                            ? "destructive"
                            : task.priority === "medium"
                            ? "default"
                            : "secondary"
                        }
                        className={
                          task.priority === "high"
                            ? "bg-[#FF6F61] text-[#FFFFFF]"
                            : task.priority === "medium"
                            ? "bg-[#00A6B5] text-[#FFFFFF]"
                            : "bg-[#E5E7EB] text-[#2D3E50]"
                        }
                      >
                        {task.priority}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-base text-[#6B7280]">
                  No upcoming deadlines
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Goal Progress */}
        <Card className="bg-[#FFFFFF] dark:bg-[#2D3E50] shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-[#2D3E50] dark:text-[#F5F6F5] text-lg">
              <Target className="h-6 w-6 text-[#00A6B5]" />
              <span>Goal Progress</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {goals.length > 0 ? (
              <div className="space-y-5">
                {goals.slice(0, 3).map((goal) => (
                  <div key={goal.id} className="space-y-3">
                    <div className="flex justify-between items-center">
                      <h4 className="text-base font-semibold text-[#2D3E50] dark:text-[#F5F6F5]">
                        {goal.title}
                      </h4>
                      <span className="text-base text-[#6B7280]">
                        {goal.progress}%
                      </span>
                    </div>
                    <Progress value={goal.progress} className="h-3" />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-base text-[#6B7280]">No goals set yet</p>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
