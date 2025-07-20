'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { PortfolioSection } from '@/types/portfolio'
import { GripVertical, Trash2, Edit3, Copy, Settings } from 'lucide-react'
import AdvancedTextEditor from '@/components/ui/AdvancedTextEditor'
import BackgroundEditor from '@/components/ui/BackgroundEditor'
import SmartNavigation from './SmartNavigation'

interface PortfolioPreviewProps {
  sections: PortfolioSection[]
  selectedSectionId: string | null
  setSelectedSectionId: (id: string | null) => void
  isPreviewMode: boolean
  onUpdateSection?: (sectionId: string, data: any) => Promise<void>
  onDeleteSection?: (sectionId: string) => void
  onDuplicateSection?: (sectionId: string) => void
}

function SortableSection({ 
  section, 
  isSelected, 
  isPreviewMode, 
  onSelect,
  onUpdateSection,
  onDeleteSection,
  onDuplicateSection,
  allSections
}: {
  section: PortfolioSection
  isSelected: boolean
  isPreviewMode: boolean
  onSelect: () => void
  onUpdateSection?: (sectionId: string, data: any) => Promise<void>
  onDeleteSection?: (sectionId: string) => void
  onDuplicateSection?: (sectionId: string) => void
  allSections: PortfolioSection[]
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: section.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1
  }

  const updateSectionData = async (field: string, value: string, styles?: any) => {
    if (onUpdateSection) {
      const updateData: any = { [field]: value }
      if (styles) {
        updateData[`${field}Styles`] = styles
      }
      await onUpdateSection(section.id, updateData)
    }
  }

  const updateSectionBackground = async (background: any) => {
    if (onUpdateSection) {
      await onUpdateSection(section.id, { background })
    }
  }

  const getSectionBackgroundStyle = () => {
    const bg = section.data?.background
    if (!bg) return { backgroundColor: '#ffffff' }
    
    if (bg.type === 'gradient' && bg.gradient) {
      return {
        background: `linear-gradient(${bg.gradient.direction}, ${bg.gradient.from}, ${bg.gradient.to})`
      }
    }
    
    return { backgroundColor: bg.color || '#ffffff' }
  }

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this section?')) {
      onDeleteSection?.(section.id)
    }
  }

  const renderSectionContent = () => {
    const sectionData = section.data || {}
    
    switch (section.type) {
      case 'navigation':
        return <SmartNavigation sections={allSections} portfolioId="current" />

      case 'hero':
        return (
          <div className="text-center py-20 px-8 rounded-lg" style={getSectionBackgroundStyle()}>
            <div className="max-w-4xl mx-auto">
              <AdvancedTextEditor
                value={sectionData.title || ''}
                onSave={(value, styles) => updateSectionData('title', value, styles)}
                placeholder="Your Name"
                className="mb-6 text-white"
                styles={sectionData.titleStyles}
              />
              <AdvancedTextEditor
                value={sectionData.subtitle || ''}
                onSave={(value, styles) => updateSectionData('subtitle', value, styles)}
                placeholder="Your Professional Title"
                className="mb-6 text-white/90"
                styles={sectionData.subtitleStyles}
              />
              <AdvancedTextEditor
                value={sectionData.description || ''}
                onSave={(value, styles) => updateSectionData('description', value, styles)}
                placeholder="Brief description about yourself and what you do"
                multiline={true}
                className="text-white/80"
                styles={sectionData.descriptionStyles}
              />
            </div>
          </div>
        )
      
      case 'about':
        return (
          <div className="p-12 rounded-lg" style={getSectionBackgroundStyle()}>
            <div className="max-w-4xl mx-auto">
              <AdvancedTextEditor
                value={sectionData.title || 'About Me'}
                onSave={(value, styles) => updateSectionData('title', value, styles)}
                placeholder="Section Title"
                className="mb-8"
                styles={sectionData.titleStyles}
              />
              <AdvancedTextEditor
                value={sectionData.content || ''}
                onSave={(value, styles) => updateSectionData('content', value, styles)}
                placeholder="Tell your story and what makes you unique. Click here to start writing..."
                multiline={true}
                maxLength={1000}
                className="leading-relaxed"
                styles={sectionData.contentStyles}
              />
            </div>
          </div>
        )
      
      case 'projects':
        return (
          <div className="p-12 rounded-lg" style={getSectionBackgroundStyle()}>
            <div className="max-w-6xl mx-auto">
              <AdvancedTextEditor
                value={sectionData.title || 'My Projects'}
                onSave={(value, styles) => updateSectionData('title', value, styles)}
                placeholder="Projects Section Title"
                className="mb-8"
                styles={sectionData.titleStyles}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {sectionData.projects?.length > 0 ? (
                  sectionData.projects.map((project: any, index: number) => (
                    <div key={index} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 hover:shadow-xl transition-all">
                      <AdvancedTextEditor
                        value={project.title || ''}
                        onSave={async (value, styles) => {
                          const updatedProjects = sectionData.projects.map((p: any, i: number) =>
                            i === index ? { ...p, title: value, titleStyles: styles } : p
                          )
                          if (onUpdateSection) {
                            await onUpdateSection(section.id, { projects: updatedProjects })
                          }
                        }}
                        placeholder="Project Title"
                        className="mb-4"
                        styles={project.titleStyles}
                      />
                      <AdvancedTextEditor
                        value={project.description || ''}
                        onSave={async (value, styles) => {
                          const updatedProjects = sectionData.projects.map((p: any, i: number) =>
                            i === index ? { ...p, description: value, descriptionStyles: styles } : p
                          )
                          if (onUpdateSection) {
                            await onUpdateSection(section.id, { projects: updatedProjects })
                          }
                        }}
                        placeholder="Describe your project..."
                        multiline={true}
                        styles={project.descriptionStyles}
                      />
                    </div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-16 border-2 border-dashed border-gray-300 rounded-lg bg-white/5">
                    <p className="text-lg font-medium mb-2">No projects added yet</p>
                    <p className="text-sm opacity-70">Projects will appear here when you add them</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )
      
      case 'contact':
        return (
          <div className="p-12 rounded-lg" style={getSectionBackgroundStyle()}>
            <div className="max-w-4xl mx-auto">
              <AdvancedTextEditor
                value={sectionData.title || 'Get In Touch'}
                onSave={(value, styles) => updateSectionData('title', value, styles)}
                placeholder="Contact Section Title"
                className="mb-8 text-center"
                styles={sectionData.titleStyles}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <AdvancedTextEditor
                      value={sectionData.email || ''}
                      onSave={(value, styles) => updateSectionData('email', value, styles)}
                      placeholder="your.email@example.com"
                      className="flex-1"
                      styles={sectionData.emailStyles}
                    />
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <AdvancedTextEditor
                      value={sectionData.phone || ''}
                      onSave={(value, styles) => updateSectionData('phone', value, styles)}
                      placeholder="+1 (555) 123-4567"
                      className="flex-1"
                      styles={sectionData.phoneStyles}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      
      default:
        return (
          <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
            <p className="text-gray-500 text-lg">Unknown section type: {section.type}</p>
          </div>
        )
    }
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`mb-8 group transition-all duration-200 ${
        isSelected && !isPreviewMode
          ? 'ring-4 ring-blue-500 ring-offset-4' 
          : ''
      } ${isDragging ? 'z-50' : 'relative'}`}
    >
      {/* Enhanced Section Controls */}
      {!isPreviewMode && (
        <div className="absolute -top-4 left-6 z-10 bg-white border border-gray-300 rounded-lg shadow-sm flex items-center overflow-hidden">
          <div
            {...attributes}
            {...listeners}
            className="flex items-center space-x-2 px-4 py-3 text-gray-500 hover:text-gray-700 cursor-grab active:cursor-grabbing hover:bg-gray-50 border-r border-gray-200"
          >
            <GripVertical className="w-4 h-4" />
            <span className="text-sm font-medium capitalize">{section.type}</span>
          </div>
          
          {/* Background Editor */}
          <div className="border-r border-gray-200">
            <BackgroundEditor
              background={section.data?.background || { type: 'solid', color: '#ffffff' }}
              onBackgroundChange={updateSectionBackground}
            />
          </div>
          
          <button
            onClick={onSelect}
            className="p-3 text-gray-400 hover:text-blue-600 hover:bg-blue-50 border-r border-gray-200"
            title="Edit section"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          
          {onDuplicateSection && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                onDuplicateSection(section.id)
              }}
              className="p-3 text-gray-400 hover:text-green-600 hover:bg-green-50 border-r border-gray-200"
              title="Duplicate section"
            >
              <Copy className="w-4 h-4" />
            </button>
          )}
          
          <button
            onClick={(e) => {
              e.stopPropagation()
              handleDelete()
            }}
            className="p-3 text-gray-400 hover:text-red-600 hover:bg-red-50"
            title="Delete section"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )}
      
      {/* Section Content */}
      <div
        className="transition-all cursor-pointer overflow-hidden rounded-lg"
        onClick={!isPreviewMode ? onSelect : undefined}
      >
        {renderSectionContent()}
      </div>

      {/* Section Info */}
      {isSelected && !isPreviewMode && (
        <div className="absolute -bottom-8 right-6 bg-blue-600 text-white px-3 py-1 rounded-lg text-sm font-medium">
          Section {section.order + 1} • {section.type}
        </div>
      )}
    </div>
  )
}

