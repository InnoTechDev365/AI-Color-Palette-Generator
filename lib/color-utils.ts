// Generate a random hex color
export function generateRandomColor(): string {
  return (
    "#" +
    Math.floor(Math.random() * 16777215)
      .toString(16)
      .padStart(6, "0")
  )
}

// Generate a palette of random colors
export function generateRandomPalette(count: number): string[] {
  return Array.from({ length: count }, () => generateRandomColor())
}

// Convert hex color to RGB
export function hexToRgb(hex: string): { r: number; g: number; b: number } {
  // Remove the hash if it exists
  hex = hex.replace(/^#/, "")

  // Parse the hex values
  const bigint = Number.parseInt(hex, 16)
  const r = (bigint >> 16) & 255
  const g = (bigint >> 8) & 255
  const b = bigint & 255

  return { r, g, b }
}

// Convert RGB to hex
export function rgbToHex(r: number, g: number, b: number): string {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)
}

// Generate a harmonious color palette based on a seed color
export function generateHarmoniousPalette(seedColor: string, count: number): string[] {
  const { r, g, b } = hexToRgb(seedColor)
  const hsl = rgbToHsl(r, g, b)

  const palette: string[] = [seedColor]

  // Generate colors with evenly spaced hues
  const hueStep = 360 / count

  for (let i = 1; i < count; i++) {
    const newHue = (hsl.h + i * hueStep) % 360
    const { r: newR, g: newG, b: newB } = hslToRgb(newHue, hsl.s, hsl.l)
    palette.push(rgbToHex(newR, newG, newB))
  }

  return palette
}

// Generate an analogous color palette
export function generateAnalogousPalette(baseColor: string, count: number): string[] {
  const { r, g, b } = hexToRgb(baseColor)
  const hsl = rgbToHsl(r, g, b)

  const palette: string[] = [baseColor]
  const hueStep = 30 // Analogous colors are typically 30 degrees apart

  // Generate colors on both sides of the base color
  const sideCount = Math.floor(count / 2)

  for (let i = 1; i <= sideCount; i++) {
    // Colors to the right
    const rightHue = (hsl.h + i * hueStep) % 360
    const { r: rightR, g: rightG, b: rightB } = hslToRgb(rightHue, hsl.s, hsl.l)
    palette.push(rgbToHex(rightR, rightG, rightB))

    // Colors to the left if we need more
    if (palette.length < count) {
      const leftHue = (hsl.h - i * hueStep + 360) % 360
      const { r: leftR, g: leftG, b: leftB } = hslToRgb(leftHue, hsl.s, hsl.l)
      palette.push(rgbToHex(leftR, leftG, leftB))
    }
  }

  // If we need one more color (for odd counts)
  if (palette.length < count) {
    const lastHue = (hsl.h + (sideCount + 1) * hueStep) % 360
    const { r: lastR, g: lastG, b: lastB } = hslToRgb(lastHue, hsl.s, hsl.l)
    palette.push(rgbToHex(lastR, lastG, lastB))
  }

  return palette
}

// Generate a monochromatic color palette
export function generateMonochromaticPalette(baseColor: string, count: number): string[] {
  const { r, g, b } = hexToRgb(baseColor)
  const hsl = rgbToHsl(r, g, b)

  const palette: string[] = []

  // Vary lightness to create monochromatic palette
  for (let i = 0; i < count; i++) {
    const newLightness = 20 + (i * 60) / (count - 1) // Range from 20% to 80%
    const { r: newR, g: newG, b: newB } = hslToRgb(hsl.h, hsl.s, newLightness / 100)
    palette.push(rgbToHex(newR, newG, newB))
  }

  return palette
}

// Generate a complementary color palette
export function generateComplementaryPalette(baseColor: string, count: number): string[] {
  const { r, g, b } = hexToRgb(baseColor)
  const hsl = rgbToHsl(r, g, b)

  // Complementary color (opposite on the color wheel)
  const complementaryHue = (hsl.h + 180) % 360

  const palette: string[] = [baseColor]

  // Add variations of the base and complementary colors
  const variations = count - 2 // Excluding base and pure complementary

  if (variations > 0) {
    const variationsPerSide = Math.floor(variations / 2)

    // Add variations of the base color
    for (let i = 1; i <= variationsPerSide; i++) {
      const satFactor = 1 - i * 0.2
      const { r: newR, g: newG, b: newB } = hslToRgb(hsl.h, hsl.s * satFactor, hsl.l)
      palette.push(rgbToHex(newR, newG, newB))
    }

    // Add the complementary color
    const { r: compR, g: compG, b: compB } = hslToRgb(complementaryHue, hsl.s, hsl.l)
    palette.push(rgbToHex(compR, compG, compB))

    // Add variations of the complementary color
    for (let i = 1; i <= variations - variationsPerSide; i++) {
      const satFactor = 1 - i * 0.2
      const { r: newR, g: newG, b: newB } = hslToRgb(complementaryHue, hsl.s * satFactor, hsl.l)
      palette.push(rgbToHex(newR, newG, newB))
    }
  } else {
    // Just add the complementary color if we only need 2 colors
    const { r: compR, g: compG, b: compB } = hslToRgb(complementaryHue, hsl.s, hsl.l)
    palette.push(rgbToHex(compR, compG, compB))
  }

  return palette
}

