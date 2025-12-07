"use client"

import { useState, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ImageIcon, Upload, Play, BarChart3, Loader2, X } from "lucide-react"
import Image from "next/image"

const CIFAR_CLASSES = ['airplane', 'automobile', 'bird', 'cat', 'deer', 'dog', 'frog', 'horse', 'ship', 'truck']

interface PredictionResult {
  class: string
  confidence: number
}

export default function ImageClassificationPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<PredictionResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

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

  const classifyImage = async () => {
    if (!selectedFile) return

    setIsLoading(true)
    setError(null)
    setResult(null)

    try {
      const formData = new FormData()
      formData.append("file", selectedFile)

      const response = await fetch("https://mfathur19-docker-cifar.hf.space/predict", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`)
      }

      const data: PredictionResult = await response.json()
      setResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to classify image")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 shadow-lg">
          <ImageIcon className="h-7 w-7 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Image Classification</h1>
          <p className="text-slate-600 dark:text-slate-400">CIFAR-10 Model - Classify images into 10 categories</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Upload Section */}
        <Card className="lg:col-span-2 border-0 bg-white dark:bg-slate-800">
          <CardHeader>
            <CardTitle>Upload Image</CardTitle>
            <CardDescription>Upload an image to classify (best with 32x32 images)</CardDescription>
          </CardHeader>
          <CardContent>
            {!preview ? (
              <div
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 p-12 transition-colors hover:border-purple-500 cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
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
            ) : (
              <div className="relative">
                <button
                  onClick={clearImage}
                  className="absolute -right-2 -top-2 z-10 rounded-full bg-red-500 p-1 text-white shadow-lg hover:bg-red-600"
                >
                  <X className="h-4 w-4" />
                </button>
                <div className="flex items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-900 p-4">
                  <Image
                    src={preview}
                    alt="Preview"
                    width={256}
                    height={256}
                    className="rounded-xl object-contain max-h-64"
                  />
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
              <p className="text-xs font-medium text-slate-500">Model</p>
              <p className="mt-1 font-semibold text-slate-900 dark:text-white">CIFAR-10 CNN</p>
            </div>
            <div className="rounded-xl bg-slate-100 dark:bg-slate-900 p-4">
              <p className="text-xs font-medium text-slate-500">Categories</p>
              <div className="mt-2 flex flex-wrap gap-1">
                {CIFAR_CLASSES.map((cls) => (
                  <span key={cls} className="rounded-full bg-purple-100 dark:bg-purple-900 px-2 py-0.5 text-xs text-purple-700 dark:text-purple-300">
                    {cls}
                  </span>
                ))}
              </div>
            </div>
            <div className="rounded-xl bg-slate-100 dark:bg-slate-900 p-4">
              <p className="text-xs font-medium text-slate-500">Endpoint</p>
              <p className="mt-1 text-xs font-mono text-slate-600 dark:text-slate-400 break-all">
                Hugging Face Spaces
              </p>
            </div>
            <Button
              onClick={classifyImage}
              disabled={!selectedFile || isLoading}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Classifying...
                </>
              ) : (
                <>
                  <Play className="mr-2 h-4 w-4" />
                  Classify Image
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Results Section */}
      <Card className="border-0 bg-white dark:bg-slate-800">
        <CardHeader>
          <CardTitle>Classification Results</CardTitle>
          <CardDescription>Prediction from CIFAR-10 model</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4">
              <p className="text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}
          {result ? (
            <div className="space-y-4">
              <div className="flex items-center gap-4 rounded-2xl bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-6">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 shadow-lg">
                  <span className="text-2xl">
                    {result.class === 'airplane' && '✈️'}
                    {result.class === 'automobile' && '🚗'}
                    {result.class === 'bird' && '🐦'}
                    {result.class === 'cat' && '🐱'}
                    {result.class === 'deer' && '🦌'}
                    {result.class === 'dog' && '🐕'}
                    {result.class === 'frog' && '🐸'}
                    {result.class === 'horse' && '🐴'}
                    {result.class === 'ship' && '🚢'}
                    {result.class === 'truck' && '🚚'}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-slate-500 dark:text-slate-400">Predicted Class</p>
                  <p className="text-2xl font-bold capitalize text-slate-900 dark:text-white">{result.class}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-slate-500 dark:text-slate-400">Confidence</p>
                  <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    {(result.confidence * 100).toFixed(1)}%
                  </p>
                </div>
              </div>
              {/* Confidence Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600 dark:text-slate-400">Confidence Level</span>
                  <span className="font-medium text-slate-900 dark:text-white">{(result.confidence * 100).toFixed(1)}%</span>
                </div>
                <div className="h-3 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-purple-600 to-pink-600 transition-all duration-500"
                    style={{ width: `${result.confidence * 100}%` }}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="flex h-32 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-900">
              <p className="text-slate-500">Upload an image and click &quot;Classify Image&quot; to see results</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
