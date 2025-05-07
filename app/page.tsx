"use client"

import { useState, useEffect, useCallback } from "react"
import { ColorPalette } from "@/components/color-palette"
import { Controls } from "@/components/controls"
import { History } from "@/components/history"
import { AnimatedBackground } from "@/components/animated-background"
import { AIFeatures } from "@/components/ai-features"
import { ColorInfo } from "@/components/color-info"
import {
  generateRandomPalette,
  generateHarmoniousPalette,
  generateAnalogousPalette,
  generateMonochromaticPalette,
  generateComplementaryPalette,
  generateTriadicPalette,
  generateTetradicPalette,
} from "@/lib/color-utils"
import { ColorLearningEngine } from "@/lib/color-learning-engine"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/hooks/use-toast"
import { CSSExport } from "@/components/css-export"
import { ColorImport } from "@/components/color-import"
import { ResponsiveContainer } from "@/components/responsive-container"
import { useMobile } from "@/hooks/use-mobile"

export default function ColorPaletteGenerator() {
  const [currentPalette, setCurrentPalette] = useState<string[]>([])
  const [paletteHistory, setPaletteHistory] = useState<string[][]>([])
  const [showHistory, setShowHistory] = useState(false)
  const [selectedColorIndex, setSelectedColorIndex] = useState<number | null>(null)
  const [learningEngine, setLearningEngine] = useState<ColorLearningEngine | null>(null)
  const [generationMode, setGenerationMode] = useState<string>("random")
  const { toast } = useToast()
  const [showCssExport, setShowCssExport] = useState(false)
  const [showColorImport, setShowColorImport] = useState(false)
  const isMobile = useMobile()
  const [isLoaded, setIsLoaded] = useState(false)
  const [currentColorFormat, setCurrentColorFormat] = useState<string>("HEX")

  const handleChangeColorFormat = useCallback(() => {
    setCurrentColorFormat((prevFormat) => {
      let newFormat = "HEX"
      switch (prevFormat) {
        case "HEX":
          newFormat = "RGB"
          break
        case "RGB":
          newFormat = "HSL"
          break
        case "HSL":
          newFormat = "CSS"
          break
        case "CSS":
          newFormat = "TW"
          break
        case "TW":
          newFormat = "HEX"
          break
      }
      return newFormat
    })
  }, [])

  // Initialize learning engine and load saved data on initial render
  useEffect(() => {
    const engine = new ColorLearningEngine()
    setLearningEngine(engine)

    try {
      // Use a try-catch block to handle cases where localStorage might not be available
      // (e.g., in private browsing mode or when cookies are disabled)
      const savedPalette = localStorage.getItem("currentPalette")
      const savedHistory = localStorage.getItem("paletteHistory")
      const savedLearningData = localStorage.getItem("learningData")
      const savedColorFormat = localStorage.getItem("currentColorFormat")

      if (savedLearningData) {
        engine.loadFromJSON(savedLearningData)
      }

      if (savedPalette) {
        setCurrentPalette(JSON.parse(savedPalette))
      } else {
        const newPalette = generateRandomPalette(5)
        setCurrentPalette(newPalette)
      }

      if (savedHistory) {
        setPaletteHistory(JSON.parse(savedHistory))
      }

      if (savedColorFormat) {
        setCurrentColorFormat(savedColorFormat)
      }
    } catch (error) {
      console.error("Error loading saved data:", error)
      // Fallback to default palette
      const newPalette = generateRandomPalette(5)
      setCurrentPalette(newPalette)
    } finally {
      // Mark as loaded regardless of whether we loaded from localStorage or generated new data
      setIsLoaded(true)
    }
  }, [])

  // Save current palette, history, and learning data to localStorage whenever they change
  useEffect(() => {
    if (!isLoaded) return // Skip saving until initial load is complete

    try {
      if (currentPalette.length > 0) {
        localStorage.setItem("currentPalette", JSON.stringify(currentPalette))
      }

      if (paletteHistory.length > 0) {
        localStorage.setItem("paletteHistory", JSON.stringify(paletteHistory))
      }

      if (learningEngine) {
        localStorage.setItem("learningData", learningEngine.saveToJSON())
      }

      localStorage.setItem("currentColorFormat", currentColorFormat)
    } catch (error) {
      console.error("Error saving data to localStorage:", error)
      // Just log the error but don't disrupt the user experience
    }
  }, [currentPalette, paletteHistory, learningEngine, isLoaded, currentColorFormat])

  const handleGenerateNewPalette = useCallback(() => {
    let newPalette: string[] = []

    // Generate palette based on selected mode
    switch (generationMode) {
      case "ai":
        if (learningEngine) {
          newPalette = learningEngine.generatePalette(5)
          toast({
            title: "AI Palette Generated",
            description: `Created with 50% creativity level`,
          })
        } else {
          newPalette = generateRandomPalette(5)
        }
        break
      case "harmonious":
        const seedColor =
          currentPalette[0] ||
          "#" +
            Math.floor(Math.random() * 16777215)
              .toString(16)
              .padStart(6, "0")
        newPalette = generateHarmoniousPalette(seedColor, 5)
        break
      case "analogous":
        const baseColor =
          currentPalette[0] ||
          "#" +
            Math.floor(Math.random() * 16777215)
              .toString(16)
              .padStart(6, "0")
        newPalette = generateAnalogousPalette(baseColor, 5)
        break
      case "monochromatic":
        const monoBase =
          currentPalette[0] ||
          "#" +
            Math.floor(Math.random() * 16777215)
              .toString(16)
              .padStart(6, "0")
        newPalette = generateMonochromaticPalette(monoBase, 5)
        break
      case "complementary":
        const compBase =
          currentPalette[0] ||
          "#" +
            Math.floor(Math.random() * 16777215)
              .toString(16)
              .padStart(6, "0")
        newPalette = generateComplementaryPalette(compBase, 5)
        break
      case "triadic":
        const triBase =
          currentPalette[0] ||
          "#" +
            Math.floor(Math.random() * 16777215)
              .toString(16)
              .padStart(6, "0")
        newPalette = generateTriadicPalette(triBase, 5)
        break
      case "tetradic":
        const tetraBase =
          currentPalette[0] ||
          "#" +
            Math.floor(Math.random() * 16777215)
              .toString(16)
              .padStart(6, "0")
        newPalette = generateTetradicPalette(tetraBase, 5)
        break
      case "random":
      default:
        newPalette = generateRandomPalette(5)
    }

    // Add current palette to history before replacing it
    if (currentPalette.length > 0) {
      const updatedHistory = [currentPalette, ...paletteHistory].slice(0, 5)
      setPaletteHistory(updatedHistory)
    }

    setCurrentPalette(newPalette)
  }, [currentPalette, paletteHistory, generationMode, learningEngine, toast])

  const handleColorChange = useCallback((index: number, color: string) => {
    setCurrentPalette((prev) => {
      const updated = [...prev]
      updated[index] = color
      return updated
    })
  }, [])

  const handleSelectHistoryPalette = useCallback(
    (palette: string[]) => {
      // Add current palette to history before replacing it
      setPaletteHistory((prev) => {
        const updatedHistory = prev.filter((p) => JSON.stringify(p) !== JSON.stringify(palette))
        return [currentPalette, ...updatedHistory].slice(0, 5)
      })

      setCurrentPalette(palette)
      setShowHistory(false)
    },
    [currentPalette],
  )

  const handleLikePalette = useCallback(() => {
    if (learningEngine && currentPalette.length > 0) {
      learningEngine.learnFromPalette(currentPalette, 1) // 1 = liked
      toast({
        title: "Palette Liked!",
        description: "The AI will learn from your preference",
      })
    }
  }, [learningEngine, currentPalette, toast])

  const handleDislikePalette = useCallback(() => {
    if (learningEngine && currentPalette.length > 0) {
      learningEngine.learnFromPalette(currentPalette, -1) // -1 = disliked
      toast({
        title: "Palette Disliked",
        description: "The AI will avoid similar palettes",
      })
    }
  }, [learningEngine, currentPalette, toast])

  const handleSelectColor = useCallback((index: number) => {
    setSelectedColorIndex(index)
  }, [])

  const handleCloseColorInfo = useCallback(() => {
    setSelectedColorIndex(null)
  }, [])

  const toggleHistory = useCallback(() => {
    setShowHistory((prev) => !prev)
  }, [])

  const handleExportCSS = useCallback(() => {
    setShowCssExport(true)
  }, [])

  const handleImportColors = useCallback(() => {
    setShowColorImport(true)
  }, [])

  const handleImportedColors = useCallback(
    (colors: string[]) => {
      // Add current palette to history before replacing it
      if (currentPalette.length > 0) {
        setPaletteHistory((prev) => [currentPalette, ...prev].slice(0, 5))
      }
      setCurrentPalette(colors)

      toast({
        title: "Colors Imported",
        description: `Imported ${colors.length} colors to your palette`,
      })
    },
    [currentPalette, setPaletteHistory, toast],
  )

  // Show loading state until the app is fully initialized
  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <ResponsiveContainer className="min-h-screen relative overflow-hidden">
      <AnimatedBackground colors={currentPalette} />

      <div className="relative z-10 p-4 md:p-8 min-h-screen">
        <div
          className={`mx-auto bg-white/90 backdrop-blur-sm rounded-xl p-4 md:p-6 shadow-xl ${isMobile ? "w-full" : "max-w-4xl"}`}
        >
          <header className="mb-6 md:mb-8 text-center">
            <h1 className="text-2xl md:text-4xl font-bold text-gray-800 mb-2">AI Color Palette Generator</h1>
            <p className="text-sm md:text-base text-gray-600">
              Generate intelligent color palettes that learn from your preferences
            </p>
          </header>

          <Tabs defaultValue="palette" className="mb-6">
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="palette">Palette</TabsTrigger>
              <TabsTrigger value="ai">AI Features</TabsTrigger>
            </TabsList>
            <TabsContent value="palette">
              <Controls
                onGenerateNew={handleGenerateNewPalette}
                onToggleHistory={toggleHistory}
                onLike={handleLikePalette}
                onDislike={handleDislikePalette}
                onExportCSS={handleExportCSS}
                onImportColors={handleImportColors}
                generationMode={generationMode}
                setGenerationMode={setGenerationMode}
                currentColorFormat={currentColorFormat}
                onChangeColorFormat={handleChangeColorFormat}
              />

              <ColorPalette
                colors={currentPalette}
                onColorChange={handleColorChange}
                onSelectColor={handleSelectColor}
                currentFormat={currentColorFormat}
              />
            </TabsContent>
            <TabsContent value="ai">
              <AIFeatures
                learningEngine={learningEngine}
                currentPalette={currentPalette}
                setCurrentPalette={setCurrentPalette}
              />
            </TabsContent>
          </Tabs>

          {/* Use isOpen prop instead of conditional rendering */}
          <History
            palettes={paletteHistory}
            onSelect={handleSelectHistoryPalette}
            onClose={() => setShowHistory(false)}
            isOpen={showHistory}
          />

          {/* Use isOpen prop instead of conditional rendering */}
          <ColorInfo
            color={selectedColorIndex !== null ? currentPalette[selectedColorIndex] || "" : ""}
            onClose={handleCloseColorInfo}
            isOpen={selectedColorIndex !== null && !!currentPalette[selectedColorIndex]}
          />
        </div>
      </div>
      <CSSExport colors={currentPalette} isOpen={showCssExport} onClose={() => setShowCssExport(false)} />

      <ColorImport isOpen={showColorImport} onClose={() => setShowColorImport(false)} onImport={handleImportedColors} />
      <Toaster />
    </ResponsiveContainer>
  )
}
