'use client'
import { useState } from 'react'
import type { Screen } from '@/types'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'
import { BottomNav } from './BottomNav'
import './EnhancedLayout.css'

interface EnhancedLayoutProps {
  children: React.ReactNode
  activeScreen: Screen
  onNavigate: (screen: Screen) => void
}

export function EnhancedLayout({
  children,
  activeScreen,
  onNavigate,
}: EnhancedLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div className="enhanced-layout">
      {/* Desktop Navigation */}
      <Sidebar activeScreen={activeScreen} onNavigate={onNavigate} />
      <Topbar activeScreen={activeScreen} onNavigate={onNavigate} />

      {/* Main Content */}
      <main className="layout-main" style={{ paddingTop: '64px' }}>
        {children}
      </main>

      {/* Mobile Navigation */}
      <BottomNav activeScreen={activeScreen} onNavigate={onNavigate} />
    </div>
  )
}
