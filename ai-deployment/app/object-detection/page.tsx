"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScanSearch, Upload, Play, Settings, Loader2, X, Box } from "lucide-react"

interface Detection {
  class: string
  confidence: number
  box: {
    x1: number
    y1: number
    x2: number
    y2: number
  }
}

interface DetectionResult {
  detections: Detection[]
  count: number
}

const COLORS = [
  "#ef4444", "#f97316", "#eab308", "#22c55e", "#14b8a6",
  "#3b82f6", "#8b5cf6", "#ec4899", "#f43f5e", "#06b6d4"
]

export default function ObjectDetectionPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<DetectionResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [confidence, setConfidence] = useState(25)
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 })
  const fileInputRef = useRef<HTMLInputElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      setPreview(URL.createObjectURL(file))
      setResult(null)
      setError(null)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0]
    if (file && file.type.startsWith("image/")) {
      setSelectedFile(file)
      setPreview(URL.createObjectURL(file))
      setResult(null)
      setError(null)
    }
  }

  const clearImage = () => {
    setSelectedFile(null)
    setPreview(null)
    setResult(null)
    setError(null)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const detectObjects = async () => {
    if (!selectedFile) return

    setIsLoading(true)
    setError(null)
    setResult(null)

    try {
      const formData = new FormData()
      formData.append("file", selectedFile)

      const response = await fetch("https://mfathur19-yolo-app.hf.space/detect", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`)
      }

      const data: DetectionResult = await response.json()
      setResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to detect objects")
    } finally {
      setIsLoading(false)
    }
  }

  // Draw bounding boxes on canvas
  useEffect(() => {
    if (!result || !canvasRef.current || !imageRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const img = imageRef.current
    const displayWidth = img.clientWidth
    const displayHeight = img.clientHeight
    const naturalWidth = img.naturalWidth
    const naturalHeight = img.naturalHeight

    canvas.width = displayWidth
    canvas.height = displayHeight

    const scaleX = displayWidth / naturalWidth
    const scaleY = displayHeight / naturalHeight

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    result.detections.forEach((det, index) => {
      const color = COLORS[index % COLORS.length]
      const x1 = det.box.x1 * scaleX
      const y1 = det.box.y1 * scaleY
      const x2 = det.box.x2 * scaleX
      const y2 = det.box.y2 * scaleY
      const width = x2 - x1
      const height = y2 - y1

      // Draw box
      ctx.strokeStyle = color
      ctx.lineWidth = 3
      ctx.strokeRect(x1, y1, width, height)

      // Draw label background
      const label = `${det.class} ${(det.confidence * 100).toFixed(0)}%`
      ctx.font = "bold 14px sans-serif"
      const textWidth = ctx.measureText(label).width
      ctx.fillStyle = color
      ctx.fillRect(x1, y1 - 24, textWidth + 10, 24)

      // Draw label text
      ctx.fillStyle = "white"
      ctx.fillText(label, x1 + 5, y1 - 7)
    })
  }, [result, imageSize])

  const handleImageLoad = () => {
    if (imageRef.current) {
      setImageSize({
        width: imageRef.current.clientWidth,
        height: imageRef.current.clientHeight
      })
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 shadow-lg">
          <ScanSearch className="h-7 w-7 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Object Detection</h1>
          <p className="text-slate-600 dark:text-slate-400">YOLOv8 Model - Detect objects in images</p>
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
            {!preview ? (
              <div
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 p-12 transition-colors hover:border-blue-500 cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
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
            ) : (
              <div className="relative">
                <button
                  onClick={clearImage}
                  className="absolute -right-2 -top-2 z-20 rounded-full bg-red-500 p-1 text-white shadow-lg hover:bg-red-600"
                >
                  <X className="h-4 w-4" />
                </button>
                <div className="relative flex items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-900 p-4">
                  <div className="relative inline-block">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      ref={imageRef}
                      src={preview}
                      alt="Preview"
                      className="rounded-xl max-h-96 object-contain"
                      onLoad={handleImageLoad}
                    />
                    <canvas
                      ref={canvasRef}
                      className="absolute top-0 left-0 pointer-events-none"
                    />
                  </div>
                </div>
                <p className="mt-2 text-center text-sm text-slate-500">{selectedFile?.name}</p>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
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
                min="10"
                max="90"
                value={confidence}
                onChange={(e) => setConfidence(Number(e.target.value))}
                className="mt-2 w-full accent-blue-600"
              />
              <p className="mt-1 text-xs text-slate-500">{confidence}%</p>
            </div>
            <div className="rounded-xl bg-slate-100 dark:bg-slate-900 p-4">
              <p className="text-xs font-medium text-slate-500">Model</p>
              <p className="mt-1 font-semibold text-slate-900 dark:text-white">YOLOv8</p>
            </div>
            <div className="rounded-xl bg-slate-100 dark:bg-slate-900 p-4">
              <p className="text-xs font-medium text-slate-500">Endpoint</p>
              <p className="mt-1 text-xs font-mono text-slate-600 dark:text-slate-400">
                Hugging Face Spaces
              </p>
            </div>
            <Button
              onClick={detectObjects}
              disabled={!selectedFile || isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Detecting...
                </>
              ) : (
                <>
                  <Play className="mr-2 h-4 w-4" />
                  Run Detection
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Results Section */}
      <Card className="border-0 bg-white dark:bg-slate-800">
        <CardHeader>
          <CardTitle>Detection Results</CardTitle>
          <CardDescription>Objects detected in your image</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4">
              <p className="text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}
          {result ? (
            <div className="space-y-4">
              {/* Summary */}
              <div className="flex items-center gap-4 rounded-2xl bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-6">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 shadow-lg">
                  <Box className="h-8 w-8 text-white" />
                </div>
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Objects Detected</p>
                  <p className="text-3xl font-bold text-slate-900 dark:text-white">{result.count}</p>
                </div>
              </div>

              {/* Detection List */}
              {result.detections.length > 0 ? (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Detected Objects</p>
                  <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                    {result.detections.map((det, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 rounded-xl bg-slate-100 dark:bg-slate-900 p-3"
                      >
                        <div
                          className="h-4 w-4 rounded-full"
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        />
                        <div className="flex-1">
                          <p className="font-medium text-slate-900 dark:text-white capitalize">{det.class}</p>
                          <p className="text-xs text-slate-500">{(det.confidence * 100).toFixed(0)}% confidence</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="rounded-xl bg-slate-100 dark:bg-slate-900 p-4 text-center">
                  <p className="text-slate-500">No objects detected in this image</p>
                </div>
              )}
            </div>
          ) : (
            <div className="flex h-32 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-900">
              <p className="text-slate-500">Upload an image and click &quot;Run Detection&quot; to see results</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
