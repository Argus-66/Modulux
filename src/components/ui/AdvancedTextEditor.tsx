'use client'

import { useState, useRef, useEffect, useMemo } from 'react'
import { Edit3, Check, X, AlignLeft, AlignCenter, AlignRight, Type } from 'lucide-react'

interface AdvancedTextEditorProps {
  value: string
  onSave: (value: string, styles: TextStyles) => Promise<void>
  placeholder?: string
  className?: string
  multiline?: boolean
  maxLength?: number
  styles?: TextStyles
}

interface TextStyles {
  textAlign?: 'left' | 'center' | 'right'
  fontSize?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl'
  fontWeight?: 'normal' | 'medium' | 'semibold' | 'bold'
  color?: string
}

export default function AdvancedTextEditor({
  value = '',
  onSave,
  placeholder = 'Click to edit...',
  className = '',
  multiline = false,
  maxLength = 500,
  styles = {}
}: AdvancedTextEditorProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(value)
  const [showStylePanel, setShowStylePanel] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null)
  
  const stableStyles = useMemo(() => ({
    textAlign: 'left' as const,
    fontSize: 'base' as const,
    fontWeight: 'normal' as const,
    color: '#000000',
    ...styles
  }), [
    styles?.textAlign,
    styles?.fontSize,
    styles?.fontWeight,
    styles?.color
  ])

  const [currentStyles, setCurrentStyles] = useState<TextStyles>(stableStyles)

  const prevValueRef = useRef(value)
  const prevStylesRef = useRef(stableStyles)

  useEffect(() => {
    if (prevValueRef.current !== value) {
      setEditValue(value || '')
      prevValueRef.current = value
    }
  }, [value])

  useEffect(() => {
    const stylesChanged = 
      prevStylesRef.current.textAlign !== stableStyles.textAlign ||
      prevStylesRef.current.fontSize !== stableStyles.fontSize ||
      prevStylesRef.current.fontWeight !== stableStyles.fontWeight ||
      prevStylesRef.current.color !== stableStyles.color

    if (stylesChanged) {
      setCurrentStyles(stableStyles)
      prevStylesRef.current = stableStyles
    }
  }, [stableStyles])

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      if (!multiline) {
        inputRef.current.select()
      }
    }
  }, [isEditing, multiline])

  const handleSave = async () => {
    if (editValue === value && 
        currentStyles.textAlign === stableStyles.textAlign &&
        currentStyles.fontSize === stableStyles.fontSize &&
        currentStyles.fontWeight === stableStyles.fontWeight &&
        currentStyles.color === stableStyles.color) {
      setIsEditing(false)
      setShowStylePanel(false)
      return
    }

    try {
      setIsSaving(true)
      await onSave(editValue, currentStyles)
      setIsEditing(false)
      setShowStylePanel(false)
    } catch (error) {
      console.error('Failed to save:', error)
      setEditValue(value)
      setCurrentStyles(stableStyles)
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    setEditValue(value)
    setCurrentStyles(stableStyles)
    setIsEditing(false)
    setShowStylePanel(false)
  }

  // FIX: Handle keyboard events - Enter saves, Escape cancels
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !multiline) {
      e.preventDefault()
      handleSave()
    } else if (e.key === 'Enter' && multiline && (e.ctrlKey || e.metaKey)) {
      e.preventDefault()
      handleSave()
    } else if (e.key === 'Escape') {
      e.preventDefault()
      handleCancel()
    }
  }

  const getStyleClasses = () => {
    const alignmentClasses = {
      left: 'text-left',
      center: 'text-center',
      right: 'text-right'
    }
    
    const sizeClasses = {
      xs: 'text-xs',
      sm: 'text-sm',
      base: 'text-base',
      lg: 'text-lg',
      xl: 'text-xl',
      '2xl': 'text-2xl',
      '3xl': 'text-3xl',
      '4xl': 'text-4xl',
      '5xl': 'text-5xl',
      '6xl': 'text-6xl'
    }
    
    const weightClasses = {
      normal: 'font-normal',
      medium: 'font-medium',
      semibold: 'font-semibold',
      bold: 'font-bold'
    }

    return `${alignmentClasses[currentStyles.textAlign || 'left']} ${sizeClasses[currentStyles.fontSize || 'base']} ${weightClasses[currentStyles.fontWeight || 'normal']}`
  }

  if (isEditing) {
    return (
      <div className="relative">
        {/* Style Panel */}
        {showStylePanel && (
          <div className="absolute -top-20 left-0 right-0 bg-white border border-gray-300 rounded-lg shadow-lg p-4 z-30">
            <div className="grid grid-cols-4 gap-4 text-sm">
              {/* Alignment */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Alignment</label>
                <div className="flex border border-gray-300 rounded">
                  {(['left', 'center', 'right'] as const).map((align) => (
                    <button
                      key={align}
                      onClick={() => setCurrentStyles(prev => ({ ...prev, textAlign: align }))}
                      className={`flex-1 p-1 ${currentStyles.textAlign === align ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'}`}
                    >
                      {align === 'left' && <AlignLeft className="w-4 h-4" />}
                      {align === 'center' && <AlignCenter className="w-4 h-4" />}
                      {align === 'right' && <AlignRight className="w-4 h-4" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Font Size */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Size</label>
                <select
                  value={currentStyles.fontSize}
                  onChange={(e) => setCurrentStyles(prev => ({ ...prev, fontSize: e.target.value as any }))}
                  className="w-full border border-gray-300 rounded px-2 py-1 text-xs"
                >
                  <option value="xs">XS</option>
                  <option value="sm">SM</option>
                  <option value="base">Base</option>
                  <option value="lg">LG</option>
                  <option value="xl">XL</option>
                  <option value="2xl">2XL</option>
                  <option value="3xl">3XL</option>
                  <option value="4xl">4XL</option>
                  <option value="5xl">5XL</option>
                  <option value="6xl">6XL</option>
                </select>
              </div>

              {/* Font Weight */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Weight</label>
                <select
                  value={currentStyles.fontWeight}
                  onChange={(e) => setCurrentStyles(prev => ({ ...prev, fontWeight: e.target.value as any }))}
                  className="w-full border border-gray-300 rounded px-2 py-1 text-xs"
                >
                  <option value="normal">Normal</option>
                  <option value="medium">Medium</option>
                  <option value="semibold">Semibold</option>
                  <option value="bold">Bold</option>
                </select>
              </div>

              {/* Text Color */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Color</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    value={currentStyles.color}
                    onChange={(e) => setCurrentStyles(prev => ({ ...prev, color: e.target.value }))}
                    className="w-8 h-8 border border-gray-300 rounded cursor-pointer"
                  />
                  <span className="text-xs text-gray-600">{currentStyles.color}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Input Field with onKeyDown */}
        {multiline ? (
          <textarea
            ref={inputRef as React.RefObject<HTMLTextAreaElement>}
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            maxLength={maxLength}
            rows={4}
            className={`w-full p-3 border-2 border-blue-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${getStyleClasses()}`}
            style={{ color: currentStyles.color }}
            disabled={isSaving}
          />
        ) : (
          <input
            ref={inputRef as React.RefObject<HTMLInputElement>}
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            maxLength={maxLength}
            className={`w-full p-3 border-2 border-blue-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${getStyleClasses()}`}
            style={{ color: currentStyles.color }}
            disabled={isSaving}
          />
        )}

        {/* Control Panel */}
        <div className="absolute -bottom-12 left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg p-2 flex items-center justify-between text-xs z-20">
          <div className="flex items-center space-x-3 text-gray-600">
            <span>{editValue.length}/{maxLength}</span>
            {isSaving && <span className="text-blue-600">Saving...</span>}
            <span className="text-green-600">
              {multiline ? 'Ctrl+Enter to save' : 'Enter to save'}
            </span>
          </div>
          
          <div className="flex items-center space-x-1">
            <button
              onClick={() => setShowStylePanel(!showStylePanel)}
              className={`p-1 rounded ${showStylePanel ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:bg-gray-50'}`}
              title="Text Styles"
            >
              <Type className="w-4 h-4" />
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="p-1 text-green-600 hover:bg-green-50 rounded disabled:opacity-50"
              title="Save"
            >
              <Check className="w-4 h-4" />
            </button>
            <button
              onClick={handleCancel}
              disabled={isSaving}
              className="p-1 text-gray-500 hover:bg-gray-50 rounded disabled:opacity-50"
              title="Cancel (Esc)"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div 
      className={`relative group cursor-pointer transition-all duration-200 hover:bg-blue-50 hover:ring-2 hover:ring-blue-200 rounded-lg p-2 -m-2 min-h-[2rem] ${getStyleClasses()} ${className}`}
      style={{ color: currentStyles.color }}
      onClick={(e) => {
        e.stopPropagation()
        setIsEditing(true)
      }}
    >
      {value ? (
        <span>{value}</span>
      ) : (
        <span className="text-gray-400 italic">{placeholder}</span>
      )}
      
      <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="bg-blue-600 text-white p-1 rounded-md shadow-lg flex items-center space-x-1">
          <Type className="w-3 h-3" />
          <Edit3 className="w-3 h-3" />
        </div>
      </div>
    </div>
  )
}
