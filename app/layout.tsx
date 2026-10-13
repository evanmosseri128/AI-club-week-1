import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'AI LAB — The Ultimate AI Club Playground',
  description: 'A hands-on AI playground for curious students. Build agents, take challenges, and experiment with machine learning.',
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}