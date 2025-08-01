"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"

export interface Task {
  id: string
  title: string
  description: string
  completed: boolean
  priority: "low" | "medium" | "high"
  dueDate: string
  category: string
  createdAt: string
}

export interface Goal {
  id: string
  title: string
  description: string
  targetDate: string
  progress: number
  category: string
  createdAt: string
}

export interface CalendarEvent {
  id: string
  title: string
  description: string
  date: string
  time: string
  type: "deadline" | "event" | "reminder"
  createdAt: string
}

interface DataContextType {
  tasks: Task[]
  goals: Goal[]
  events: CalendarEvent[]
  addTask: (task: Omit<Task, "id" | "createdAt">) => void
  updateTask: (id: string, updates: Partial<Task>) => void
  deleteTask: (id: string) => void
  addGoal: (goal: Omit<Goal, "id" | "createdAt">) => void
  updateGoal: (id: string, updates: Partial<Goal>) => void
  deleteGoal: (id: string) => void
  addEvent: (event: Omit<CalendarEvent, "id" | "createdAt">) => void
  updateEvent: (id: string, updates: Partial<CalendarEvent>) => void
  deleteEvent: (id: string) => void
}

const DataContext = createContext<DataContextType | undefined>(undefined)

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [goals, setGoals] = useState<Goal[]>([])
  const [events, setEvents] = useState<CalendarEvent[]>([])

  useEffect(() => {
    // Load data from localStorage
    const savedTasks = localStorage.getItem("academic-dashboard-tasks")
    const savedGoals = localStorage.getItem("academic-dashboard-goals")
    const savedEvents = localStorage.getItem("academic-dashboard-events")

    if (savedTasks) setTasks(JSON.parse(savedTasks))
    if (savedGoals) setGoals(JSON.parse(savedGoals))
    if (savedEvents) setEvents(JSON.parse(savedEvents))
  }, [])

  const saveToStorage = (key: string, data: any) => {
    localStorage.setItem(key, JSON.stringify(data))
  }

  const addTask = (taskData: Omit<Task, "id" | "createdAt">) => {
    const newTask: Task = {
      ...taskData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    }
    const updatedTasks = [...tasks, newTask]
    setTasks(updatedTasks)
    saveToStorage("academic-dashboard-tasks", updatedTasks)
  }

  const updateTask = (id: string, updates: Partial<Task>) => {
    const updatedTasks = tasks.map((task) => (task.id === id ? { ...task, ...updates } : task))
    setTasks(updatedTasks)
    saveToStorage("academic-dashboard-tasks", updatedTasks)
  }

  const deleteTask = (id: string) => {
    const updatedTasks = tasks.filter((task) => task.id !== id)
    setTasks(updatedTasks)
    saveToStorage("academic-dashboard-tasks", updatedTasks)
  }

  const addGoal = (goalData: Omit<Goal, "id" | "createdAt">) => {
    const newGoal: Goal = {
      ...goalData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    }
    const updatedGoals = [...goals, newGoal]
    setGoals(updatedGoals)
    saveToStorage("academic-dashboard-goals", updatedGoals)
  }

  const updateGoal = (id: string, updates: Partial<Goal>) => {
    const updatedGoals = goals.map((goal) => (goal.id === id ? { ...goal, ...updates } : goal))
    setGoals(updatedGoals)
    saveToStorage("academic-dashboard-goals", updatedGoals)
  }

  const deleteGoal = (id: string) => {
    const updatedGoals = goals.filter((goal) => goal.id !== id)
    setGoals(updatedGoals)
    saveToStorage("academic-dashboard-goals", updatedGoals)
  }

  const addEvent = (eventData: Omit<CalendarEvent, "id" | "createdAt">) => {
    const newEvent: CalendarEvent = {
      ...eventData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    }
    const updatedEvents = [...events, newEvent]
    setEvents(updatedEvents)
    saveToStorage("academic-dashboard-events", updatedEvents)
  }

  const updateEvent = (id: string, updates: Partial<CalendarEvent>) => {
    const updatedEvents = events.map((event) => (event.id === id ? { ...event, ...updates } : event))
    setEvents(updatedEvents)
    saveToStorage("academic-dashboard-events", updatedEvents)
  }

  const deleteEvent = (id: string) => {
    const updatedEvents = events.filter((event) => event.id !== id)
    setEvents(updatedEvents)
    saveToStorage("academic-dashboard-events", updatedEvents)
  }

  return (
    <DataContext.Provider
      value={{
        tasks,
        goals,
        events,
        addTask,
        updateTask,
        deleteTask,
        addGoal,
        updateGoal,
        deleteGoal,
        addEvent,
        updateEvent,
        deleteEvent,
      }}
    >
      {children}
    </DataContext.Provider>
  )
}

export function useData() {
  const context = useContext(DataContext)
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider")
  }
  return context
}
