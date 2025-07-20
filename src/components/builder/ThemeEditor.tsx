'use client'

import { useState } from 'react'
import { Palette, Paintbrush } from 'lucide-react'
import Button from '@/components/ui/Button'

interface ThemeEditorProps {
  theme: {
    primaryColor: string
    secondaryColor: string
    backgroundColor: string
    textColor: string
  }
  onThemeChange: (theme: any) => void
}

export default function ThemeEditor({ theme, onThemeChange }: ThemeEditorProps) {
  const [isOpen, setIsOpen] = useState(false)

  const presetThemes = [
    {
      name: 'Blue Ocean',
      primaryColor: '#2563eb',
      secondaryColor: '#1e40af', 
      backgroundColor: '#ffffff',
      textColor: '#111827'
    },
    {
      name: 'Forest Green',
      primaryColor: '#059669',
      secondaryColor: '#047857',
      backgroundColor: '#ffffff', 
      textColor: '#111827'
    },
    {
      name: 'Sunset Orange',
      primaryColor: '#ea580c',
      secondaryColor: '#c2410c',
      backgroundColor: '#ffffff',
      textColor: '#111827'
    },
    {
      name: 'Purple Dream',
      primaryColor: '#7c3aed',
      secondaryColor: '#6d28d9',
      backgroundColor: '#ffffff',
      textColor: '#111827'
    },
    {
      name: 'Dark Mode',
      primaryColor: '#3b82f6',
      secondaryColor: '#2563eb',
      backgroundColor: '#111827',
      textColor: '#f9fafb'
    }
  ]

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Palette className="w-4 h-4 mr-2" />
        Theme
      </Button>

      {isOpen && (
        <div className="absolute top-10 right-0 bg-white border border-gray-200 rounded-lg shadow-lg p-4 w-80 z-50">
          <h3 className="font-semibold mb-4 flex items-center">
            <Paintbrush className="w-4 h-4 mr-2" />
            Customize Theme
          </h3>

          {/* Color Inputs */}
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium mb-1">Primary Color</label>
              <div className="flex items-center space-x-2">
                <input
                  type="color"
                  value={theme.primaryColor}
                  onChange={(e) => onThemeChange({ ...theme, primaryColor: e.target.value })}
                  className="w-10 h-10 border rounded cursor-pointer"
                />
                <span className="text-sm text-gray-600">{theme.primaryColor}</span>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Background</label>
              <div className="flex items-center space-x-2">
                <input
                  type="color"
                  value={theme.backgroundColor}
                  onChange={(e) => onThemeChange({ ...theme, backgroundColor: e.target.value })}
                  className="w-10 h-10 border rounded cursor-pointer"
                />
                <span className="text-sm text-gray-600">{theme.backgroundColor}</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Text Color</label>
              <div className="flex items-center space-x-2">
                <input
                  type="color"
                  value={theme.textColor}
                  onChange={(e) => onThemeChange({ ...theme, textColor: e.target.value })}
                  className="w-10 h-10 border rounded cursor-pointer"
                />
                <span className="text-sm text-gray-600">{theme.textColor}</span>
              </div>
            </div>
          </div>

          {/* Preset Themes */}
          <div>
            <h4 className="font-medium mb-3">Quick Presets</h4>
            <div className="grid grid-cols-1 gap-2">
              {presetThemes.map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => onThemeChange(preset)}
                  className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors text-left"
                >
                  <div className="flex space-x-1">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: preset.primaryColor }}
                    />
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: preset.backgroundColor }}
                    />
                  </div>
                  <span className="text-sm">{preset.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
