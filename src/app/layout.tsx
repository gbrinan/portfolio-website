/**
 * Root Layout
 * Provides global context and styling for the portfolio website
 */

import type { Metadata } from 'next'
import { Inter, Orbitron, Quicksand } from 'next/font/google'
import './globals.css'

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
})

const orbitron = Orbitron({
  variable: '--font-orbitron',
  subsets: ['latin'],
  display: 'swap',
})

const quicksand = Quicksand({
  variable: '--font-quicksand',
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Portfolio - AI Artist & AX Expert',
  description: 'A dual-identity portfolio showcasing AI art and accessibility expertise',
  keywords: ['portfolio', 'AI art', 'accessibility', 'web development'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${orbitron.variable} ${quicksand.variable} font-sans antialiased`}
        style={{
          backgroundColor: 'var(--background)',
          color: 'var(--foreground)',
        }}
      >
        {children}
      </body>
    </html>
  )
}
