'use client'

import { PortfolioSection } from '@/types/portfolio'

interface SmartNavigationProps {
  sections: PortfolioSection[]
  portfolioId: string
}

export default function SmartNavigation({ sections }: SmartNavigationProps) {
  // Auto-generate navigation items based on sections
  const getNavigationItems = () => {
    const navItems: Array<{ name: string; href: string; icon: string }> = []
    
    sections.forEach(section => {
      switch (section.type) {
        case 'hero':
          navItems.push({ name: 'Home', href: '#home', icon: '🏠' })
          break
        case 'about':
          navItems.push({ name: 'About', href: '#about', icon: '👋' })
          break
        case 'projects':
          navItems.push({ name: 'Projects', href: '#projects', icon: '💼' })
          break
        case 'skills':
          navItems.push({ name: 'Skills', href: '#skills', icon: '⚡' })
          break
        case 'experience':
          navItems.push({ name: 'Experience', href: '#experience', icon: '🏢' })
          break
        case 'education':
          navItems.push({ name: 'Education', href: '#education', icon: '🎓' })
          break
        case 'contact':
          navItems.push({ name: 'Contact', href: '#contact', icon: '📬' })
          break
      }
    })

    // Always include Home if hero section exists, otherwise add a default
    if (!navItems.some(item => item.name === 'Home') && sections.some(s => s.type === 'hero')) {
      navItems.unshift({ name: 'Home', href: '#home', icon: '🏠' })
    }

    return navItems
  }

  const navigationItems = getNavigationItems()

  return (
    <div className="bg-white border-2 border-blue-200 rounded-lg shadow-sm overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
        <h3 className="text-lg font-semibold mb-4">🧭 Smart Navigation</h3>
        <div className="text-sm text-blue-100 mb-4">
          Auto-updates based on your sections
        </div>
        
        <nav className="flex flex-wrap gap-4">
          {navigationItems.length > 0 ? (
            navigationItems.map((item, index) => (
              <a
                key={index}
                href={item.href}
                className="flex items-center space-x-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors text-white font-medium"
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item.name}</span>
              </a>
            ))
          ) : (
            <div className="text-blue-100 italic text-center py-4">
              Add sections to see navigation items appear here automatically
            </div>
          )}
        </nav>
        
        {navigationItems.length > 0 && (
          <div className="mt-4 text-xs text-blue-200">
            ✨ Navigation items added: {navigationItems.map(item => item.name).join(', ')}
          </div>
        )}
      </div>
    </div>
  )
}
