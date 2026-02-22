import type { Metadata, Viewport } from 'next'
import { Inter, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Toaster } from 'sonner'
import { ProgressProvider } from '@/lib/progress-context'
import './globals.css'

const _inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const _geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });

export const metadata: Metadata = {
  title: 'SKZ Fun Lab',
  description: 'A fan-made interactive gift — quizzes, mini-games, and badges for the ultimate stan.',
}

export const viewport: Viewport = {
  themeColor: '#0B0B0F',
  userScalable: true,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${_inter.variable} ${_geistMono.variable} font-sans antialiased`}>
        <ProgressProvider>
          {children}
          <Toaster
            theme="dark"
            toastOptions={{
              style: {
                background: '#121218',
                border: '1px solid #2A2A36',
                color: '#EAEAEF',
              },
            }}
          />
        </ProgressProvider>
        <Analytics />
      </body>
    </html>
  )
}
