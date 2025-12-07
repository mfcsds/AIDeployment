"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { 
  ScanSearch, 
  ImageIcon, 
  LayoutDashboard,
  ChevronLeft,
  ChevronRight,
  Cpu
} from "lucide-react"
import { Button } from "@/components/ui/button"

const menuItems = [
  {
    title: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Object Detection",
    href: "/object-detection",
    icon: ScanSearch,
  },
  {
    title: "Image Classification",
    href: "/image-classification",
    icon: ImageIcon,
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = React.useState(false)

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white transition-all duration-300 ease-in-out",
        collapsed ? "w-20" : "w-72"
      )}
    >
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-20 items-center justify-between border-b border-slate-700 px-4">
          <div className={cn("flex items-center gap-3", collapsed && "justify-center w-full")}>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg">
              <Cpu className="h-6 w-6" />
            </div>
            {!collapsed && (
              <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                AI Deploy
              </span>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-2 p-4">
          {menuItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link key={item.href} href={item.href}>
                <div
                  className={cn(
                    "flex items-center gap-4 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                      : "text-slate-300 hover:bg-slate-700/50 hover:text-white",
                    collapsed && "justify-center px-2"
                  )}
                >
                  <item.icon className={cn("h-5 w-5 shrink-0", isActive && "text-white")} />
                  {!collapsed && <span>{item.title}</span>}
                </div>
              </Link>
            )
          })}
        </nav>

        {/* Collapse Button */}
        <div className="border-t border-slate-700 p-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCollapsed(!collapsed)}
            className={cn(
              "w-full text-slate-300 hover:bg-slate-700 hover:text-white",
              collapsed && "px-2"
            )}
          >
            {collapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
            {!collapsed && <span className="ml-2">Collapse</span>}
          </Button>
        </div>
      </div>
    </aside>
  )
}
