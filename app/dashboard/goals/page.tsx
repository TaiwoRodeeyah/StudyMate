"use client";

import type React from "react";

import { useState } from "react";
import { useData, type Goal } from "@/lib/data-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Plus, MoreHorizontal, Edit, Trash2, Target } from "lucide-react";
import DashboardLayout from "@/components/dashboard-layout";

export default function GoalsPage() {
  const { goals, addGoal, updateGoal, deleteGoal } = useData();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    targetDate: "",
    progress: 0,
    category: "",
  });

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      targetDate: "",
      progress: 0,
      category: "",
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.targetDate) return;

    if (editingGoal) {
      updateGoal(editingGoal.id, formData);
      setEditingGoal(null);
    } else {
      addGoal(formData);
    }

    resetForm();
    setIsAddDialogOpen(false);
  };

  const handleEdit = (goal: Goal) => {
    setEditingGoal(goal);
    setFormData({
      title: goal.title,
      description: goal.description,
      targetDate: goal.targetDate,
      progress: goal.progress,
      category: goal.category,
    });
    setIsAddDialogOpen(true);
  };

  const handleProgressUpdate = (goalId: string, newProgress: number) => {
    updateGoal(goalId, { progress: newProgress });
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return "bg-[#00A6B5]"; // MyStudyLife teal
    if (progress >= 50) return "bg-[#2D3E50]"; // MyStudyLife dark blue
    if (progress >= 25) return "bg-[#FF6F61]"; // MyStudyLife coral
    return "bg-[#E5E7EB]"; // MyStudyLife light gray
  };

  const sortedGoals = [...goals].sort(
    (a, b) =>
      new Date(a.targetDate).getTime() - new Date(b.targetDate).getTime()
  );

  return (
    <DashboardLayout>
      <div className="space-y-10">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-[#2D3E50] dark:text-[#F5F6F5]">
              My Goals
            </h1>
            <p className="text-lg text-[#00A6B5] dark:text-[#00A6B5] mt-3">
              The big dreams I'm working towards!
            </p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#00A6B5] hover:bg-[#008C9E] text-[#FFFFFF] font-medium px-8 py-4 text-lg rounded-lg shadow-md">
                <Plus className="h-6 w-6 mr-3" />
                New Goal
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[650px] p-0 max-h-[90vh] overflow-y-auto">
              <div className="bg-gradient-to-r from-[#F5F6F5] to-[#FFFFFF] dark:from-[#2D3E50] dark:to-[#4B5563] px-10 py-8 border-b">
                <DialogTitle className="text-3xl font-bold text-[#2D3E50] dark:text-[#F5F6F5]">
                  {editingGoal ? "Edit your goal" : "Dream big!"}
                </DialogTitle>
                <p className="text-lg text-[#00A6B5] dark:text-[#00A6B5] mt-3">
                  {editingGoal
                    ? "Adjust your goal as needed"
                    : "What do you want to achieve this semester?"}
                </p>
              </div>
              <div className="p-10">
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="space-y-5">
                    <Label
                      htmlFor="title"
                      className="text-lg font-semibold text-[#2D3E50] dark:text-[#F5F6F5]"
                    >
                      What's your goal? *
                    </Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      required
                      className="h-14 text-lg border-2 border-[#E5E7EB] dark:border-[#4B5563] focus:border-[#00A6B5] focus:ring-0 rounded-lg"
                    />
                  </div>

                  <div className="space-y-5">
                    <Label
                      htmlFor="description"
                      className="text-lg font-semibold text-[#2D3E50] dark:text-[#F5F6F5]"
                    >
                      Tell me more about it
                    </Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      rows={5}
                      className="text-lg border-2 border-[#E5E7EB] dark:border-[#4B5563] focus:border-[#00A6B5] focus:ring-0 rounded-lg resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-5">
                      <Label
                        htmlFor="targetDate"
                        className="text-lg font-semibold text-[#2D3E50] dark:text-[#F5F6F5]"
                      >
                        When do you want to achieve this? *
                      </Label>
                      <Input
                        id="targetDate"
                        type="date"
                        value={formData.targetDate}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            targetDate: e.target.value,
                          })
                        }
                        required
                        className="h-14 text-lg border-2 border-[#E5E7EB] dark:border-[#4B5563] focus:border-[#00A6B5] focus:ring-0 rounded-lg"
                      />
                    </div>

                    <div className="space-y-5">
                      <Label
                        htmlFor="category"
                        className="text-lg font-semibold text-[#2D3E50] dark:text-[#F5F6F5]"
                      >
                        What area of life?
                      </Label>
                      <Input
                        id="category"
                        value={formData.category}
                        onChange={(e) =>
                          setFormData({ ...formData, category: e.target.value })
                        }
                        className="h-14 text-lg border-2 border-[#E5E7EB] dark:border-[#4B5563] focus:border-[#00A6B5] focus:ring-0 rounded-lg"
                      />
                    </div>
                  </div>

                  <div className="space-y-5">
                    <Label className="text-lg font-semibold text-[#2D3E50] dark:text-[#F5F6F5]">
                      How's it going so far? {formData.progress}%
                    </Label>
                    <div className="px-6 py-6 bg-[#FFFFFF] dark:bg-[#4B5563] rounded-xl border-2 border-[#E5E7EB] dark:border-[#6B7280]">
                      <Slider
                        value={[formData.progress]}
                        onValueChange={(value) =>
                          setFormData({ ...formData, progress: value[0] })
                        }
                        max={100}
                        step={5}
                        className="w-full"
                      />
                      <div className="flex justify-between text-base text-[#6B7280] dark:text-[#9CA3AF] mt-5">
                        <span>Just started</span>
                        <span>Halfway there!</span>
                        <span>Almost done!</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-6 pt-8 border-t border-[#E5E7EB] dark:border-[#6B7280]">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsAddDialogOpen(false);
                        setEditingGoal(null);
                        resetForm();
                      }}
                      className="px-10 py-4 h-14 text-lg border-2 border-[#E5E7EB] hover:border-[#00A6B5] text-[#2D3E50] dark:text-[#F5F6F5] rounded-lg"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="px-8 py-4 h-14 text-lg bg-[#00A6B5] hover:bg-[#008C9E] text-[#FFFFFF] font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all"
                    >
                      {editingGoal ? "Update Goal" : "Create Goal"}
                    </Button>
                  </div>
                </form>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Goals List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {sortedGoals.length > 0 ? (
            sortedGoals.map((goal) => (
              <Card
                key={goal.id}
                className="relative bg-[#FFFFFF] dark:bg-[#2D3E50] border-[#E5E7EB] dark:border-[#4B5563]"
              >
                <CardHeader className="pb-5">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl font-semibold text-[#2D3E50] dark:text-[#F5F6F5]">
                        {goal.title}
                      </CardTitle>
                      {goal.category && (
                        <Badge
                          variant="outline"
                          className="mt-4 text-[#00A6B5] border-[#00A6B5] dark:text-[#00A6B5] dark:border-[#00A6B5] text-base"
                        >
                          {goal.category}
                        </Badge>
                      )}
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-6 w-6 text-[#2D3E50] dark:text-[#F5F6F5]" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEdit(goal)}>
                          <Edit className="h-5 w-5 mr-2 text-[#00A6B5]" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => deleteGoal(goal.id)}
                          className="text-[#FF6F61] dark:text-[#FF6F61]"
                        >
                          <Trash2 className="h-5 w-5 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent className="space-y-8 py-6">
                  {goal.description && (
                    <p className="text-base text-[#6B7280] dark:text-[#9CA3AF]">
                      {goal.description}
                    </p>
                  )}

                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-base font-medium text-[#2D3E50] dark:text-[#F5F6F5]">
                        Progress
                      </span>
                      <span className="text-base text-[#6B7280] dark:text-[#9CA3AF]">
                        {goal.progress}%
                      </span>
                    </div>
                    <Progress
                      value={goal.progress}
                      className={`h-3 ${getProgressColor(goal.progress)}`}
                    />
                  </div>

                  <div className="space-y-4">
                    <Label className="text-base text-[#2D3E50] dark:text-[#F5F6F5]">
                      Update Progress
                    </Label>
                    <div className="flex items-center space-x-4">
                      <Slider
                        value={[goal.progress]}
                        onValueChange={(value) =>
                          handleProgressUpdate(goal.id, value[0])
                        }
                        max={100}
                        step={5}
                        className="flex-1"
                      />
                      <span className="text-base font-medium w-14 text-right text-[#2D3E50] dark:text-[#F5F6F5]">
                        {goal.progress}%
                      </span>
                    </div>
                  </div>

                  <div className="text-base text-[#6B7280] dark:text-[#9CA3AF]">
                    <span>
                      Target: {new Date(goal.targetDate).toLocaleDateString()}
                    </span>
                    {new Date(goal.targetDate) < new Date() &&
                      goal.progress < 100 && (
                        <Badge
                          variant="destructive"
                          className="ml-3 bg-[#FF6F61] text-[#FFFFFF] text-base"
                        >
                          Overdue
                        </Badge>
                      )}
                    {goal.progress === 100 && (
                      <Badge
                        variant="default"
                        className="ml-3 bg-[#00A6B5] text-[#FFFFFF] text-base"
                      >
                        Completed
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full">
              <Card className="bg-[#FFFFFF] dark:bg-[#2D3E50] border-[#E5E7EB] dark:border-[#4B5563]">
                <CardContent className="p-20 text-center">
                  <div className="text-[#6B7280] dark:text-[#9CA3AF]">
                    <Target className="h-16 w-16 mx-auto mb-5 opacity-50" />
                    <h3 className="text-xl font-medium mb-3">No goals yet!</h3>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
