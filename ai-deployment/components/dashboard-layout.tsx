"use client"

import * as React from "react"
import { Sidebar } from "@/components/sidebar"

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Sidebar />
      <main className="pl-72 transition-all duration-300">
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
