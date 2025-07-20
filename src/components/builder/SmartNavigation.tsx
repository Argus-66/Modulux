'use client'

import { PortfolioSection } from '@/types/portfolio'

interface SmartNavigationProps {
  sections: PortfolioSection[]
  portfolioId: string
}

export default function SmartNavigation({ sections }: SmartNavigationProps) {
  // Auto-generate navigation items based on sections - NO IMAGES
  const getNavigationItems = () => {
    const navItems: Array<{ name: string; href: string }> = []
    
    sections.forEach(section => {
      switch (section.type) {
        case 'hero':
          navItems.push({ name: 'Home', href: '#home' })
          break
        case 'about':
          navItems.push({ name: 'About', href: '#about' })
          break
        case 'projects':
          navItems.push({ name: 'Projects', href: '#projects' })
          break
        case 'skills':
          navItems.push({ name: 'Skills', href: '#skills' })
          break
        case 'experience':
          navItems.push({ name: 'Experience', href: '#experience' })
          break
        case 'education':
          navItems.push({ name: 'Education', href: '#education' })
          break
        case 'contact':
          navItems.push({ name: 'Contact', href: '#contact' })
          break
      }
    })

    return navItems
  }

  const navigationItems = getNavigationItems()

  return (
    <div className="bg-white border-2 border-blue-200 rounded-lg shadow-sm overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
        <nav className="flex flex-wrap gap-6 justify-center">
          {navigationItems.length > 0 ? (
            navigationItems.map((item, index) => (
              <a
                key={index}
                href={item.href}
                className="text-white hover:text-blue-200 font-medium text-lg transition-colors border-b-2 border-transparent hover:border-blue-200 pb-1"
              >
                {item.name}
              </a>
            ))
          ) : (
            <div className="text-blue-100 italic text-center py-4">
              Add sections to see navigation items appear here automatically
            </div>
          )}
        </nav>
        
        {navigationItems.length > 0 && (
          <div className="mt-4 text-center text-sm text-blue-200">
            ✨ Auto-generated from your sections: {navigationItems.map(item => item.name).join(' • ')}
          </div>
        )}
      </div>
    </div>
  )
}
