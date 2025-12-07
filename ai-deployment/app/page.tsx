"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScanSearch, ImageIcon, Activity, Zap, TrendingUp, Clock } from "lucide-react"
import Link from "next/link"

const stats = [
  { title: "Total Models", value: "2", icon: Activity, color: "from-blue-500 to-cyan-500" },
  { title: "Predictions Today", value: "1,234", icon: Zap, color: "from-purple-500 to-pink-500" },
  { title: "Accuracy Rate", value: "98.5%", icon: TrendingUp, color: "from-green-500 to-emerald-500" },
  { title: "Avg Response", value: "45ms", icon: Clock, color: "from-orange-500 to-amber-500" },
]

const models = [
  {
    title: "Object Detection Model",
    description: "Detect and locate objects in images with bounding boxes",
    icon: ScanSearch,
    href: "/object-detection",
    gradient: "from-blue-600 to-purple-600",
  },
  {
    title: "Image Classification Model",
    description: "Classify images into predefined categories",
    icon: ImageIcon,
    href: "/image-classification",
    gradient: "from-purple-600 to-pink-600",
  },
]

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Dashboard</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          Welcome to AI Deployment Platform
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="border-0 bg-white dark:bg-slate-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{stat.title}</p>
                  <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">{stat.value}</p>
                </div>
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${stat.color} shadow-lg`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Models Section */}
      <div>
        <h2 className="mb-6 text-xl font-semibold text-slate-900 dark:text-white">AI Models</h2>
        <div className="grid gap-6 md:grid-cols-2">
          {models.map((model) => (
            <Card key={model.title} className="group border-0 bg-white dark:bg-slate-800 overflow-hidden">
              <CardHeader className="pb-4">
                <div className={`mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${model.gradient} shadow-lg transition-transform group-hover:scale-110`}>
                  <model.icon className="h-7 w-7 text-white" />
                </div>
                <CardTitle className="text-xl">{model.title}</CardTitle>
                <CardDescription className="text-slate-500 dark:text-slate-400">
                  {model.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href={model.href}>
                  <Button className={`w-full bg-gradient-to-r ${model.gradient} border-0 text-white shadow-md hover:shadow-lg transition-all`}>
                    Open Model
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
