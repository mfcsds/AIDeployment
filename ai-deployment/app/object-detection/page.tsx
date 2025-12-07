"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScanSearch, Upload, Play, Settings } from "lucide-react"

export default function ObjectDetectionPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 shadow-lg">
          <ScanSearch className="h-7 w-7 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Object Detection</h1>
          <p className="text-slate-600 dark:text-slate-400">
            Detect and locate objects in images
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Upload Section */}
        <Card className="lg:col-span-2 border-0 bg-white dark:bg-slate-800">
          <CardHeader>
            <CardTitle>Upload Image</CardTitle>
            <CardDescription>Upload an image to detect objects</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 p-12 transition-colors hover:border-blue-500">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
                <Upload className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <p className="mt-4 text-sm font-medium text-slate-700 dark:text-slate-300">
                Drag and drop your image here
              </p>
              <p className="mt-1 text-xs text-slate-500">PNG, JPG up to 10MB</p>
              <Button className="mt-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                Select File
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Settings Panel */}
        <Card className="border-0 bg-white dark:bg-slate-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Confidence Threshold
              </label>
              <input
                type="range"
                min="0"
                max="100"
                defaultValue="50"
                className="mt-2 w-full accent-blue-600"
              />
              <p className="mt-1 text-xs text-slate-500">50%</p>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Max Detections
              </label>
              <input
                type="number"
                defaultValue="10"
                className="mt-2 w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-4 py-2 text-sm"
              />
            </div>
            <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white">
              <Play className="mr-2 h-4 w-4" />
              Run Detection
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Results Section */}
      <Card className="border-0 bg-white dark:bg-slate-800">
        <CardHeader>
          <CardTitle>Detection Results</CardTitle>
          <CardDescription>Objects detected in your image will appear here</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex h-64 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-900">
            <p className="text-slate-500">No results yet. Upload an image to get started.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
