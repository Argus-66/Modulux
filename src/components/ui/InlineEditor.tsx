'use client'

import { useState, useRef, useEffect } from 'react'
import { Edit3, Check, X } from 'lucide-react'

interface InlineEditorProps {
  value: string
  onSave: (value: string) => Promise<void>
  placeholder?: string
  className?: string
  multiline?: boolean
  maxLength?: number
}

export default function InlineEditor({
  value = '',
  onSave,
  placeholder = 'Click to edit...',
  className = '',
  multiline = false,
  maxLength = 500
}: InlineEditorProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(value)
  const [isSaving, setIsSaving] = useState(false)
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null)

  useEffect(() => {
    setEditValue(value || '')
  }, [value])

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      if (!multiline) {
        inputRef.current.select()
      }
    }
  }, [isEditing, multiline])

  const handleSave = async () => {
    if (editValue === value) {
      setIsEditing(false)
      return
    }

    try {
      setIsSaving(true)
      await onSave(editValue)
      setIsEditing(false)
    } catch (error) {
      console.error('Failed to save:', error)
      // Reset to original value on error
      setEditValue(value)
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    setEditValue(value)
    setIsEditing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !multiline) {
      e.preventDefault()
      handleSave()
    } else if (e.key === 'Escape') {
      handleCancel()
    } else if (e.key === 'Enter' && multiline && (e.ctrlKey || e.metaKey)) {
      e.preventDefault()
      handleSave()
    }
  }

  if (isEditing) {
    return (
      <div className="relative">
        {multiline ? (
          <textarea
            ref={inputRef as React.RefObject<HTMLTextAreaElement>}
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleSave}
            placeholder={placeholder}
            maxLength={maxLength}
            rows={4}
            className={`w-full p-3 border-2 border-blue-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${className}`}
            disabled={isSaving}
          />
        ) : (
          <input
            ref={inputRef as React.RefObject<HTMLInputElement>}
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleSave}
            placeholder={placeholder}
            maxLength={maxLength}
            className={`w-full p-3 border-2 border-blue-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
            disabled={isSaving}
          />
        )}

        <div className="absolute -bottom-10 left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg p-2 flex items-center justify-between text-xs z-20">
          <div className="flex items-center space-x-2 text-gray-600">
            <span>{editValue.length}/{maxLength}</span>
            {isSaving && <span className="text-blue-600">Saving...</span>}
          </div>
          <div className="flex items-center space-x-1">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="p-1 text-green-600 hover:bg-green-50 rounded disabled:opacity-50"
              title={multiline ? "Save (Ctrl+Enter)" : "Save (Enter)"}
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
      className={`relative group cursor-pointer transition-all duration-200 hover:bg-blue-50 hover:ring-2 hover:ring-blue-200 rounded-lg p-2 -m-2 min-h-[2rem] ${className}`}
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
        <div className="bg-blue-600 text-white p-1 rounded-md shadow-lg">
          <Edit3 className="w-3 h-3" />
        </div>
      </div>
    </div>
  )
}
