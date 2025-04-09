import { hexToRgb, rgbToHex, rgbToHsl, hslToRgb } from "./color-utils"

export class ColorLearningEngine {
  private likedColors: string[] = []
  private dislikedColors: string[] = []
  private colorFrequency: Record<string, number> = {}
  private huePreferences: number[] = []
  private saturationPreference = 0.5
  private lightnessPreference = 0.5
  private colorBias: { r: number; g: number; b: number } = { r: 0.5, g: 0.5, b: 0.5 }

  constructor() {
    // Initialize with some default preferences
    this.huePreferences = Array(36).fill(1) // 36 hue buckets (10 degrees each)
  }

  // Learn from a palette that the user liked or disliked
  public learnFromPalette(palette: string[], sentiment: number): void {
    palette.forEach((color) => {
      const { r, g, b } = hexToRgb(color)
      const { h, s, l } = rgbToHsl(r, g, b)

      // Update hue preferences
      const hueBucket = Math.floor(h / 10) % 36
      this.huePreferences[hueBucket] += sentiment * 0.1

      // Ensure values stay in reasonable range
      this.huePreferences[hueBucket] = Math.max(0.1, Math.min(2, this.huePreferences[hueBucket]))

      // Update saturation and lightness preferences (weighted average)
      const weight = 0.1
      this.saturationPreference = (1 - weight) * this.saturationPreference + weight * sentiment * s
      this.lightnessPreference = (1 - weight) * this.lightnessPreference + weight * sentiment * l

      // Keep preferences in valid range
      this.saturationPreference = Math.max(0.1, Math.min(0.9, this.saturationPreference))
      this.lightnessPreference = Math.max(0.1, Math.min(0.9, this.lightnessPreference))

      // Update color bias
      this.colorBias.r = (1 - weight) * this.colorBias.r + weight * sentiment * (r / 255)
      this.colorBias.g = (1 - weight) * this.colorBias.g + weight * sentiment * (g / 255)
      this.colorBias.b = (1 - weight) * this.colorBias.b + weight * sentiment * (b / 255)

      // Keep bias in valid range
      this.colorBias.r = Math.max(0.1, Math.min(0.9, this.colorBias.r))
      this.colorBias.g = Math.max(0.1, Math.min(0.9, this.colorBias.g))
      this.colorBias.b = Math.max(0.1, Math.min(0.9, this.colorBias.b))

      // Add to liked or disliked colors
      if (sentiment > 0) {
        if (!this.likedColors.includes(color)) {
          this.likedColors.push(color)
        }
      } else {
        if (!this.dislikedColors.includes(color)) {
          this.dislikedColors.push(color)
        }
      }

      // Update color frequency
      const colorKey = `${r},${g},${b}`
      this.colorFrequency[colorKey] = (this.colorFrequency[colorKey] || 0) + 1
    })
  }

  // Generate a palette based on learned preferences
  public generatePalette(count: number, creativity = 0.5): string[] {
    const palette: string[] = []

    // Start with a seed color based on preferences
    const seedColor = this.generatePreferredColor(creativity)
    palette.push(seedColor)

    // Generate remaining colors
    for (let i = 1; i < count; i++) {
      // Mix between harmony-based and preference-based generation
      if (Math.random() < 0.7) {
        // Generate a color that harmonizes with existing colors
        const baseColor = palette[Math.floor(Math.random() * palette.length)]
        const { r, g, b } = hexToRgb(baseColor)
        const { h, s, l } = rgbToHsl(r, g, b)

        // Apply a hue shift based on color theory
        let hueShift: number
        const harmonyType = Math.random()

        if (harmonyType < 0.3) {
          // Analogous
          hueShift = Math.random() * 40 - 20
        } else if (harmonyType < 0.6) {
          // Complementary
          hueShift = 180 + (Math.random() * 20 - 10)
        } else if (harmonyType < 0.8) {
          // Triadic
          hueShift = 120 * (Math.floor(Math.random() * 2) + 1) + (Math.random() * 20 - 10)
        } else {
          // Split complementary
          hueShift = 180 + (Math.random() > 0.5 ? 30 : -30) + (Math.random() * 20 - 10)
        }

        const newHue = (h + hueShift + 360) % 360

        // Vary saturation and lightness slightly
        const newSat = Math.max(0.1, Math.min(0.9, s * (0.8 + Math.random() * 0.4)))
        const newLight = Math.max(0.1, Math.min(0.9, l * (0.8 + Math.random() * 0.4)))

        const { r: newR, g: newG, b: newB } = hslToRgb(newHue, newSat, newLight)
        const newColor = rgbToHex(newR, newG, newB)

        // Check if too similar to existing colors
        if (!this.isTooSimilar(newColor, palette, 30)) {
          palette.push(newColor)
        } else {
          // If too similar, generate a preferred color instead
          palette.push(this.generatePreferredColor(creativity))
        }
      } else {
        // Generate a color based on learned preferences
        palette.push(this.generatePreferredColor(creativity))
      }
    }

    return palette
  }

