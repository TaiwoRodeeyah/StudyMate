import type React from "react";
import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/lib/auth-context";
import { DataProvider } from "@/lib/data-store";
import Chatbot from "@/components/ui/chatbot";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["300", "500", "600"],
});

export const metadata: Metadata = {
  title: "StudyMate",
  description: "An academic dashboard for managing tasks, goals and deadlines",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={roboto.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <DataProvider>
              {children} <Chatbot />{" "}
            </DataProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
