"use client";

import type React from "react";

import { useState } from "react";
import { useData, type Task } from "@/lib/data-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import {
  Plus,
  MoreHorizontal,
  Edit,
  Trash2,
  Filter,
  CheckSquare,
} from "lucide-react";
import DashboardLayout from "@/components/dashboard-layout";

export default function TasksPage() {
  const { tasks, addTask, updateTask, deleteTask } = useData();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [filter, setFilter] = useState<"all" | "pending" | "completed">("all");
  const [priorityFilter, setPriorityFilter] = useState<
    "all" | "high" | "medium" | "low"
  >("all");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "medium" as "low" | "medium" | "high",
    dueDate: "",
    category: "",
  });

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      priority: "medium",
      dueDate: "",
      category: "",
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.dueDate) return;

    if (editingTask) {
      updateTask(editingTask.id, {
        ...formData,
        completed: editingTask.completed,
      });
      setEditingTask(null);
    } else {
      addTask({
        ...formData,
        completed: false,
      });
    }

    resetForm();
    setIsAddDialogOpen(false);
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setFormData({
      title: task.title,
      description: task.description,
      priority: task.priority,
      dueDate: task.dueDate,
      category: task.category,
    });
    setIsAddDialogOpen(true);
  };

  const handleToggleComplete = (task: Task) => {
    updateTask(task.id, { completed: !task.completed });
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === "pending" && task.completed) return false;
    if (filter === "completed" && !task.completed) return false;
    if (priorityFilter !== "all" && task.priority !== priorityFilter)
      return false;
    return true;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-[#FF6F61] text-[#FFFFFF]"; // MyStudyLife coral
      case "medium":
        return "bg-[#00A6B5] text-[#FFFFFF]"; // MyStudyLife teal
      case "low":
        return "bg-[#E5E7EB] text-[#2D3E50]"; // MyStudyLife light gray
      default:
        return "bg-[#00A6B5] text-[#FFFFFF]"; // Default to teal
    }
  };

  // Reminder Logic
  const now = new Date("2025-07-31T18:26:00Z"); // Current time: 6:26 PM GMT, July 31, 2025
  const upcomingReminders = tasks.filter((task) => {
    if (task.completed) return false;
    const dueDate = new Date(task.dueDate);
    const timeDiff = dueDate.getTime() - now.getTime();
    const hoursUntilDue = timeDiff / (1000 * 60 * 60);
    return hoursUntilDue <= 24 && hoursUntilDue > 0; // Remind if within 24 hours
  });

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-[#2D3E50] dark:text-[#F5F6F5]">
              My Tasks
            </h1>
            <p className="text-lg text-[#6B7280] dark:text-[#9CA3AF] mt-3">
              All the stuff I need to get done (eventually...)
            </p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#00A6B5] hover:bg-[#008C9E] text-[#FFFFFF] font-medium px-8 py-4 text-lg rounded-lg shadow-md">
                <Plus className="h-6 w-6 mr-3" />
                New Task
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px] p-0 max-h-[90vh] overflow-y-auto">
              <div className="bg-gradient-to-r from-[#F5F6F5] to-[#FFFFFF] dark:from-[#2D3E50] dark:to-[#4B5563] px-8 py-6 border-b">
                <DialogTitle className="text-3xl font-bold text-[#2D3E50] dark:text-[#F5F6F5]">
                  {editingTask ? "Edit this task" : "What's on your mind?"}
                </DialogTitle>
                <p className="text-base text-[#6B7280] dark:text-[#9CA3AF] mt-2">
                  {editingTask
                    ? "Make some changes to your task"
                    : "Let's get this stuff organized!"}
                </p>
              </div>
              <div className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-4">
                    <Label
                      htmlFor="title"
                      className="text-lg font-semibold text-[#2D3E50] dark:text-[#F5F6F5]"
                    >
                      What do you need to do? *
                    </Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      required
                      className="h-12 text-lg border-2 border-[#E5E7EB] dark:border-[#4B5563] focus:border-[#00A6B5] focus:ring-0 rounded-lg"
                    />
                  </div>

                  <div className="space-y-4">
                    <Label
                      htmlFor="description"
                      className="text-lg font-semibold text-[#2D3E50] dark:text-[#F5F6F5]"
                    >
                      Any extra details?
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
                      rows={4}
                      className="text-lg border-2 border-[#E5E7EB] dark:border-[#4B5563] focus:border-[#00A6B5] focus:ring-0 rounded-lg resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <Label
                        htmlFor="priority"
                        className="text-lg font-semibold text-[#2D3E50] dark:text-[#F5F6F5]"
                      >
                        Priority Level
                      </Label>
                      <Select
                        value={formData.priority}
                        onValueChange={(value: "low" | "medium" | "high") =>
                          setFormData({ ...formData, priority: value })
                        }
                      >
                        <SelectTrigger className="h-12 text-lg border-2 border-[#E5E7EB] dark:border-[#4B5563] focus:border-[#00A6B5] rounded-lg">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low Priority</SelectItem>
                          <SelectItem value="medium">
                            Medium Priority
                          </SelectItem>
                          <SelectItem value="high">High Priority</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-4">
                      <Label
                        htmlFor="dueDate"
                        className="text-lg font-semibold text-[#2D3E50] dark:text-[#F5F6F5]"
                      >
                        When's it due? *
                      </Label>
                      <Input
                        id="dueDate"
                        type="date"
                        value={formData.dueDate}
                        onChange={(e) =>
                          setFormData({ ...formData, dueDate: e.target.value })
                        }
                        required
                        className="h-12 text-lg border-2 border-[#E5E7EB] dark:border-[#4B5563] focus:border-[#00A6B5] focus:ring-0 rounded-lg"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Label
                      htmlFor="category"
                      className="text-lg font-semibold text-[#2D3E50] dark:text-[#F5F6F5]"
                    >
                      What subject/type?
                    </Label>
                    <Input
                      id="category"
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({ ...formData, category: e.target.value })
                      }
                      className="h-12 text-lg border-2 border-[#E5E7EB] dark:border-[#4B5563] focus:border-[#00A6B5] focus:ring-0 rounded-lg"
                    />
                  </div>

                  <div className="flex justify-end space-x-4 pt-6 border-t border-[#E5E7EB] dark:border-[#4B5563]">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsAddDialogOpen(false);
                        setEditingTask(null);
                        resetForm();
                      }}
                      className="px-8 py-4 h-12 text-lg border-2 border-[#E5E7EB] hover:border-[#00A6B5] text-[#2D3E50] dark:text-[#F5F6F5] rounded-lg"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="px-6 py-4 h-12 text-lg bg-[#00A6B5] hover:bg-[#008C9E] text-[#FFFFFF] font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all"
                    >
                      {editingTask ? "Update Task" : "Add Task"}
                    </Button>
                  </div>
                </form>
              </div>
            </DialogContent>
          </Dialog>
          {upcomingReminders.length > 0 && (
            <div className="mb-6">
              <Badge className="bg-[#FF6F61] text-[#FFFFFF] text-lg px-4 py-2">
                {upcomingReminders.length} Task(s) Due Soon!
              </Badge>
            </div>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-6">
          <Select
            value={filter}
            onValueChange={(value: "all" | "pending" | "completed") =>
              setFilter(value)
            }
          >
            <SelectTrigger className="w-[200px] h-12 text-lg border-2 border-[#E5E7EB] dark:border-[#4B5563] focus:border-[#00A6B5]">
              <Filter className="h-5 w-5 mr-3" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Tasks</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={priorityFilter}
            onValueChange={(value: "all" | "high" | "medium" | "low") =>
              setPriorityFilter(value)
            }
          >
            <SelectTrigger className="w-[200px] h-12 text-lg border-2 border-[#E5E7EB] dark:border-[#4B5563] focus:border-[#00A6B5]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priorities</SelectItem>
              <SelectItem value="high">High Priority</SelectItem>
              <SelectItem value="medium">Medium Priority</SelectItem>
              <SelectItem value="low">Low Priority</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Tasks List */}
        <div className="space-y-6">
          {filteredTasks.length > 0 ? (
            filteredTasks.map((task) => (
              <Card
                key={task.id}
                className={`transition-all bg-[#FFFFFF] dark:bg-[#2D3E50] border-[#E5E7EB] dark:border-[#4B5563] ${
                  task.completed ? "opacity-75" : ""
                }`}
              >
                <CardContent className="p-8">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-5 flex-1">
                      <Checkbox
                        checked={task.completed}
                        onCheckedChange={() => handleToggleComplete(task)}
                        className="mt-1 h-6 w-6"
                      />
                      <div className="flex-1 space-y-4">
                        <div className="flex items-center space-x-4">
                          <h3
                            className={`font-semibold text-xl ${
                              task.completed
                                ? "line-through text-[#6B7280]"
                                : "text-[#2D3E50] dark:text-[#F5F6F5]"
                            }`}
                          >
                            {task.title}
                          </h3>
                          <Badge className={getPriorityColor(task.priority)}>
                            {task.priority}
                          </Badge>
                          {task.category && (
                            <Badge
                              variant="outline"
                              className="text-[#00A6B5] border-[#00A6B5] dark:text-[#00A6B5] dark:border-[#00A6B5] text-base"
                            >
                              {task.category}
                            </Badge>
                          )}
                        </div>
                        {task.description && (
                          <p
                            className={`text-base ${
                              task.completed
                                ? "line-through text-[#9CA3AF]"
                                : "text-[#6B7280] dark:text-[#9CA3AF]"
                            }`}
                          >
                            {task.description}
                          </p>
                        )}
                        <div className="flex items-center space-x-4 text-base text-[#6B7280] dark:text-[#9CA3AF]">
                          <span>
                            Due: {new Date(task.dueDate).toLocaleDateString()}
                          </span>
                          {new Date(task.dueDate) < now && !task.completed && (
                            <Badge className="bg-[#FF6F61] text-[#FFFFFF] text-base">
                              Overdue
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-6 w-6 text-[#2D3E50] dark:text-[#F5F6F5]" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEdit(task)}>
                          <Edit className="h-5 w-5 mr-2 text-[#00A6B5]" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => deleteTask(task.id)}
                          className="text-[#FF6F61]"
                        >
                          <Trash2 className="h-5 w-5 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className="bg-[#FFFFFF] dark:bg-[#2D3E50] border-[#E5E7EB] dark:border-[#4B5563]">
              <CardContent className="p-16 text-center">
                <div className="text-[#6B7280] dark:text-[#9CA3AF]">
                  <CheckSquare className="h-16 w-16 mx-auto mb-5 opacity-50" />
                  <h3 className="text-xl font-medium mb-3">No tasks yet!</h3>
                  <p className="text-base">
                    Time to add some stuff to your to-do list... or maybe just
                    procrastinate a bit more?
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