  // Generate a color based on learned preferences
  private generatePreferredColor(creativity: number): string {
    // Occasionally use a previously liked color
    if (this.likedColors.length > 0 && Math.random() > creativity) {
      return this.likedColors[Math.floor(Math.random() * this.likedColors.length)]
    }

    // Generate a new color based on preferences
    // Select a hue based on weighted preferences
    const hueWeights = [...this.huePreferences]
    const totalWeight = hueWeights.reduce((sum, weight) => sum + weight, 0)
    let randomWeight = Math.random() * totalWeight
    let selectedHueBucket = 0

    for (let i = 0; i < hueWeights.length; i++) {
      randomWeight -= hueWeights[i]
      if (randomWeight <= 0) {
        selectedHueBucket = i
        break
      }
    }

    // Convert bucket to hue value (0-360)
    let hue = selectedHueBucket * 10 + Math.random() * 10

    // Add some randomness based on creativity
    hue = (hue + creativity * Math.random() * 60 - 30 + 360) % 360

    // Use preferred saturation and lightness with some variation
    const saturation = Math.max(
      0.1,
      Math.min(0.9, this.saturationPreference * (1 - creativity * 0.5) + Math.random() * creativity * 0.8),
    )

    const lightness = Math.max(
      0.1,
      Math.min(0.9, this.lightnessPreference * (1 - creativity * 0.5) + Math.random() * creativity * 0.8),
    )

    // Convert to RGB and apply color bias
    let { r, g, b } = hslToRgb(hue, saturation, lightness)

    // Apply color bias if creativity is low
    if (creativity < 0.7) {
      const biasStrength = 0.3 * (1 - creativity)
      r = Math.round(r * (1 - biasStrength) + 255 * this.colorBias.r * biasStrength)
      g = Math.round(g * (1 - biasStrength) + 255 * this.colorBias.g * biasStrength)
      b = Math.round(b * (1 - biasStrength) + 255 * this.colorBias.b * biasStrength)
    }

    // Ensure we avoid disliked colors
    const newColor = rgbToHex(r, g, b)
    if (this.isDisliked(newColor)) {
      // If disliked, try again with more creativity
      return this.generatePreferredColor(Math.min(1, creativity + 0.2))
    }

    return newColor
  }

  // Check if a color is too similar to colors in a palette
  private isTooSimilar(color: string, palette: string[], threshold: number): boolean {
    const { r: r1, g: g1, b: b1 } = hexToRgb(color)

    for (const existingColor of palette) {
      const { r: r2, g: g2, b: b2 } = hexToRgb(existingColor)

      // Calculate color distance (Euclidean distance in RGB space)
      const distance = Math.sqrt(Math.pow(r1 - r2, 2) + Math.pow(g1 - g2, 2) + Math.pow(b1 - b2, 2))

      if (distance < threshold) {
        return true
      }
    }

    return false
  }

  // Check if a color is similar to disliked colors
  private isDisliked(color: string): boolean {
    if (this.dislikedColors.length === 0) return false

    const { r: r1, g: g1, b: b1 } = hexToRgb(color)

    for (const dislikedColor of this.dislikedColors) {
      const { r: r2, g: g2, b: b2 } = hexToRgb(dislikedColor)

      // Calculate color distance
      const distance = Math.sqrt(Math.pow(r1 - r2, 2) + Math.pow(g1 - g2, 2) + Math.pow(b1 - b2, 2))

      if (distance < 30) {
        return true
      }
    }

    return false
  }

  // Set color bias directly
  public setColorBias(bias: { r: number; g: number; b: number }): void {
    this.colorBias = { ...bias }
  }

  // Set saturation preference directly
  public setSaturationPreference(value: number): void {
    this.saturationPreference = Math.max(0.1, Math.min(0.9, value))
  }

  // Set lightness preference directly
  public setLightnessPreference(value: number): void {
    this.lightnessPreference = Math.max(0.1, Math.min(0.9, value))
  }

  // Reset all preferences
  public resetPreferences(): void {
    this.huePreferences = Array(36).fill(1)
    this.saturationPreference = 0.5
    this.lightnessPreference = 0.5
    this.colorBias = { r: 0.5, g: 0.5, b: 0.5 }
  }

  // Reset everything
  public reset(): void {
    this.likedColors = []
    this.dislikedColors = []
    this.colorFrequency = {}
    this.resetPreferences()
  }

  // Save learning data to JSON string
  public saveToJSON(): string {
    return JSON.stringify({
      likedColors: this.likedColors,
      dislikedColors: this.dislikedColors,
      colorFrequency: this.colorFrequency,
      huePreferences: this.huePreferences,
      saturationPreference: this.saturationPreference,
      lightnessPreference: this.lightnessPreference,
      colorBias: this.colorBias,
    })
  }

  // Load learning data from JSON string
  public loadFromJSON(json: string): void {
    try {
      const data = JSON.parse(json)
      this.likedColors = data.likedColors || []
      this.dislikedColors = data.dislikedColors || []
      this.colorFrequency = data.colorFrequency || {}
      this.huePreferences = data.huePreferences || Array(36).fill(1)
      this.saturationPreference = data.saturationPreference || 0.5
      this.lightnessPreference = data.lightnessPreference || 0.5
      this.colorBias = data.colorBias || { r: 0.5, g: 0.5, b: 0.5 }
    } catch (e) {
      console.error("Error loading learning data:", e)
      this.reset()
    }
  }

  // Get statistics about the learning engine
  public getTotalSamples(): number {
    return this.likedColors.length + this.dislikedColors.length
  }

  public getLikedColorsCount(): number {
    return this.likedColors.length
  }

  public getDislikedColorsCount(): number {
    return this.dislikedColors.length
  }

  public getConfidenceScore(): number {
    const totalSamples = this.getTotalSamples()
    if (totalSamples === 0) return 0

    // Calculate confidence based on number of samples and preference strength
    const maxSamples = 50 // Arbitrary number for max confidence
    const sampleConfidence = Math.min(1, totalSamples / maxSamples)

    // Calculate preference strength
    const preferenceStrength =
      this.huePreferences.reduce((sum, weight) => {
        // How far from neutral (1) is this weight?
        return sum + Math.abs(weight - 1)
      }, 0) / this.huePreferences.length

    return sampleConfidence * (0.5 + preferenceStrength * 0.5)
  }
}
