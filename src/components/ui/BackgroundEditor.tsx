'use client'

import { useState } from 'react'
import { Palette, Paintbrush2 } from 'lucide-react'

interface BackgroundEditorProps {
  background: SectionBackground
  onBackgroundChange: (background: SectionBackground) => void
}

interface SectionBackground {
  type: 'solid' | 'gradient'
  color?: string
  gradient?: {
    from: string
    to: string
    direction: 'to-r' | 'to-l' | 'to-t' | 'to-b' | 'to-br' | 'to-bl' | 'to-tr' | 'to-tl'
  }
}

export default function BackgroundEditor({ background, onBackgroundChange }: BackgroundEditorProps) {
  const [isOpen, setIsOpen] = useState(false)

  const gradientDirections = [
    { value: 'to-r', label: 'Right →' },
    { value: 'to-l', label: '← Left' },
    { value: 'to-t', label: '↑ Up' },
    { value: 'to-b', label: '↓ Down' },
    { value: 'to-br', label: '↘ Bottom Right' },
    { value: 'to-bl', label: '↙ Bottom Left' },
    { value: 'to-tr', label: '↗ Top Right' },
    { value: 'to-tl', label: '↖ Top Left' }
  ]

  const presetGradients = [
    { name: 'Ocean Blue', from: '#2563eb', to: '#7c3aed' },
    { name: 'Sunset', from: '#f59e0b', to: '#ef4444' },
    { name: 'Forest', from: '#059669', to: '#0d9488' },
    { name: 'Purple Dream', from: '#8b5cf6', to: '#ec4899' },
    { name: 'Cool Gray', from: '#6b7280', to: '#374151' }
  ]

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
      >
        {background.type === 'gradient' ? <Paintbrush2 className="w-4 h-4" /> : <Palette className="w-4 h-4" />}
        <span className="text-sm">Background</span>
      </button>

      {isOpen && (
        <div className="absolute top-10 right-0 bg-white border border-gray-200 rounded-lg shadow-lg p-4 w-80 z-50">
          <h3 className="font-semibold mb-4 flex items-center">
            <Palette className="w-4 h-4 mr-2" />
            Section Background
          </h3>

          {/* Background Type Selector */}
          <div className="flex bg-gray-100 rounded-lg p-1 mb-4">
            <button
              onClick={() => onBackgroundChange({ ...background, type: 'solid' })}
              className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                background.type === 'solid' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'
              }`}
            >
              Solid Color
            </button>
            <button
              onClick={() => onBackgroundChange({ ...background, type: 'gradient' })}
              className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                background.type === 'gradient' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'
              }`}
            >
              Gradient
            </button>
          </div>

          {background.type === 'solid' ? (
            <div>
              <label className="block text-sm font-medium mb-2">Color</label>
              <div className="flex items-center space-x-2">
                <input
                  type="color"
                  value={background.color || '#ffffff'}
                  onChange={(e) => onBackgroundChange({ ...background, color: e.target.value })}
                  className="w-12 h-12 border rounded-lg cursor-pointer"
                />
                <span className="text-sm text-gray-600">{background.color || '#ffffff'}</span>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">From Color</label>
                <input
                  type="color"
                  value={background.gradient?.from || '#2563eb'}
                  onChange={(e) => onBackgroundChange({
                    ...background,
                    gradient: { ...background.gradient, from: e.target.value, to: background.gradient?.to || '#7c3aed', direction: background.gradient?.direction || 'to-r' }
                  })}
                  className="w-12 h-12 border rounded-lg cursor-pointer"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">To Color</label>
                <input
                  type="color"
                  value={background.gradient?.to || '#7c3aed'}
                  onChange={(e) => onBackgroundChange({
                    ...background,
                    gradient: { ...background.gradient, from: background.gradient?.from || '#2563eb', to: e.target.value, direction: background.gradient?.direction || 'to-r' }
                  })}
                  className="w-12 h-12 border rounded-lg cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Direction</label>
                <select
                  value={background.gradient?.direction || 'to-r'}
                  onChange={(e) => onBackgroundChange({
                    ...background,
                    gradient: { ...background.gradient, from: background.gradient?.from || '#2563eb', to: background.gradient?.to || '#7c3aed', direction: e.target.value as any }
                  })}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                >
                  {gradientDirections.map(dir => (
                    <option key={dir.value} value={dir.value}>{dir.label}</option>
                  ))}
                </select>
              </div>

              {/* Preset Gradients */}
              <div>
                <label className="block text-sm font-medium mb-2">Quick Presets</label>
                <div className="grid grid-cols-1 gap-2">
                  {presetGradients.map(preset => (
                    <button
                      key={preset.name}
                      onClick={() => onBackgroundChange({
                        ...background,
                        gradient: { from: preset.from, to: preset.to, direction: 'to-r' }
                      })}
                      className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors text-left"
                    >
                      <div 
                        className="w-8 h-8 rounded-lg border"
                        style={{ background: `linear-gradient(to right, ${preset.from}, ${preset.to})` }}
                      />
                      <span className="text-sm">{preset.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