export default function PortfolioPreview({
  sections,
  selectedSectionId,
  setSelectedSectionId,
  isPreviewMode,
  onUpdateSection,
  onDeleteSection,
  onDuplicateSection
}: PortfolioPreviewProps) {
  return (
    <div className="min-h-screen">
      {/* Portfolio Start Indicator */}
      {!isPreviewMode && (
        <div className="text-center py-4 border-b-2 border-dashed border-gray-400 mb-8">
          <span className="bg-white px-6 py-2 text-sm text-gray-600 font-semibold rounded-full border border-gray-300">
            📄 PORTFOLIO START - {sections.length} sections total
          </span>
        </div>
      )}
      
      {sections.map(section => (
        <SortableSection
          key={section.id}
          section={section}
          isSelected={selectedSectionId === section.id}
          isPreviewMode={isPreviewMode}
          onSelect={() => setSelectedSectionId(
            selectedSectionId === section.id ? null : section.id
          )}
          onUpdateSection={onUpdateSection}
          onDeleteSection={onDeleteSection}
          onDuplicateSection={onDuplicateSection}
          allSections={sections}
        />
      ))}
      
      {/* Portfolio End Indicator */}
      {!isPreviewMode && sections.length > 0 && (
        <div className="text-center py-6 border-t-2 border-dashed border-gray-400 mt-8">
          <span className="bg-white px-6 py-2 text-sm text-gray-600 font-semibold rounded-full border border-gray-300">
            ✨ PORTFOLIO END - Visitors will see everything above
          </span>
        </div>
      )}
    </div>
  )
}
