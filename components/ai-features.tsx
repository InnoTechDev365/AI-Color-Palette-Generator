"use client"

import { useState } from "react"
import type { ColorLearningEngine } from "@/lib/color-learning-engine"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Progress } from "@/components/ui/progress"
import { Brain, Sparkles, BarChart3, Palette, Lightbulb, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useMobile } from "@/hooks/use-mobile"

interface AIFeaturesProps {
  learningEngine: ColorLearningEngine | null
  currentPalette: string[]
  setCurrentPalette: (palette: string[]) => void
}

export function AIFeatures({ learningEngine, currentPalette, setCurrentPalette }: AIFeaturesProps) {
  const [creativity, setCreativity] = useState(50)
  const [colorPreference, setColorPreference] = useState<string>("balanced")
  const [trainingProgress, setTrainingProgress] = useState(0)
  const [isTraining, setIsTraining] = useState(false)
  const { toast } = useToast()
  const isMobile = useMobile()

  const handleGenerateAIPalette = () => {
    if (!learningEngine) return

    const newPalette = learningEngine.generatePalette(5, creativity / 100)
    setCurrentPalette(newPalette)

    toast({
      title: "AI Palette Generated",
      description: `Created with ${creativity}% creativity level`,
    })
  }

  const handleTrainAI = async () => {
    if (!learningEngine) return

    setIsTraining(true)
    setTrainingProgress(0)

    // Simulate training with progress updates
    for (let i = 0; i <= 10; i++) {
      await new Promise((resolve) => setTimeout(resolve, 300))
      setTrainingProgress(i * 10)

      if (i < 10) {
        // Generate and learn from random palettes during training
        const randomPalette = Array.from(
          { length: 5 },
          () =>
            "#" +
            Math.floor(Math.random() * 16777215)
              .toString(16)
              .padStart(6, "0"),
        )
        learningEngine.learnFromPalette(randomPalette, Math.random() > 0.5 ? 1 : -1)
      }
    }

    setIsTraining(false)

    toast({
      title: "AI Training Complete",
      description: "Your AI has been trained with additional color data",
    })
  }

  const handleResetAI = () => {
    if (!learningEngine) return

    learningEngine.reset()

    toast({
      title: "AI Reset",
      description: "Your AI has been reset to default settings",
    })
  }

  const handleSetColorPreference = (preference: string) => {
    setColorPreference(preference)

    if (!learningEngine) return

    // Adjust the learning engine based on preference
    switch (preference) {
      case "warm":
        learningEngine.setColorBias({ r: 0.7, g: 0.5, b: 0.3 })
        break
      case "cool":
        learningEngine.setColorBias({ r: 0.3, g: 0.5, b: 0.7 })
        break
      case "vibrant":
        learningEngine.setSaturationPreference(0.8)
        break
      case "pastel":
        learningEngine.setSaturationPreference(0.3)
        learningEngine.setLightnessPreference(0.8)
        break
      case "dark":
        learningEngine.setLightnessPreference(0.2)
        break
      case "balanced":
      default:
        learningEngine.resetPreferences()
    }

    toast({
      title: "Color Preference Set",
      description: `Your AI will now favor ${preference} colors`,
    })
  }

  const learningStats = learningEngine
    ? {
        totalSamples: learningEngine.getTotalSamples(),
        likedColors: learningEngine.getLikedColorsCount(),
        dislikedColors: learningEngine.getDislikedColorsCount(),
        confidence: learningEngine.getConfidenceScore(),
      }
    : {
        totalSamples: 0,
        likedColors: 0,
        dislikedColors: 0,
        confidence: 0,
      }

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="bg-gray-50 p-3 md:p-4 rounded-lg">
        <div className="flex items-center gap-2 mb-3">
          <Brain className="h-5 w-5 text-purple-600" />
          <h3 className="font-semibold text-lg">AI Learning Engine</h3>
        </div>

        <div className={`grid gap-4 mb-4 ${isMobile ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2"}`}>
          <div>
            <p className="text-sm text-gray-600 mb-2">Total Samples Learned</p>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold">{learningStats.totalSamples}</span>
              <span className="text-xs text-gray-500">colors</span>
            </div>
          </div>

          <div>
            <p className="text-sm text-gray-600 mb-2">AI Confidence</p>
            <div className="flex items-center gap-2">
              <Progress value={learningStats.confidence * 100} className="h-2" />
              <span className="text-xs text-gray-500">{Math.round(learningStats.confidence * 100)}%</span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size={isMobile ? "sm" : "default"}
            className="flex items-center gap-1"
            onClick={handleTrainAI}
            disabled={isTraining}
          >
            <Sparkles className={`${isMobile ? "h-3 w-3" : "h-4 w-4"}`} />
            {isTraining ? `Training ${trainingProgress}%` : "Train AI"}
          </Button>

          <Button
            variant="outline"
            size={isMobile ? "sm" : "default"}
            className="flex items-center gap-1 text-red-600 border-red-200 hover:bg-red-50"
            onClick={handleResetAI}
          >
            <Trash2 className={`${isMobile ? "h-3 w-3" : "h-4 w-4"}`} />
            Reset AI
          </Button>
        </div>
      </div>

      <div className="bg-gray-50 p-3 md:p-4 rounded-lg">
        <div className="flex items-center gap-2 mb-3">
          <Palette className="h-5 w-5 text-purple-600" />
          <h3 className="font-semibold text-lg">AI Palette Generation</h3>
        </div>

        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm text-gray-600">Creativity Level</label>
              <span className="text-sm font-medium">{creativity}%</span>
            </div>
            <Slider
              value={[creativity]}
              min={0}
              max={100}
              step={1}
              onValueChange={(values) => setCreativity(values[0])}
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Conservative</span>
              <span>Experimental</span>
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-600 block mb-2">Color Preference</label>
            <div className="flex flex-wrap gap-2">
              {["balanced", "warm", "cool", "vibrant", "pastel", "dark"].map((pref) => (
                <Button
                  key={pref}
                  variant={colorPreference === pref ? "default" : "outline"}
                  size={isMobile ? "sm" : "default"}
                  onClick={() => handleSetColorPreference(pref)}
                  className="capitalize"
                >
                  {pref}
                </Button>
              ))}
            </div>
          </div>

          <Button
            onClick={handleGenerateAIPalette}
            className="w-full flex items-center gap-2 bg-purple-600 hover:bg-purple-700"
          >
            <Lightbulb className="h-4 w-4" />
            Generate AI Palette
          </Button>
        </div>
      </div>

      <div className="bg-gray-50 p-3 md:p-4 rounded-lg">
        <div className="flex items-center gap-2 mb-3">
          <BarChart3 className="h-5 w-5 text-purple-600" />
          <h3 className="font-semibold text-lg">Color Analytics</h3>
        </div>

        <div className="space-y-3">
          <div>
            <p className="text-sm text-gray-600 mb-1">Liked Colors</p>
            <Progress value={learningStats.likedColors > 0 ? 100 : 0} className="h-2 bg-gray-200" />
            <p className="text-xs text-gray-500 mt-1">{learningStats.likedColors} colors liked</p>
          </div>

          <div>
            <p className="text-sm text-gray-600 mb-1">Disliked Colors</p>
            <Progress value={learningStats.dislikedColors > 0 ? 100 : 0} className="h-2 bg-gray-200" />
            <p className="text-xs text-gray-500 mt-1">{learningStats.dislikedColors} colors disliked</p>
          </div>
        </div>
      </div>
    </div>
  )
}