// Generate a triadic color palette
export function generateTriadicPalette(baseColor: string, count: number): string[] {
  const { r, g, b } = hexToRgb(baseColor)
  const hsl = rgbToHsl(r, g, b)

  // Triadic colors (120 degrees apart on the color wheel)
  const triad1Hue = (hsl.h + 120) % 360
  const triad2Hue = (hsl.h + 240) % 360

  const palette: string[] = [baseColor]

  // If we need more than 3 colors, add variations
  if (count <= 3) {
    // Just add the triadic colors
    const { r: t1R, g: t1G, b: t1B } = hslToRgb(triad1Hue, hsl.s, hsl.l)
    palette.push(rgbToHex(t1R, t1G, t1B))

    if (count === 3) {
      const { r: t2R, g: t2G, b: t2B } = hslToRgb(triad2Hue, hsl.s, hsl.l)
      palette.push(rgbToHex(t2R, t2G, t2B))
    }
  } else {
    // Add the triadic colors
    const { r: t1R, g: t1G, b: t1B } = hslToRgb(triad1Hue, hsl.s, hsl.l)
    const { r: t2R, g: t2G, b: t2B } = hslToRgb(triad2Hue, hsl.s, hsl.l)
    palette.push(rgbToHex(t1R, t1G, t1B))
    palette.push(rgbToHex(t2R, t2G, t2B))

    // Add variations to fill the remaining slots
    const remaining = count - 3
    for (let i = 0; i < remaining; i++) {
      const hueOffset = (i * 30) % 360
      const newHue = (hsl.h + hueOffset) % 360
      const { r: newR, g: newG, b: newB } = hslToRgb(newHue, hsl.s * 0.8, hsl.l)
      palette.push(rgbToHex(newR, newG, newB))
    }
  }

  return palette
}

// Generate a tetradic (rectangle) color palette
export function generateTetradicPalette(baseColor: string, count: number): string[] {
  const { r, g, b } = hexToRgb(baseColor)
  const hsl = rgbToHsl(r, g, b)

  // Tetradic colors (60 and 180 degrees apart)
  const tetra1Hue = (hsl.h + 60) % 360
  const tetra2Hue = (hsl.h + 180) % 360
  const tetra3Hue = (hsl.h + 240) % 360

  const palette: string[] = [baseColor]

  // If we need more than 4 colors, add variations
  if (count <= 4) {
    // Just add the tetradic colors
    if (count >= 2) {
      const { r: t1R, g: t1G, b: t1B } = hslToRgb(tetra1Hue, hsl.s, hsl.l)
      palette.push(rgbToHex(t1R, t1G, t1B))
    }

    if (count >= 3) {
      const { r: t2R, g: t2G, b: t2B } = hslToRgb(tetra2Hue, hsl.s, hsl.l)
      palette.push(rgbToHex(t2R, t2G, t2B))
    }

    if (count === 4) {
      const { r: t3R, g: t3G, b: t3B } = hslToRgb(tetra3Hue, hsl.s, hsl.l)
      palette.push(rgbToHex(t3R, t3G, t3B))
    }
  } else {
    // Add the tetradic colors
    const { r: t1R, g: t1G, b: t1B } = hslToRgb(tetra1Hue, hsl.s, hsl.l)
    const { r: t2R, g: t2G, b: t2B } = hslToRgb(tetra2Hue, hsl.s, hsl.l)
    const { r: t3R, g: t3G, b: t3B } = hslToRgb(tetra3Hue, hsl.s, hsl.l)
    palette.push(rgbToHex(t1R, t1G, t1B))
    palette.push(rgbToHex(t2R, t2G, t2B))
    palette.push(rgbToHex(t3R, t3G, t3B))

    // Add variations to fill the remaining slots
    const remaining = count - 4
    for (let i = 0; i < remaining; i++) {
      const baseIndex = i % 4
      let baseHue: number

      switch (baseIndex) {
        case 0:
          baseHue = hsl.h
          break
        case 1:
          baseHue = tetra1Hue
          break
        case 2:
          baseHue = tetra2Hue
          break
        case 3:
          baseHue = tetra3Hue
          break
        default:
          baseHue = hsl.h
      }

      const { r: newR, g: newG, b: newB } = hslToRgb(baseHue, hsl.s * 0.7, (hsl.l * 1.2) % 1)
      palette.push(rgbToHex(newR, newG, newB))
    }
  }

  return palette
}

// Convert RGB to HSL
export function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  r /= 255
  g /= 255
  b /= 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h = 0,
    s,
    l = (max + min) / 2

  if (max === min) {
    h = s = 0 // achromatic
  } else {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)

    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0)
        break
      case g:
        h = (b - r) / d + 2
        break
      case b:
        h = (r - g) / d + 4
        break
    }

    h /= 6
  }

  return { h: h * 360, s, l }
}

