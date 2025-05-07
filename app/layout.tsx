import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { GitHubPagesProvider } from "@/components/github-pages-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "AI Color Palette Generator",
  description: "Generate intelligent color palettes that learn from your preferences",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <GitHubPagesProvider>{children}</GitHubPagesProvider>
      </body>
    </html>
  )
}
