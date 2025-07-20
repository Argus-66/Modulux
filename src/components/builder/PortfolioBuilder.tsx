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
        if (sectionType && over.id === 'canvas') {
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
        const defaultData = {
            hero: {
                title: '',
                subtitle: '',
                description: '',
                image: null
            },
            about: {
                title: 'About Me',
                content: '',
                image: null
            },
            projects: {
                title: 'My Projects',
                projects: []
            },
            skills: {
                title: 'Skills & Expertise',
                skills: []
            },
            contact: {
                title: 'Get In Touch',
                email: '',
                phone: '',
                social: {}
            },
            navigation: {
                title: 'Navigation',
                items: [
                    { name: 'Home', href: '#home' },
                    { name: 'About', href: '#about' },
                    { name: 'Projects', href: '#projects' },
                    { name: 'Contact', href: '#contact' }
                ]
            }
        }

        return defaultData[type] || {}
    }


    const updateSection = async (sectionId: string, data: any) => {
        const newSections = sections.map(section =>
            section.id === sectionId
                ? { ...section, data: { ...section.data, ...data } }
                : section
        )
        setSections(newSections)
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

    const deleteSection = async (sectionId: string) => {
        const newSections = sections.filter(section => section.id !== sectionId)
        setSections(newSections)
        setSelectedSectionId(null)
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
                            onDeleteSection={deleteSection} // This should already exist
                            onDuplicateSection={duplicateSection} // Add this new function
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
