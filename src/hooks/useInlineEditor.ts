import { useState, useRef, useEffect } from 'react'

export function useInlineEditor(
  initialValue: string,
  onSave: (value: string) => void,
  options: {
    maxLength?: number
    minLength?: number
    placeholder?: string
    multiline?: boolean
    autoSave?: boolean
    autoSaveDelay?: number
  } = {}
) {
  const [isEditing, setIsEditing] = useState(false)
  const [value, setValue] = useState(initialValue)
  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null)
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null) // Fix: Add initial value

  const {
    maxLength = 500,
    minLength = 1,
    placeholder = 'Click to edit...',
    multiline = false,
    autoSave = true,
    autoSaveDelay = 1000
  } = options

  // Auto-save functionality
  useEffect(() => {
    if (autoSave && value !== initialValue && value.length >= minLength) {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }
      
      saveTimeoutRef.current = setTimeout(async () => {
        setIsSaving(true)
        await onSave(value)
        setLastSaved(new Date())
        setIsSaving(false)
      }, autoSaveDelay)
    }

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }
    }
  }, [value, initialValue, minLength, autoSave, autoSaveDelay, onSave])

  // Focus input when editing starts
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [isEditing])

  const startEditing = () => {
    setIsEditing(true)
  }

  const stopEditing = async (save: boolean = true) => {
    if (save && value !== initialValue && value.length >= minLength) {
      setIsSaving(true)
      await onSave(value)
      setLastSaved(new Date())
      setIsSaving(false)
    } else if (!save) {
      setValue(initialValue)
    }
    setIsEditing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !multiline) {
      e.preventDefault()
      stopEditing(true)
    } else if (e.key === 'Escape') {
      stopEditing(false)
    } else if (e.key === 'Enter' && multiline && (e.ctrlKey || e.metaKey)) {
      e.preventDefault()
      stopEditing(true)
    }
  }

  const getCharacterInfo = () => {
    const remaining = maxLength - value.length
    const percentage = (value.length / maxLength) * 100
    const isOverLimit = value.length > maxLength
    const isUnderMinimum = value.length < minLength

    return {
      current: value.length,
      max: maxLength,
      remaining,
      percentage,
      isOverLimit,
      isUnderMinimum,
      isValid: !isOverLimit && !isUnderMinimum
    }
  }

  return {
    isEditing,
    value,
    setValue,
    isSaving,
    lastSaved,
    inputRef,
    startEditing,
    stopEditing,
    handleKeyDown,
    getCharacterInfo
  }
}
