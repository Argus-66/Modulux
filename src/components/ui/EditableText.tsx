'use client'

import { useInlineEditor } from '@/hooks/useInlineEditor'
import { Edit3, Check, X, Save, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface EditableTextProps {
  value: string
  onSave: (value: string) => Promise<void>
  placeholder?: string
  maxLength?: number
  minLength?: number
  multiline?: boolean
  className?: string
  editableClassName?: string
  displayClassName?: string
  label?: string
  required?: boolean
  disabled?: boolean
  variant?: 'heading' | 'subheading' | 'body' | 'caption'
}

export default function EditableText({
  value,
  onSave,
  placeholder = 'Click to edit...',
  maxLength = 500,
  minLength = 1,
  multiline = false,
  className = '',
  editableClassName = '',
  displayClassName = '',
  label,
  required = false,
  disabled = false,
  variant = 'body'
}: EditableTextProps) {
  const {
    isEditing,
    value: editValue,
    setValue,
    isSaving,
    lastSaved,
    inputRef,
    startEditing,
    stopEditing,
    handleKeyDown,
    getCharacterInfo
  } = useInlineEditor(value, onSave, {
    maxLength,
    minLength,
    placeholder,
    multiline,
    autoSave: true,
    autoSaveDelay: 1000
  })

  const charInfo = getCharacterInfo()

  const variantClasses = {
    heading: 'text-3xl font-bold',
    subheading: 'text-xl font-semibold',
    body: 'text-base',
    caption: 'text-sm text-gray-600'
  }

  const inputVariantClasses = {
    heading: 'text-3xl font-bold',
    subheading: 'text-xl font-semibold',
    body: 'text-base',
    caption: 'text-sm'
  }

  if (isEditing) {
    return (
      <div className={cn('relative group', className)}>
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        
        <div className="relative">
          {multiline ? (
            <textarea
              ref={inputRef as React.RefObject<HTMLTextAreaElement>}
              value={editValue}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={() => stopEditing(true)}
              placeholder={placeholder}
              maxLength={maxLength}
              rows={4}
              className={cn(
                'w-full px-3 py-2 border border-blue-500 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none',
                inputVariantClasses[variant],
                charInfo.isOverLimit && 'border-red-500 focus:ring-red-500',
                editableClassName
              )}
            />
          ) : (
            <input
              ref={inputRef as React.RefObject<HTMLInputElement>}
              type="text"
              value={editValue}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={() => stopEditing(true)}
              placeholder={placeholder}
              maxLength={maxLength}
              className={cn(
                'w-full px-3 py-2 border border-blue-500 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent',
                inputVariantClasses[variant],
                charInfo.isOverLimit && 'border-red-500 focus:ring-red-500',
                editableClassName
              )}
            />
          )}

          {/* Floating toolbar */}
          <div className="absolute -bottom-12 left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg p-2 flex items-center justify-between text-sm">
            <div className="flex items-center space-x-3">
              <div className={cn(
                'flex items-center space-x-1',
                charInfo.isOverLimit ? 'text-red-600' : 'text-gray-500'
              )}>
                <span>{charInfo.current}</span>
                <span>/</span>
                <span>{charInfo.max}</span>
              </div>
              
              {isSaving ? (
                <div className="flex items-center text-blue-600">
                  <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                  <span>Saving...</span>
                </div>
              ) : lastSaved ? (
                <div className="flex items-center text-green-600">
                  <Check className="w-3 h-3 mr-1" />
                  <span>Saved</span>
                </div>
              ) : null}
            </div>

            <div className="flex items-center space-x-1">
              <button
                onClick={() => stopEditing(true)}
                disabled={charInfo.isOverLimit || charInfo.isUnderMinimum}
                className="p-1 text-green-600 hover:bg-green-50 rounded disabled:opacity-50"
                title="Save (Enter)"
              >
                <Check className="w-4 h-4" />
              </button>
              <button
                onClick={() => stopEditing(false)}
                className="p-1 text-gray-500 hover:bg-gray-50 rounded"
                title="Cancel (Esc)"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Progress bar */}
          <div className="absolute -bottom-16 left-0 right-0 h-1 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className={cn(
                'h-full transition-all duration-300',
                charInfo.percentage <= 70 ? 'bg-green-500' :
                charInfo.percentage <= 90 ? 'bg-yellow-500' : 'bg-red-500'
              )}
              style={{ width: `${Math.min(charInfo.percentage, 100)}%` }}
            />
          </div>
        </div>

        {/* Helper text */}
        <div className="mt-6 text-xs text-gray-500">
          {multiline ? 'Press Ctrl+Enter to save, Esc to cancel' : 'Press Enter to save, Esc to cancel'}
        </div>
      </div>
    )
  }

  return (
    <div className={cn('relative group', className)}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div 
        className={cn(
          'relative cursor-pointer transition-all duration-200 rounded-lg p-2 -m-2',
          'hover:bg-blue-50 hover:ring-2 hover:ring-blue-200',
          !disabled && 'group-hover:shadow-sm',
          variantClasses[variant],
          displayClassName
        )}
        onClick={disabled ? undefined : startEditing}
      >
        {value || (
          <span className="text-gray-400 italic">
            {placeholder}
          </span>
        )}
        
        {!disabled && (
          <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="bg-blue-600 text-white p-1 rounded-md shadow-lg">
              <Edit3 className="w-3 h-3" />
            </div>
          </div>
        )}
      </div>

      {lastSaved && !isEditing && (
        <div className="absolute -top-6 right-0 text-xs text-green-600 opacity-0 group-hover:opacity-100 transition-opacity">
          Last saved: {lastSaved.toLocaleTimeString()}
        </div>
      )}
    </div>
  )
}
