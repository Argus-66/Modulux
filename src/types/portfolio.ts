export interface Portfolio {
  _id?: string  // Always string in frontend
  userId: string
  name: string
  slug: string
  sections: PortfolioSection[]
  theme: PortfolioTheme
  settings: PortfolioSettings
  status: 'draft' | 'published'
  createdAt: Date
  updatedAt: Date
  publishedAt?: Date
  deploymentUrl?: string
  githubRepo?: string
}

export interface PortfolioSection {
  id: string
  type: 'hero' | 'about' | 'projects' | 'skills' | 'contact' | 'experience' | 'education'
  data: SectionData
  order: number
  isVisible: boolean
}

// Fix: Define specific data types for better type safety
export interface SectionData {
  [key: string]: any
}

export interface HeroSectionData {
  title: string
  subtitle: string
  description: string
  image?: string
}

export interface AboutSectionData {
  title: string
  content: string
  image?: string
}

export interface ProjectsSectionData {
  title: string
  projects: Project[]
}

export interface SkillsSectionData {
  title: string
  skills: Skill[]
}

export interface ContactSectionData {
  title: string
  email: string
  phone: string
  social: Record<string, SocialLink>
}

export interface PortfolioTheme {
  primaryColor: string
  secondaryColor: string
  fontFamily: string
  backgroundColor: string
  textColor: string
}

export interface PortfolioSettings {
  seo: {
    title: string
    description: string
    keywords: string[]
  }
  domain?: string
  analytics?: {
    googleAnalyticsId?: string
  }
}

export interface Project {
  id: string
  title: string
  description: string
  image?: string
  technologies: string[]
  liveUrl?: string
  githubUrl?: string
  featured: boolean
}

export interface Skill {
  id: string
  name: string
  level: number
  category: string
  icon?: string
}

export interface Experience {
  id: string
  company: string
  position: string
  startDate: string
  endDate?: string
  description: string
  technologies: string[]
  isCurrentRole: boolean
}

export interface Education {
  id: string
  institution: string
  degree: string
  field: string
  startDate: string
  endDate?: string
  description?: string
  gpa?: string
}

export interface SocialLink {
  platform: string
  url: string
  icon: string
}
