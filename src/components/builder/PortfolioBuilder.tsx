'use client'

import { useState, useEffect } from 'react'
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, closestCenter } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable'
import { usePortfolio } from '@/hooks/usePortfolios'
import { PortfolioSection } from '@/types/portfolio'
import BuilderSidebar from './BuilderSidebar'
import BuilderCanvas from './BuilderCanvas'
import BuilderHeader from './BuilderHeader'
import LoadingSpinner from '@/components/ui/LoadingSpinner'

interface PortfolioBuilderProps {
    portfolioId: string
}

export default function PortfolioBuilder({ portfolioId }: PortfolioBuilderProps) {
    const { portfolio, loading, updatePortfolio } = usePortfolio(portfolioId)
    const [sections, setSections] = useState<PortfolioSection[]>([])
    const [activeSection, setActiveSection] = useState<PortfolioSection | null>(null)
    const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null)
    const [isPreviewMode, setIsPreviewMode] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const [viewMode, setViewMode] = useState<'sections' | 'freeform'>('sections')

    useEffect(() => {
        if (portfolio) {
            setSections(portfolio.sections || [])
        }
    }, [portfolio])

    const handleDragStart = (event: DragStartEvent) => {
        const { active } = event
        const sectionType = active.data.current?.type

        if (sectionType) {
            setActiveSection({
                id: `temp-${Date.now()}`,
                type: sectionType,
                data: {},
                order: sections.length,
                isVisible: true
            })
        }
    }

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event

        if (!over) {
            setActiveSection(null)
            return
        }

        const sectionType = active.data.current?.type

        // Adding new section from sidebar
        if (sectionType && (over.id === 'canvas' || over.id === 'freeform-canvas')) {
            const newSection: PortfolioSection = {
                id: `section-${Date.now()}`,
                type: sectionType,
                data: getDefaultSectionData(sectionType),
                order: sections.length,
                isVisible: true
            }

            const newSections = [...sections, newSection]
            setSections(newSections)
            await savePortfolio(newSections)
        }

        // Reordering existing sections
        if (active.id !== over.id && !sectionType) {
            const oldIndex = sections.findIndex(section => section.id === active.id)
            const newIndex = sections.findIndex(section => section.id === over.id)

            if (oldIndex !== -1 && newIndex !== -1) {
                const newSections = arrayMove(sections, oldIndex, newIndex).map((section, index) => ({
                    ...section,
                    order: index
                }))

                setSections(newSections)
                await savePortfolio(newSections)
            }
        }

        setActiveSection(null)
    }

    const getDefaultSectionData = (type: string) => {
        const defaultBackgrounds = {
            hero: {
                type: 'gradient',
                gradient: {
                    from: '#2563eb',
                    to: '#7c3aed',
                    direction: 'to-r'
                }
            },
            about: {
                type: 'solid',
                color: '#ffffff'
            },
            projects: {
                type: 'gradient',
                gradient: {
                    from: '#f8fafc',
                    to: '#e2e8f0',
                    direction: 'to-br'
                }
            },
            skills: {
                type: 'solid',
                color: '#f9fafb'
            },
            contact: {
                type: 'gradient',
                gradient: {
                    from: '#1f2937',
                    to: '#111827',
                    direction: 'to-r'
                }
            },
            experience: {
                type: 'solid',
                color: '#ffffff'
            },
            navigation: {
                type: 'solid',
                color: '#ffffff'
            }
        }

        const defaultTextStyles = {
            title: {
                textAlign: 'center' as const,
                fontSize: '3xl' as const,
                fontWeight: 'bold' as const,
                color: type === 'hero' || type === 'contact' ? '#ffffff' : '#111827'
            },
            subtitle: {
                textAlign: 'center' as const,
                fontSize: 'xl' as const,
                fontWeight: 'medium' as const,
                color: type === 'hero' || type === 'contact' ? '#f3f4f6' : '#6b7280'
            },
            content: {
                textAlign: 'left' as const,
                fontSize: 'base' as const,
                fontWeight: 'normal' as const,
                color: type === 'hero' || type === 'contact' ? '#f3f4f6' : '#374151'
            }
        }

        switch (type) {
            case 'hero':
                return {
                    title: 'Your Name',
                    subtitle: 'Your Professional Title',
                    description: 'Brief description about yourself and what you do.',
                    background: defaultBackgrounds.hero,
                    titleStyles: { ...defaultTextStyles.title, fontSize: '5xl' as const },
                    subtitleStyles: { ...defaultTextStyles.subtitle, fontSize: '2xl' as const },
                    descriptionStyles: { ...defaultTextStyles.content, textAlign: 'center' as const, fontSize: 'lg' as const },
                    image: null
                }
            case 'about':
                return {
                    title: 'About Me',
                    content: 'Tell your story and what makes you unique. Share your background, experiences, and what drives your passion in your field.',
                    background: defaultBackgrounds.about,
                    titleStyles: { ...defaultTextStyles.title, textAlign: 'left' as const },
                    contentStyles: defaultTextStyles.content,
                    image: null
                }
            case 'projects':
                return {
                    title: 'My Projects',
                    projects: [
                        {
                            id: `project-${Date.now()}`,
                            title: 'Sample Project',
                            description: 'This is a sample project. Click to edit and add your own projects.',
                            technologies: ['React', 'Next.js', 'TypeScript'],
                            titleStyles: { ...defaultTextStyles.title, fontSize: 'lg' as const, textAlign: 'left' as const, color: '#111827' },
                            descriptionStyles: { ...defaultTextStyles.content, fontSize: 'sm' as const, color: '#6b7280' }
                        }
                    ],
                    background: defaultBackgrounds.projects,
                    titleStyles: { ...defaultTextStyles.title, textAlign: 'center' as const }
                }
            case 'skills':
                return {
                    title: 'Skills & Expertise',
                    skills: [
                        { id: `skill-${Date.now()}`, name: 'JavaScript', level: 90, category: 'Programming' },
                        { id: `skill-${Date.now() + 1}`, name: 'React', level: 85, category: 'Frontend' },
                        { id: `skill-${Date.now() + 2}`, name: 'Node.js', level: 80, category: 'Backend' }
                    ],
                    background: defaultBackgrounds.skills,
                    titleStyles: { ...defaultTextStyles.title, textAlign: 'center' as const }
                }
            case 'experience':
                return {
                    title: 'Work Experience',
                    experiences: [
                        {
                            id: `exp-${Date.now()}`,
                            position: 'Software Developer',
                            company: 'Tech Company',
                            startDate: '2022',
                            endDate: 'Present',
                            description: 'Describe your role and achievements in this position.',
                            positionStyles: { fontSize: 'xl' as const, fontWeight: 'semibold' as const, textAlign: 'left' as const, color: '#111827' },
                            companyStyles: { fontSize: 'base' as const, fontWeight: 'medium' as const, textAlign: 'left' as const, color: '#2563eb' },
                            descriptionStyles: { fontSize: 'base' as const, fontWeight: 'normal' as const, textAlign: 'left' as const, color: '#6b7280' }
                        }
                    ],
                    background: defaultBackgrounds.experience,
                    titleStyles: { ...defaultTextStyles.title, textAlign: 'center' as const }
                }
            case 'contact':
                return {
                    title: 'Get In Touch',
                    email: 'your.email@example.com',
                    phone: '+1 (555) 123-4567',
                    location: 'Your Location',
                    background: defaultBackgrounds.contact,
                    titleStyles: { ...defaultTextStyles.title, color: '#ffffff' },
                    emailStyles: { ...defaultTextStyles.content, color: '#f3f4f6', fontSize: 'lg' as const, fontWeight: 'medium' as const },
                    phoneStyles: { ...defaultTextStyles.content, color: '#f3f4f6', fontSize: 'lg' as const, fontWeight: 'medium' as const },
                    locationStyles: { ...defaultTextStyles.content, color: '#f3f4f6', fontSize: 'lg' as const, fontWeight: 'medium' as const },
                    social: {}
                }
            case 'navigation':
                return {
                    title: 'Navigation',
                    background: defaultBackgrounds.navigation,
                    items: []
                }
            default:
                return {
                    background: { type: 'solid', color: '#ffffff' }
                }
        }
    }



    // This is the missing function that was causing the error
    const updateSection = async (sectionId: string, data: any) => {
        const newSections = sections.map(section =>
            section.id === sectionId
                ? { ...section, data: { ...section.data, ...data } }
                : section
        )
        setSections(newSections)
        await savePortfolio(newSections)
    }

    const deleteSection = async (sectionId: string) => {
        const newSections = sections.filter(section => section.id !== sectionId)
        setSections(newSections)
        setSelectedSectionId(null)
        await savePortfolio(newSections)
    }

    const duplicateSection = async (sectionId: string) => {
        const sectionToDuplicate = sections.find(s => s.id === sectionId)
        if (!sectionToDuplicate) return

        const newSection: PortfolioSection = {
            ...sectionToDuplicate,
            id: `section-${Date.now()}`,
            order: sections.length,
            data: { ...sectionToDuplicate.data } // Deep copy the data
        }

        const newSections = [...sections, newSection]
        setSections(newSections)
        await savePortfolio(newSections)
    }

    const savePortfolio = async (updatedSections: PortfolioSection[]) => {
        if (!portfolio) return

        try {
            setIsSaving(true)
            await updatePortfolio({
                ...portfolio,
                sections: updatedSections,
                updatedAt: new Date()
            })
        } catch (error) {
            console.error('Error saving portfolio:', error)
        } finally {
            setIsSaving(false)
        }
    }

    const handleThemeChange = async (theme: any) => {
        if (!portfolio) return

        try {
            setIsSaving(true)
            await updatePortfolio({
                ...portfolio,
                theme,
                updatedAt: new Date()
            })
        } catch (error) {
            console.error('Error updating theme:', error)
        } finally {
            setIsSaving(false)
        }
    }

    if (loading) {
        return <LoadingSpinner />
    }

    if (!portfolio) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-2">Portfolio not found</h2>
                    <p className="text-gray-600">The portfolio you're looking for doesn't exist or you don't have access to it.</p>
                </div>
            </div>
        )
    }

    return (
        <div className="h-screen bg-gray-50 flex flex-col">
            <BuilderHeader
                portfolio={portfolio}
                isPreviewMode={isPreviewMode}
                setIsPreviewMode={setIsPreviewMode}
                isSaving={isSaving}
                viewMode={viewMode}
                setViewMode={setViewMode}
                onThemeChange={handleThemeChange}
            />

            <div className="flex-1 flex overflow-hidden">
                <DndContext
                    collisionDetection={closestCenter}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                >
                    {!isPreviewMode && (
                        <BuilderSidebar
                            selectedSectionId={selectedSectionId}
                            setSelectedSectionId={setSelectedSectionId}
                            sections={sections}
                            updateSection={updateSection}
                            deleteSection={deleteSection}
                        />
                    )}

                    <SortableContext
                        items={sections.map(s => s.id)}
                        strategy={verticalListSortingStrategy}
                    >
                        <BuilderCanvas
                            sections={sections}
                            selectedSectionId={selectedSectionId}
                            setSelectedSectionId={setSelectedSectionId}
                            isPreviewMode={isPreviewMode}
                            onUpdateSection={updateSection}
                            onDeleteSection={deleteSection}
                            onDuplicateSection={duplicateSection}
                        />
                    </SortableContext>

                    <DragOverlay>
                        {activeSection && (
                            <div className="bg-white border-2 border-blue-500 rounded-lg p-4 shadow-lg">
                                <div className="text-sm font-medium text-gray-700 capitalize">
                                    {activeSection.type} Section
                                </div>
                            </div>
                        )}
                    </DragOverlay>
                </DndContext>
            </div>
        </div>
    )
}
