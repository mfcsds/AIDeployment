"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ImageIcon, Upload, Play, BarChart3 } from "lucide-react"

export default function ImageClassificationPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 shadow-lg">
          <ImageIcon className="h-7 w-7 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Image Classification</h1>
          <p className="text-slate-600 dark:text-slate-400">
            Classify images into categories
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Upload Section */}
        <Card className="lg:col-span-2 border-0 bg-white dark:bg-slate-800">
          <CardHeader>
            <CardTitle>Upload Image</CardTitle>
            <CardDescription>Upload an image to classify</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 p-12 transition-colors hover:border-purple-500">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900">
                <Upload className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              </div>
              <p className="mt-4 text-sm font-medium text-slate-700 dark:text-slate-300">
                Drag and drop your image here
              </p>
              <p className="mt-1 text-xs text-slate-500">PNG, JPG up to 10MB</p>
              <Button className="mt-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                Select File
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Model Info */}
        <Card className="border-0 bg-white dark:bg-slate-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Model Info
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-xl bg-slate-100 dark:bg-slate-900 p-4">
              <p className="text-xs font-medium text-slate-500">Model Type</p>
              <p className="mt-1 font-semibold text-slate-900 dark:text-white">CNN Classifier</p>
            </div>
            <div className="rounded-xl bg-slate-100 dark:bg-slate-900 p-4">
              <p className="text-xs font-medium text-slate-500">Categories</p>
              <p className="mt-1 font-semibold text-slate-900 dark:text-white">1,000 classes</p>
            </div>
            <div className="rounded-xl bg-slate-100 dark:bg-slate-900 p-4">
              <p className="text-xs font-medium text-slate-500">Accuracy</p>
              <p className="mt-1 font-semibold text-slate-900 dark:text-white">98.5%</p>
            </div>
            <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white">
              <Play className="mr-2 h-4 w-4" />
              Classify Image
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Results Section */}
      <Card className="border-0 bg-white dark:bg-slate-800">
        <CardHeader>
          <CardTitle>Classification Results</CardTitle>
          <CardDescription>Top predictions will appear here</CardDescription>
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
