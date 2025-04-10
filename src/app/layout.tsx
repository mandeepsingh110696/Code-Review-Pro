import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import CssBaseline from "@mui/material/CssBaseline"
import "./globals.css"
import { ThemeProvider } from "./components/ThemeProvider"
import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter"
const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Code Reviewer Pro",
  description: "A code review application built with Next.js and MUI",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AppRouterCacheProvider>
          <ThemeProvider>
            <CssBaseline />
            {children}
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  )
}
