import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Student Mart - CSULB Marketplace',
  description: 'Buy and sell items with verified CSULB students',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
