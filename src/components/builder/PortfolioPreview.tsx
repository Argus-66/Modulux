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

        // Apply beautiful defaults immediately if no background is set
        const defaultBackgrounds = {
            hero: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            about: '#ffffff',
            projects: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
            skills: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            experience: '#f8fafc',
            contact: 'linear-gradient(135deg, #232526 0%, #414345 100%)',
            navigation: '#ffffff'
        }

        if (!bg) {
            return {
                background: defaultBackgrounds[section.type as keyof typeof defaultBackgrounds] || '#ffffff'
            }
        }

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
                    <div className="text-center py-24 px-8 rounded-lg relative overflow-hidden" style={getSectionBackgroundStyle()}>
                        <div className="max-w-5xl mx-auto relative z-10">
                            <AdvancedTextEditor
                                value={sectionData.title || 'Your Name'}
                                onSave={(value, styles) => updateSectionData('title', value, styles)}
                                placeholder="Your Name"
                                className="mb-6"
                                styles={sectionData.titleStyles || { fontSize: '5xl', fontWeight: 'bold', textAlign: 'center', color: '#ffffff' }}
                            />
                            <AdvancedTextEditor
                                value={sectionData.subtitle || 'Your Professional Title'}
                                onSave={(value, styles) => updateSectionData('subtitle', value, styles)}
                                placeholder="Your Professional Title"
                                className="mb-8"
                                styles={sectionData.subtitleStyles || { fontSize: '2xl', fontWeight: 'medium', textAlign: 'center', color: '#f3f4f6' }}
                            />
                            <AdvancedTextEditor
                                value={sectionData.description || 'Brief description about yourself and what you do.'}
                                onSave={(value, styles) => updateSectionData('description', value, styles)}
                                placeholder="Brief description about yourself and what you do"
                                multiline={true}
                                className="max-w-3xl mx-auto"
                                styles={sectionData.descriptionStyles || { fontSize: 'lg', fontWeight: 'normal', textAlign: 'center', color: '#e5e7eb' }}
                            />
                            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
                                <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                                    Download CV
                                </button>
                                <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors">
                                    Contact Me
                                </button>
                            </div>
                        </div>
                    </div>
                )

            case 'about':
                return (
                    <div className="p-16 rounded-lg" style={getSectionBackgroundStyle()}>
                        <div className="max-w-6xl mx-auto">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                                <div>
                                    <AdvancedTextEditor
                                        value={sectionData.title || 'About Me'}
                                        onSave={(value, styles) => updateSectionData('title', value, styles)}
                                        placeholder="Section Title"
                                        className="mb-6"
                                        styles={sectionData.titleStyles || { fontSize: '3xl', fontWeight: 'bold', textAlign: 'left', color: '#111827' }}
                                    />
                                    <AdvancedTextEditor
                                        value={sectionData.content || 'Tell your story and what makes you unique. Share your background, experiences, and what drives your passion in your field.'}
                                        onSave={(value, styles) => updateSectionData('content', value, styles)}
                                        placeholder="Tell your story and what makes you unique..."
                                        multiline={true}
                                        maxLength={1000}
                                        className="leading-relaxed"
                                        styles={sectionData.contentStyles || { fontSize: 'base', fontWeight: 'normal', textAlign: 'left', color: '#374151' }}
                                    />
                                </div>
                                <div className="bg-gray-200 rounded-xl aspect-square flex items-center justify-center">
                                    <div className="text-center">
                                        <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                        <p className="text-gray-500">Your Photo</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )

            case 'projects':
                return (
                    <div className="p-16 rounded-lg" style={getSectionBackgroundStyle()}>
                        <div className="max-w-7xl mx-auto">
                            <AdvancedTextEditor
                                value={sectionData.title || 'My Projects'}
                                onSave={(value, styles) => updateSectionData('title', value, styles)}
                                placeholder="Projects Section Title"
                                className="mb-12 text-center"
                                styles={sectionData.titleStyles || { fontSize: '3xl', fontWeight: 'bold', textAlign: 'center', color: '#111827' }}
                            />
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {sectionData.projects?.length > 0 ? (
                                    sectionData.projects.map((project: any, index: number) => (
                                        <div key={index} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all border border-gray-100">
                                            <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg h-48 mb-6 flex items-center justify-center">
                                                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                                </svg>
                                            </div>
                                            <AdvancedTextEditor
                                                value={project.title || 'Project Title'}
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
                                                styles={project.titleStyles || { fontSize: 'lg', fontWeight: 'semibold', textAlign: 'left', color: '#111827' }}
                                            />
                                            <AdvancedTextEditor
                                                value={project.description || 'Project description goes here...'}
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
                                                className="mb-4"
                                                styles={project.descriptionStyles || { fontSize: 'sm', fontWeight: 'normal', textAlign: 'left', color: '#6b7280' }}
                                            />
                                            {project.technologies && project.technologies.length > 0 && (
                                                <div className="flex flex-wrap gap-2">
                                                    {project.technologies.map((tech: string, techIndex: number) => (
                                                        <span key={techIndex} className="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium">
                                                            {tech}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))
                                ) : (
                                    <div className="col-span-full text-center py-20 border-2 border-dashed border-gray-300 rounded-xl">
                                        <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                        </svg>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No projects yet</h3>
                                        <p className="text-gray-500">Projects will appear here when you add them</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )

            case 'skills':
                return (
                    <div className="p-16 rounded-lg" style={getSectionBackgroundStyle()}>
                        <div className="max-w-6xl mx-auto">
                            <AdvancedTextEditor
                                value={sectionData.title || 'Skills & Expertise'}
                                onSave={(value, styles) => updateSectionData('title', value, styles)}
                                placeholder="Skills Section Title"
                                className="mb-12 text-center"
                                styles={sectionData.titleStyles || { fontSize: '3xl', fontWeight: 'bold', textAlign: 'center', color: '#111827' }}
                            />
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                {sectionData.skills?.length > 0 ? (
                                    sectionData.skills.map((skill: any, index: number) => (
                                        <div key={index} className="text-center bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
                                            <div className="relative w-20 h-20 mx-auto mb-4">
                                                <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 100 100">
                                                    <circle
                                                        cx="50"
                                                        cy="50"
                                                        r="45"
                                                        stroke="#e5e7eb"
                                                        strokeWidth="8"
                                                        fill="none"
                                                    />
                                                    <circle
                                                        cx="50"
                                                        cy="50"
                                                        r="45"
                                                        stroke="#3b82f6"
                                                        strokeWidth="8"
                                                        fill="none"
                                                        strokeDasharray={`${2 * Math.PI * 45}`}
                                                        strokeDashoffset={`${2 * Math.PI * 45 * (1 - (skill.level || 85) / 100)}`}
                                                        className="transition-all duration-1000"
                                                    />
                                                </svg>
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <span className="text-sm font-bold text-blue-600">{skill.level || 85}%</span>
                                                </div>
                                            </div>
                                            <AdvancedTextEditor
                                                value={skill.name || 'Skill Name'}
                                                onSave={async (value, styles) => {
                                                    const updatedSkills = sectionData.skills.map((s: any, i: number) =>
                                                        i === index ? { ...s, name: value, nameStyles: styles } : s
                                                    )
                                                    if (onUpdateSection) {
                                                        await onUpdateSection(section.id, { skills: updatedSkills })
                                                    }
                                                }}
                                                placeholder="Skill name"
                                                styles={skill.nameStyles || { fontSize: 'sm', fontWeight: 'medium', textAlign: 'center', color: '#374151' }}
                                            />
                                        </div>
                                    ))
                                ) : (
                                    <div className="col-span-full text-center py-20 border-2 border-dashed border-gray-300 rounded-xl">
                                        <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                        </svg>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No skills yet</h3>
                                        <p className="text-gray-500">Skills will appear here when you add them</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )

            case 'experience':
                return (
                    <div className="p-16 rounded-lg" style={getSectionBackgroundStyle()}>
                        <div className="max-w-4xl mx-auto">
                            <AdvancedTextEditor
                                value={sectionData.title || 'Work Experience'}
                                onSave={(value, styles) => updateSectionData('title', value, styles)}
                                placeholder="Experience Section Title"
                                className="mb-12 text-center"
                                styles={sectionData.titleStyles || { fontSize: '3xl', fontWeight: 'bold', textAlign: 'center', color: '#111827' }}
                            />
                            <div className="space-y-8">
                                {sectionData.experiences?.length > 0 ? (
                                    sectionData.experiences.map((exp: any, index: number) => (
                                        <div key={index} className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 relative">
                                            <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                                                <div className="flex-1">
                                                    <AdvancedTextEditor
                                                        value={exp.position || 'Job Position'}
                                                        onSave={async (value, styles) => {
                                                            const updatedExperiences = sectionData.experiences.map((e: any, i: number) =>
                                                                i === index ? { ...e, position: value, positionStyles: styles } : e
                                                            )
                                                            if (onUpdateSection) {
                                                                await onUpdateSection(section.id, { experiences: updatedExperiences })
                                                            }
                                                        }}
                                                        placeholder="Job Position"
                                                        styles={exp.positionStyles || { fontSize: 'xl', fontWeight: 'semibold', textAlign: 'left', color: '#111827' }}
                                                    />
                                                    <AdvancedTextEditor
                                                        value={exp.company || 'Company Name'}
                                                        onSave={async (value, styles) => {
                                                            const updatedExperiences = sectionData.experiences.map((e: any, i: number) =>
                                                                i === index ? { ...e, company: value, companyStyles: styles } : e
                                                            )
                                                            if (onUpdateSection) {
                                                                await onUpdateSection(section.id, { experiences: updatedExperiences })
                                                            }
                                                        }}
                                                        placeholder="Company Name"
                                                        className="text-blue-600 font-medium"
                                                        styles={exp.companyStyles || { fontSize: 'base', fontWeight: 'medium', textAlign: 'left', color: '#2563eb' }}
                                                    />
                                                </div>
                                                <div className="text-sm text-gray-500 mt-2 md:mt-0">
                                                    {exp.startDate || '2020'} - {exp.endDate || 'Present'}
                                                </div>
                                            </div>
                                            <AdvancedTextEditor
                                                value={exp.description || 'Job description and achievements...'}
                                                onSave={async (value, styles) => {
                                                    const updatedExperiences = sectionData.experiences.map((e: any, i: number) =>
                                                        i === index ? { ...e, description: value, descriptionStyles: styles } : e
                                                    )
                                                    if (onUpdateSection) {
                                                        await onUpdateSection(section.id, { experiences: updatedExperiences })
                                                    }
                                                }}
                                                placeholder="Describe your role and achievements..."
                                                multiline={true}
                                                styles={exp.descriptionStyles || { fontSize: 'base', fontWeight: 'normal', textAlign: 'left', color: '#6b7280' }}
                                            />
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-20 border-2 border-dashed border-gray-300 rounded-xl">
                                        <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 002 2v8a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2v0z" />
                                        </svg>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No experience yet</h3>
                                        <p className="text-gray-500">Work experience will appear here when you add them</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )

            case 'contact':
                return (
                    <div className="p-16 rounded-lg relative overflow-hidden" style={getSectionBackgroundStyle()}>
                        <div className="max-w-5xl mx-auto relative z-10">
                            <AdvancedTextEditor
                                value={sectionData.title || 'Get In Touch'}
                                onSave={(value, styles) => updateSectionData('title', value, styles)}
                                placeholder="Contact Section Title"
                                className="mb-12"
                                styles={sectionData.titleStyles || { fontSize: '3xl', fontWeight: 'bold', textAlign: 'center', color: '#ffffff' }}
                            />
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                                <div className="space-y-8">
                                    <div className="flex items-center space-x-6">
                                        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                        <AdvancedTextEditor
                                            value={sectionData.email || 'your.email@example.com'}
                                            onSave={(value, styles) => updateSectionData('email', value, styles)}
                                            placeholder="your.email@example.com"
                                            className="flex-1"
                                            styles={sectionData.emailStyles || { fontSize: 'lg', fontWeight: 'medium', textAlign: 'left', color: '#f3f4f6' }}
                                        />
                                    </div>
                                    <div className="flex items-center space-x-6">
                                        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                            </svg>
                                        </div>
                                        <AdvancedTextEditor
                                            value={sectionData.phone || '+1 (555) 123-4567'}
                                            onSave={(value, styles) => updateSectionData('phone', value, styles)}
                                            placeholder="+1 (555) 123-4567"
                                            className="flex-1"
                                            styles={sectionData.phoneStyles || { fontSize: 'lg', fontWeight: 'medium', textAlign: 'left', color: '#f3f4f6' }}
                                        />
                                    </div>
                                    <div className="flex items-center space-x-6">
                                        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                        </div>
                                        <AdvancedTextEditor
                                            value={sectionData.location || 'Your Location'}
                                            onSave={(value, styles) => updateSectionData('location', value, styles)}
                                            placeholder="Your Location"
                                            className="flex-1"
                                            styles={sectionData.locationStyles || { fontSize: 'lg', fontWeight: 'medium', textAlign: 'left', color: '#f3f4f6' }}
                                        />
                                    </div>
                                </div>
                                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20">
                                    <h3 className="text-xl font-semibold text-white mb-6">Send me a message</h3>
                                    <div className="space-y-4">
                                        <input
                                            type="text"
                                            placeholder="Your Name"
                                            className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
                                        />
                                        <input
                                            type="email"
                                            placeholder="Your Email"
                                            className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
                                        />
                                        <textarea
                                            placeholder="Your Message"
                                            rows={4}
                                            className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 resize-none"
                                        />
                                        <button className="w-full bg-white text-gray-900 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                                            Send Message
                                        </button>
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
            className={`mb-8 group transition-all duration-200 ${isSelected && !isPreviewMode
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