// Convert HSL to RGB
export function hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
  h /= 360

  let r, g, b

  if (s === 0) {
    r = g = b = l // achromatic
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1
      if (t > 1) t -= 1
      if (t < 1 / 6) return p + (q - p) * 6 * t
      if (t < 1 / 2) return q
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
      return p
    }

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s
    const p = 2 * l - q

    r = hue2rgb(p, q, h + 1 / 3)
    g = hue2rgb(p, q, h)
    b = hue2rgb(p, q, h - 1 / 3)
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  }
}

// Get a human-readable name for a color
export function getColorName(hexColor: string): string {
  const { r, g, b } = hexToRgb(hexColor)
  const hsl = rgbToHsl(r, g, b)

  // Basic color naming based on HSL values
  let name = ""

  // Determine lightness name
  if (hsl.l < 0.2) {
    name = "Dark "
  } else if (hsl.l > 0.8) {
    name = "Light "
  } else if (hsl.l > 0.6) {
    name = "Pale "
  }

  // Determine saturation name
  if (hsl.s < 0.15) {
    if (hsl.l < 0.2) return "Black"
    if (hsl.l > 0.8) return "White"
    return `Gray (${Math.round(hsl.l * 100)}%)`
  }

  if (hsl.s < 0.3) {
    name += "Muted "
  } else if (hsl.s > 0.8) {
    name += "Vibrant "
  }

  // Determine hue name
  if (hsl.h >= 0 && hsl.h < 30) {
    name += "Red"
  } else if (hsl.h >= 30 && hsl.h < 60) {
    name += "Orange"
  } else if (hsl.h >= 60 && hsl.h < 90) {
    name += "Yellow"
  } else if (hsl.h >= 90 && hsl.h < 150) {
    name += "Green"
  } else if (hsl.h >= 150 && hsl.h < 210) {
    name += "Cyan"
  } else if (hsl.h >= 210 && hsl.h < 270) {
    name += "Blue"
  } else if (hsl.h >= 270 && hsl.h < 330) {
    name += "Purple"
  } else {
    name += "Pink"
  }

  return name
}

// Get harmonious colors for a given color
export function getColorHarmony(hexColor: string): string[] {
  const { r, g, b } = hexToRgb(hexColor)
  const hsl = rgbToHsl(r, g, b)

  const harmony: string[] = []

  // Complementary
  const complementaryHue = (hsl.h + 180) % 360
  const { r: compR, g: compG, b: compB } = hslToRgb(complementaryHue, hsl.s, hsl.l)
  harmony.push(rgbToHex(compR, compG, compB))

  // Analogous (30 degrees away)
  const analogous1Hue = (hsl.h + 30) % 360
  const { r: ana1R, g: ana1G, b: ana1B } = hslToRgb(analogous1Hue, hsl.s, hsl.l)
  harmony.push(rgbToHex(ana1R, ana1G, ana1B))

  // Analogous (330 degrees away)
  const analogous2Hue = (hsl.h - 30 + 360) % 360
  const { r: ana2R, g: ana2G, b: ana2B } = hslToRgb(analogous2Hue, hsl.s, hsl.l)
  harmony.push(rgbToHex(ana2R, ana2G, ana2B))

  // Triadic (120 degrees away)
  const triadic1Hue = (hsl.h + 120) % 360
  const { r: tri1R, g: tri1G, b: tri1B } = hslToRgb(triadic1Hue, hsl.s, hsl.l)
  harmony.push(rgbToHex(tri1R, tri1G, tri1B))

  return harmony
}

// Get accessibility information for a color
export function getColorAccessibility(hexColor: string): { whiteContrast: number; blackContrast: number } {
  const { r, g, b } = hexToRgb(hexColor)

  // Calculate relative luminance
  const rsrgb = r / 255
  const gsrgb = g / 255
  const bsrgb = b / 255

  const r1 = rsrgb <= 0.03928 ? rsrgb / 12.92 : Math.pow((rsrgb + 0.055) / 1.055, 2.4)
  const g1 = gsrgb <= 0.03928 ? gsrgb / 12.92 : Math.pow((gsrgb + 0.055) / 1.055, 2.4)
  const b1 = bsrgb <= 0.03928 ? bsrgb / 12.92 : Math.pow((bsrgb + 0.055) / 1.055, 2.4)

  const luminance = 0.2126 * r1 + 0.7152 * g1 + 0.0722 * b1

  // Calculate contrast with white (luminance = 1)
  const whiteContrast = (1 + 0.05) / (luminance + 0.05)

  // Calculate contrast with black (luminance = 0)
  const blackContrast = (luminance + 0.05) / (0 + 0.05)

  return { whiteContrast, blackContrast }
}

// Get liked colors from learning data
export function getLikedColors(learningData: any): string[] {
  if (!learningData || !learningData.likedColors) return []
  return learningData.likedColors
}

// Get color preferences from learning data
export function getColorPreferences(learningData: any): {
  hue: number
  saturation: number
  lightness: number
} {
  if (!learningData || !learningData.preferences) {
    return { hue: 0, saturation: 0.5, lightness: 0.5 }
  }
  return learningData.preferences
}
