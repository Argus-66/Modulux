'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { PortfolioSection } from '@/types/portfolio'
import { GripVertical, Plus } from 'lucide-react'
import EditableText from '@/components/ui/EditableText'
import Button from '@/components/ui/Button'

interface PortfolioPreviewProps {
  sections: PortfolioSection[]
  selectedSectionId: string | null
  setSelectedSectionId: (id: string | null) => void
  isPreviewMode: boolean
  onUpdateSection?: (sectionId: string, data: any) => Promise<void>
}

function SortableSection({ 
  section, 
  isSelected, 
  isPreviewMode, 
  onSelect,
  onUpdateSection
}: {
  section: PortfolioSection
  isSelected: boolean
  isPreviewMode: boolean
  onSelect: () => void
  onUpdateSection?: (sectionId: string, data: any) => Promise<void>
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

  const updateSectionData = async (field: string, value: string) => {
    if (onUpdateSection) {
      await onUpdateSection(section.id, { [field]: value })
    }
  }

  const addProject = async () => {
    const newProject = {
      id: `project-${Date.now()}`,
      title: 'New Project',
      description: 'Project description...',
      technologies: [],
      featured: false
    }
    
    const updatedProjects = [...(section.data.projects || []), newProject]
    if (onUpdateSection) {
      await onUpdateSection(section.id, { projects: updatedProjects })
    }
  }

  const addSkill = async () => {
    const newSkill = {
      id: `skill-${Date.now()}`,
      name: 'New Skill',
      level: 80,
      category: 'Technical'
    }
    
    const updatedSkills = [...(section.data.skills || []), newSkill]
    if (onUpdateSection) {
      await onUpdateSection(section.id, { skills: updatedSkills })
    }
  }

  const renderSectionContent = () => {
    switch (section.type) {
      case 'hero':
        return (
          <div className="text-center py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg">
            <EditableText
              value={section.data.title || ''}
              onSave={(value) => updateSectionData('title', value)}
              placeholder="Your Name"
              maxLength={100}
              variant="heading"
              className="mb-4"
              displayClassName="text-white"
              disabled={isPreviewMode}
            />
            <EditableText
              value={section.data.subtitle || ''}
              onSave={(value) => updateSectionData('subtitle', value)}
              placeholder="Your Professional Title"
              maxLength={150}
              variant="subheading"
              className="mb-2"
              displayClassName="text-white opacity-90"
              disabled={isPreviewMode}
            />
            <EditableText
              value={section.data.description || ''}
              onSave={(value) => updateSectionData('description', value)}
              placeholder="Brief description about yourself"
              maxLength={300}
              multiline={true}
              variant="body"
              displayClassName="text-white opacity-80"
              disabled={isPreviewMode}
            />
          </div>
        )
      
      case 'about':
        return (
          <div className="bg-white rounded-lg p-8 shadow-sm">
            <EditableText
              value={section.data.title || ''}
              onSave={(value) => updateSectionData('title', value)}
              placeholder="About Me"
              maxLength={100}
              variant="heading"
              className="mb-6"
              disabled={isPreviewMode}
            />
            <EditableText
              value={section.data.content || ''}
              onSave={(value) => updateSectionData('content', value)}
              placeholder="Tell your story and what makes you unique..."
              maxLength={1000}
              multiline={true}
              variant="body"
              displayClassName="text-gray-600 leading-relaxed"
              disabled={isPreviewMode}
            />
          </div>
        )
      
      case 'projects':
        return (
          <div className="bg-white rounded-lg p-8 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <EditableText
                value={section.data.title || ''}
                onSave={(value) => updateSectionData('title', value)}
                placeholder="My Projects"
                maxLength={100}
                variant="heading"
                disabled={isPreviewMode}
              />
              {!isPreviewMode && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={addProject}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Project
                </Button>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {section.data.projects?.length > 0 ? (
                section.data.projects.map((project: any, index: number) => (
                  <div key={project.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <EditableText
                      value={project.title}
                      onSave={async (value) => {
                        const updatedProjects = section.data.projects.map((p: any, i: number) =>
                          i === index ? { ...p, title: value } : p
                        )
                        if (onUpdateSection) {
                          await onUpdateSection(section.id, { projects: updatedProjects })
                        }
                      }}
                      placeholder="Project Title"
                      maxLength={100}
                      variant="subheading"
                      className="mb-2"
                      disabled={isPreviewMode}
                    />
                    <EditableText
                      value={project.description}
                      onSave={async (value) => {
                        const updatedProjects = section.data.projects.map((p: any, i: number) =>
                          i === index ? { ...p, description: value } : p
                        )
                        if (onUpdateSection) {
                          await onUpdateSection(section.id, { projects: updatedProjects })
                        }
                      }}
                      placeholder="Project description..."
                      maxLength={500}
                      multiline={true}
                      variant="body"
                      displayClassName="text-gray-600"
                      disabled={isPreviewMode}
                    />
                    {project.technologies && project.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {project.technologies.map((tech: string, techIndex: number) => (
                          <span key={techIndex} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-12 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Plus className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="font-medium">No projects yet</p>
                  <p className="text-sm mt-1">Click "Add Project" to get started</p>
                  {!isPreviewMode && (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={addProject}
                      className="mt-4"
                    >
                      Add Your First Project
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        )
      
      case 'skills':
        return (
          <div className="bg-white rounded-lg p-8 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <EditableText
                value={section.data.title || ''}
                onSave={(value) => updateSectionData('title', value)}
                placeholder="Skills & Expertise"
                maxLength={100}
                variant="heading"
                disabled={isPreviewMode}
              />
              {!isPreviewMode && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={addSkill}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Skill
                </Button>
              )}
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {section.data.skills?.length > 0 ? (
                section.data.skills.map((skill: any, index: number) => (
                  <div key={skill.id} className="text-center p-4 border rounded-lg hover:shadow-md transition-shadow">
                    <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                      <span className="text-blue-600 font-bold text-sm">
                        {skill.level || 80}%
                      </span>
                    </div>
                    <EditableText
                      value={skill.name}
                      onSave={async (value) => {
                        const updatedSkills = section.data.skills.map((s: any, i: number) =>
                          i === index ? { ...s, name: value } : s
                        )
                        if (onUpdateSection) {
                          await onUpdateSection(section.id, { skills: updatedSkills })
                        }
                      }}
                      placeholder="Skill name"
                      maxLength={50}
                      variant="caption"
                      displayClassName="text-gray-700 font-medium"
                      disabled={isPreviewMode}
                    />
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-12 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Plus className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="font-medium">No skills yet</p>
                  <p className="text-sm mt-1">Click "Add Skill" to showcase your expertise</p>
                  {!isPreviewMode && (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={addSkill}
                      className="mt-4"
                    >
                      Add Your First Skill
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        )
      
      case 'contact':
        return (
          <div className="bg-white rounded-lg p-8 shadow-sm">
            <EditableText
              value={section.data.title || ''}
              onSave={(value) => updateSectionData('title', value)}
              placeholder="Get In Touch"
              maxLength={100}
              variant="heading"
              className="mb-6"
              disabled={isPreviewMode}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <EditableText
                    value={section.data.email || ''}
                    onSave={(value) => updateSectionData('email', value)}
                    placeholder="your.email@example.com"
                    maxLength={100}
                    disabled={isPreviewMode}
                  />
                </div>
                <div className="flex items-center space-x-3">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <EditableText
                    value={section.data.phone || ''}
                    onSave={(value) => updateSectionData('phone', value)}
                    placeholder="+1 (555) 123-4567"
                    maxLength={20}
                    disabled={isPreviewMode}
                  />
                </div>
              </div>
            </div>
          </div>
        )
      
      default:
        return (
          <div className="bg-white rounded-lg p-8 shadow-sm">
            <p className="text-gray-500">Unknown section type: {section.type}</p>
          </div>
        )
    }
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`mb-6 group transition-all duration-200 ${
        isSelected && !isPreviewMode
          ? 'ring-2 ring-blue-500 ring-offset-2' 
          : ''
      } ${isDragging ? 'z-50' : ''}`}
    >
      {!isPreviewMode && (
        <div className="flex items-center justify-between mb-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <div
            {...attributes}
            {...listeners}
            className="flex items-center space-x-2 text-gray-500 hover:text-gray-700 cursor-grab active:cursor-grabbing"
          >
            <GripVertical className="w-4 h-4" />
            <span className="text-sm font-medium capitalize">{section.type}</span>
          </div>
        </div>
      )}
      
      <div className={`transition-all ${!isPreviewMode ? 'hover:shadow-lg' : ''}`}>
        {renderSectionContent()}
      </div>
    </div>
  )
}

export default function PortfolioPreview({
  sections,
  selectedSectionId,
  setSelectedSectionId,
  isPreviewMode,
  onUpdateSection
}: PortfolioPreviewProps) {
  return (
    <div className="space-y-6">
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
        />
      ))}
    </div>
  )
}
