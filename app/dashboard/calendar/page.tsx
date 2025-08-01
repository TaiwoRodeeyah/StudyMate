"use client";

import type React from "react";

import { useState } from "react";
import { useData, type CalendarEvent } from "@/lib/data-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  CalendarIcon,
  Clock,
} from "lucide-react";
import DashboardLayout from "@/components/dashboard-layout";

export default function CalendarPage() {
  const { events, tasks, addEvent, updateEvent, deleteEvent } = useData();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    type: "event" as "deadline" | "event" | "reminder",
  });

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      date: "",
      time: "",
      type: "event",
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.date) return;

    if (editingEvent) {
      updateEvent(editingEvent.id, formData);
      setEditingEvent(null);
    } else {
      addEvent(formData);
    }

    resetForm();
    setIsAddDialogOpen(false);
  };

  const handleEdit = (event: CalendarEvent) => {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      description: event.description,
      date: event.date,
      time: event.time,
      type: event.type,
    });
    setIsAddDialogOpen(true);
  };

  // Combine events and task deadlines
  const allEvents = [
    ...events,
    ...tasks
      .filter((task) => !task.completed)
      .map((task) => ({
        id: `task-${task.id}`,
        title: `${task.title} (Task Due)`,
        description: task.description,
        date: task.dueDate,
        time: "23:59",
        type: "deadline" as const,
        createdAt: task.createdAt,
      })),
  ];

  const getEventsByDate = (date: string) => {
    return allEvents.filter((event) => event.date === date);
  };

  const getUpcomingEvents = () => {
    const today = new Date().toISOString().split("T")[0];
    return allEvents
      .filter((event) => event.date >= today)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 10);
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case "deadline":
        return "bg-[#FF6F61] text-[#FFFFFF]"; // MyStudyLife coral
      case "event":
        return "bg-[#00A6B5] text-[#FFFFFF]"; // MyStudyLife teal
      case "reminder":
        return "bg-[#E5E7EB] text-[#2D3E50]"; // MyStudyLife light gray
      default:
        return "bg-[#00A6B5] text-[#FFFFFF]"; // Default to teal
    }
  };

  const generateCalendarDays = () => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days = [];
    const currentDate = new Date(startDate);

    for (let i = 0; i < 42; i++) {
      const dateStr = currentDate.toISOString().split("T")[0];
      const dayEvents = getEventsByDate(dateStr);
      const isCurrentMonth = currentDate.getMonth() === currentMonth;
      const isToday = dateStr === today.toISOString().split("T")[0];

      days.push({
        date: new Date(currentDate),
        dateStr,
        events: dayEvents,
        isCurrentMonth,
        isToday,
      });

      currentDate.setDate(currentDate.getDate() + 1);
    }

    return days;
  };

  const calendarDays = generateCalendarDays();
  const upcomingEvents = getUpcomingEvents();

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-[#2D3E50] dark:text-[#F5F6F5]">
              My Calendar
            </h1>
            <p className="text-lg text-[#6B7280] dark:text-[#9CA3AF] mt-3">
              What's happening in my life
            </p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#00A6B5] hover:bg-[#008C9E] text-[#FFFFFF] font-medium px-8 py-4 text-lg rounded-lg shadow-md">
                <Plus className="h-6 w-6 mr-3" />
                New Event
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px] p-0 max-h-[90vh] overflow-y-auto">
              <div className="bg-gradient-to-r from-[#F5F6F5] to-[#FFFFFF] dark:from-[#2D3E50] dark:to-[#4B5563] px-8 py-6 border-b">
                <DialogTitle className="text-3xl font-bold text-[#2D3E50] dark:text-[#F5F6F5]">
                  {editingEvent ? "Edit your event" : "What's happening?"}
                </DialogTitle>
                <p className="text-base text-[#6B7280] dark:text-[#9CA3AF] mt-2">
                  {editingEvent
                    ? "Make changes to your event"
                    : "Add something to your calendar!"}
                </p>
              </div>
              <div className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-4">
                    <Label
                      htmlFor="title"
                      className="text-lg font-semibold text-[#2D3E50] dark:text-[#F5F6F5]"
                    >
                      What's the event? *
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
                      Any extra info?
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
                        htmlFor="date"
                        className="text-lg font-semibold text-[#2D3E50] dark:text-[#F5F6F5]"
                      >
                        What day? *
                      </Label>
                      <Input
                        id="date"
                        type="date"
                        value={formData.date}
                        onChange={(e) =>
                          setFormData({ ...formData, date: e.target.value })
                        }
                        required
                        className="h-12 text-lg border-2 border-[#E5E7EB] dark:border-[#4B5563] focus:border-[#00A6B5] focus:ring-0 rounded-lg"
                      />
                    </div>

                    <div className="space-y-4">
                      <Label
                        htmlFor="time"
                        className="text-lg font-semibold text-[#2D3E50] dark:text-[#F5F6F5]"
                      >
                        What time?
                      </Label>
                      <Input
                        id="time"
                        type="time"
                        value={formData.time}
                        onChange={(e) =>
                          setFormData({ ...formData, time: e.target.value })
                        }
                        className="h-12 text-lg border-2 border-[#E5E7EB] dark:border-[#4B5563] focus:border-[#00A6B5] focus:ring-0 rounded-lg"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Label
                      htmlFor="type"
                      className="text-lg font-semibold text-[#2D3E50] dark:text-[#F5F6F5]"
                    >
                      What kind of thing is this?
                    </Label>
                    <Select
                      value={formData.type}
                      onValueChange={(
                        value: "deadline" | "event" | "reminder"
                      ) => setFormData({ ...formData, type: value })}
                    >
                      <SelectTrigger className="h-12 text-lg border-2 border-[#E5E7EB] dark:border-[#4B5563] focus:border-[#00A6B5] rounded-lg">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="event">Event</SelectItem>
                        <SelectItem value="deadline">Deadline</SelectItem>
                        <SelectItem value="reminder">Reminder</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex justify-end space-x-4 pt-6 border-t border-[#E5E7EB] dark:border-[#4B5563]">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsAddDialogOpen(false);
                        setEditingEvent(null);
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
                      {editingEvent ? "Update Event" : "Add to Calendar"}
                    </Button>
                  </div>
                </form>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calendar Grid */}
          <div className="lg:col-span-2">
            <Card className="bg-[#FFFFFF] dark:bg-[#2D3E50] border-[#E5E7EB] dark:border-[#4B5563]">
              <CardHeader>
                <CardTitle className="flex items-center space-x-3 text-[#2D3E50] dark:text-[#F5F6F5] text-lg">
                  <CalendarIcon className="h-6 w-6 text-[#00A6B5]" />
                  <span>
                    {new Date().toLocaleDateString("en-US", {
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-7 gap-2 mb-5">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                    (day) => (
                      <div
                        key={day}
                        className="p-3 text-center text-base font-medium text-[#6B7280] dark:text-[#9CA3AF]"
                      >
                        {day}
                      </div>
                    )
                  )}
                </div>
                <div className="grid grid-cols-7 gap-2">
                  {calendarDays.map((day, index) => (
                    <div
                      key={index}
                      className={`min-h-[100px] p-2 border rounded-lg ${
                        day.isCurrentMonth
                          ? "bg-[#FFFFFF] dark:bg-[#2D3E50] border-[#E5E7EB] dark:border-[#4B5563]"
                          : "bg-[#F5F6F5] dark:bg-[#4B5563] border-[#E5E7EB] dark:border-[#6B7280]"
                      } ${day.isToday ? "ring-2 ring-[#00A6B5]" : ""}`}
                    >
                      <div
                        className={`text-base font-medium ${
                          day.isCurrentMonth
                            ? day.isToday
                              ? "text-[#00A6B5]"
                              : "text-[#2D3E50] dark:text-[#F5F6F5]"
                            : "text-[#9CA3AF]"
                        }`}
                      >
                        {day.date.getDate()}
                      </div>
                      <div className="space-y-2 mt-2">
                        {day.events.slice(0, 2).map((event, eventIndex) => (
                          <div
                            key={eventIndex}
                            className={`text-sm p-2 rounded truncate ${
                              event.type === "deadline"
                                ? "bg-[#FF6F61] text-[#FFFFFF] dark:bg-[#FF6F61] dark:text-[#FFFFFF]"
                                : event.type === "reminder"
                                ? "bg-[#E5E7EB] text-[#2D3E50] dark:bg-[#4B5563] dark:text-[#F5F6F5]"
                                : "bg-[#00A6B5] text-[#FFFFFF] dark:bg-[#00A6B5] dark:text-[#FFFFFF]"
                            }`}
                          >
                            {event.title}
                          </div>
                        ))}
                        {day.events.length > 2 && (
                          <div className="text-sm text-[#6B7280] dark:text-[#9CA3AF]">
                            +{day.events.length - 2} more
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Upcoming Events */}
          <div>
            <Card className="bg-[#FFFFFF] dark:bg-[#2D3E50] border-[#E5E7EB] dark:border-[#4B5563]">
              <CardHeader>
                <CardTitle className="flex items-center space-x-3 text-[#2D3E50] dark:text-[#F5F6F5] text-lg">
                  <Clock className="h-6 w-6 text-[#00A6B5]" />
                  <span>Upcoming Events</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {upcomingEvents.length > 0 ? (
                  <div className="space-y-4">
                    {upcomingEvents.map((event) => (
                      <div
                        key={event.id}
                        className="flex items-start justify-between p-4 bg-[#F5F6F5] dark:bg-[#4B5563] rounded-lg"
                      >
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h4 className="text-base font-medium text-[#2D3E50] dark:text-[#F5F6F5]">
                              {event.title}
                            </h4>
                            <Badge className={getEventTypeColor(event.type)}>
                              {event.type}
                            </Badge>
                          </div>
                          <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF]">
                            {new Date(event.date).toLocaleDateString()}
                            {event.time && ` at ${event.time}`}
                          </p>
                          {event.description && (
                            <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF] mt-2 truncate">
                              {event.description}
                            </p>
                          )}
                        </div>
                        {!event.id.startsWith("task-") && (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-6 w-6 text-[#2D3E50] dark:text-[#F5F6F5]" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() =>
                                  handleEdit(event as CalendarEvent)
                                }
                              >
                                <Edit className="h-5 w-5 mr-2 text-[#00A6B5]" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => deleteEvent(event.id)}
                                className="text-[#FF6F61]"
                              >
                                <Trash2 className="h-5 w-5 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-[#6B7280] dark:text-[#9CA3AF] py-10">
                    <CalendarIcon className="h-10 w-10 mx-auto mb-3 opacity-50" />
                    <p className="text-base">Nothing coming up!</p>
                    <p className="text-sm mt-2">Time to plan something...</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
