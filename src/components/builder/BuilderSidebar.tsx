'use client'

import { useState } from 'react'
import { useDraggable } from '@dnd-kit/core'
import { PortfolioSection } from '@/types/portfolio'
import { Navigation, User, Info, Briefcase, Lightbulb, Mail, GraduationCap, Building, Layers, Settings, MessageSquare, Images, Palette } from 'lucide-react'

interface BuilderSidebarProps {
    selectedSectionId: string | null
    setSelectedSectionId: (id: string | null) => void
    sections: PortfolioSection[]
    updateSection: (sectionId: string, data: any) => void
    deleteSection: (sectionId: string) => void
}

const sectionTypes = [
    {
        type: 'navigation',
        name: 'Navigation Bar',
        description: 'Top navigation menu for your portfolio',
        icon: Navigation
    },
    {
        type: 'hero',
        name: 'Hero Section',
        description: 'Introduction with name and title',
        icon: User
    },
    {
        type: 'about',
        name: 'About Section',
        description: 'Tell your story and background',
        icon: Info
    },
    {
        type: 'projects',
        name: 'Projects',
        description: 'Showcase your work and projects',
        icon: Briefcase
    },
    {
        type: 'skills',
        name: 'Skills',
        description: 'Display your technical skills',
        icon: Lightbulb
    },
    {
        type: 'experience',
        name: 'Experience',
        description: 'Your work experience and career',
        icon: Building
    },
    {
        type: 'education',
        name: 'Education',
        description: 'Educational background and certifications',
        icon: GraduationCap
    },
    {
    type: 'testimonials',
    name: 'Testimonials',
    description: 'Client and colleague recommendations',
    icon: MessageSquare // Updated icon
  },
  {
    type: 'gallery',
    name: 'Gallery',
    description: 'Image gallery or portfolio showcase',
    icon: Images // Updated icon
  },
    {
        type: 'contact',
        name: 'Contact',
        description: 'Contact information and social links',
        icon: Mail
    }
]

function DraggableSection({ type, name, description, icon: Icon }: any) {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: type,
        data: { type }
    })

    const style = transform ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        opacity: isDragging ? 0.5 : 1,
    } : undefined

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...listeners}
            {...attributes}
            className="bg-white rounded-lg border border-gray-200 p-4 cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow"
        >
            <div className="flex items-center space-x-3">
                <div className="text-blue-600">
                    <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                    <h3 className="text-sm font-medium text-gray-900">{name}</h3>
                    <p className="text-xs text-gray-500 mt-1">{description}</p>
                </div>
            </div>
        </div>
    )
}

export default function BuilderSidebar({
    selectedSectionId,
    setSelectedSectionId,
    sections,
    updateSection,
    deleteSection
}: BuilderSidebarProps) {
    const [activeTab, setActiveTab] = useState<'components' | 'structure'>('components')

    return (
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-gray-200">
                <div className="flex bg-gray-100 rounded-lg p-1">
                    <button
                        onClick={() => setActiveTab('components')}
                        className={`flex-1 flex items-center justify-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'components'
                                ? 'bg-white text-gray-900 shadow-sm'
                                : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        <Layers className="w-4 h-4 mr-2" />
                        Components
                    </button>
                    <button
                        onClick={() => setActiveTab('structure')}
                        className={`flex-1 flex items-center justify-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'structure'
                                ? 'bg-white text-gray-900 shadow-sm'
                                : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        <Settings className="w-4 h-4 mr-2" />
                        Structure
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
                {activeTab === 'components' && (
                    <div className="p-4 space-y-3">
                        <div className="text-sm font-medium text-gray-700 mb-3">
                            Drag components to your portfolio
                        </div>
                        {sectionTypes.map((section) => (
                            <DraggableSection
                                key={section.type}
                                type={section.type}
                                name={section.name}
                                description={section.description}
                                icon={section.icon}
                            />
                        ))}
                    </div>
                )}

                {activeTab === 'structure' && (
                    <div className="p-4">
                        <div className="text-sm font-medium text-gray-700 mb-3">
                            Portfolio Structure
                        </div>
                        {sections.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                                <Layers className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                                <p className="text-sm">No sections yet</p>
                                <p className="text-xs mt-1">Drag components from the Components tab</p>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {sections.map((section, index) => {
                                    const sectionConfig = sectionTypes.find(s => s.type === section.type)
                                    const Icon = sectionConfig?.icon || Layers

                                    return (
                                        <div
                                            key={section.id}
                                            className={`p-3 rounded-lg border cursor-pointer transition-colors ${selectedSectionId === section.id
                                                    ? 'border-blue-500 bg-blue-50'
                                                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                                }`}
                                            onClick={() => setSelectedSectionId(
                                                selectedSectionId === section.id ? null : section.id
                                            )}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-3">
                                                    <Icon className="w-4 h-4 text-gray-400" />
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {sectionConfig?.name || section.type}
                                                        </div>
                                                        <div className="text-xs text-gray-500">
                                                            Section #{index + 1}
                                                        </div>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        if (window.confirm('Delete this section?')) {
                                                            deleteSection(section.id)
                                                        }
                                                    }}
                                                    className="p-1 text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
