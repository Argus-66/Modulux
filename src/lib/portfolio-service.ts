import clientPromise from './mongodb'
import { Portfolio } from '@/types/portfolio'
import { ObjectId, WithId } from 'mongodb'

// Define the MongoDB document type
type PortfolioDocument = Omit<Portfolio, '_id'> & {
  _id?: ObjectId
}

export class PortfolioService {
  private static async getCollection() {
    const client = await clientPromise
    return client.db('modulux').collection<PortfolioDocument>('portfolios')
  }

  // Helper method to convert MongoDB document to Portfolio interface
  private static documentToPortfolio(doc: WithId<PortfolioDocument>): Portfolio {
    return {
      ...doc,
      _id: doc._id.toString(),
      createdAt: doc.createdAt instanceof Date ? doc.createdAt : new Date(doc.createdAt),
      updatedAt: doc.updatedAt instanceof Date ? doc.updatedAt : new Date(doc.updatedAt),
      publishedAt: doc.publishedAt instanceof Date ? doc.publishedAt : doc.publishedAt ? new Date(doc.publishedAt) : undefined
    }
  }

  static async createPortfolio(userId: string, name: string): Promise<Portfolio> {
    const collection = await this.getCollection()
    
    const slug = this.generateSlug(name)
    const portfolioDoc: PortfolioDocument = {
      userId,
      name,
      slug,
      sections: [],
      theme: {
        primaryColor: '#2563eb',
        secondaryColor: '#1e40af',
        fontFamily: 'Inter',
        backgroundColor: '#ffffff',
        textColor: '#111827'
      },
      settings: {
        seo: {
          title: name,
          description: `${name} - Professional Portfolio`,
          keywords: []
        }
      },
      status: 'draft',
      createdAt: new Date(),
      updatedAt: new Date()
    }

    const result = await collection.insertOne(portfolioDoc)
    return {
      ...portfolioDoc,
      _id: result.insertedId.toString()
    }
  }

  static async getUserPortfolios(userId: string): Promise<Portfolio[]> {
    const collection = await this.getCollection()
    const portfolios = await collection
      .find({ userId })
      .sort({ updatedAt: -1 })
      .toArray()
    
    return portfolios.map(this.documentToPortfolio)
  }

  static async getPortfolio(portfolioId: string, userId?: string): Promise<Portfolio | null> {
    const collection = await this.getCollection()
    
    if (!ObjectId.isValid(portfolioId)) {
      return null
    }
    
    const query: any = { _id: new ObjectId(portfolioId) }
    
    if (userId) {
      query.userId = userId
    }

    const portfolio = await collection.findOne(query)
    return portfolio ? this.documentToPortfolio(portfolio) : null
  }

  static async getPortfolioBySlug(slug: string, userId?: string): Promise<Portfolio | null> {
    const collection = await this.getCollection()
    const query: any = { slug }
    
    if (userId) {
      query.userId = userId
    }

    const portfolio = await collection.findOne(query)
    return portfolio ? this.documentToPortfolio(portfolio) : null
  }

static async updatePortfolio(
  portfolioId: string, 
  userId: string, 
  updates: Partial<Portfolio>
): Promise<Portfolio | null> {
  try {
    const collection = await this.getCollection()
    
    if (!ObjectId.isValid(portfolioId)) {
      throw new Error('Invalid portfolio ID format')
    }
    
    // Remove _id and convert dates properly
    const { _id, createdAt, ...updateData } = updates
    const updateDoc = {
      ...updateData,
      updatedAt: new Date()
    }
    
    const result = await collection.findOneAndUpdate(
      { _id: new ObjectId(portfolioId), userId },
      { $set: updateDoc },
      { returnDocument: 'after' }
    )

    if (!result) {
      throw new Error('Portfolio not found or access denied')
    }

    return this.documentToPortfolio(result)
  } catch (error: any) {
    console.error('Error updating portfolio:', error)
    
    // Handle specific MongoDB errors
    if (error.code === 11000) {
      throw new Error('Duplicate key error: Portfolio with this data already exists')
    }
    
    if (error.name === 'ValidationError') {
      throw new Error('Invalid portfolio data provided')
    }
    
    // Re-throw the error for the caller to handle
    throw error
  }
}

  static async deletePortfolio(portfolioId: string, userId: string): Promise<boolean> {
    const collection = await this.getCollection()
    
    if (!ObjectId.isValid(portfolioId)) {
      return false
    }
    
    const result = await collection.deleteOne({ 
      _id: new ObjectId(portfolioId), 
      userId 
    })
    
    return result.deletedCount === 1
  }

  static async publishPortfolio(portfolioId: string, userId: string): Promise<Portfolio | null> {
    const collection = await this.getCollection()
    
    if (!ObjectId.isValid(portfolioId)) {
      return null
    }
    
    const result = await collection.findOneAndUpdate(
      { _id: new ObjectId(portfolioId), userId },
      { 
        $set: { 
          status: 'published',
          publishedAt: new Date(),
          updatedAt: new Date()
        } 
      },
      { returnDocument: 'after' }
    )

    return result ? this.documentToPortfolio(result) : null
  }

  static async duplicatePortfolio(
    portfolioId: string, 
    userId: string, 
    newName: string
  ): Promise<Portfolio | null> {
    const originalPortfolio = await this.getPortfolio(portfolioId, userId)
    if (!originalPortfolio) return null

    const newSlug = this.generateSlug(newName)
    const { _id, createdAt, updatedAt, publishedAt, deploymentUrl, ...portfolioData } = originalPortfolio
    
    const duplicatedDoc: PortfolioDocument = {
      ...portfolioData,
      name: newName,
      slug: newSlug,
      status: 'draft',
      createdAt: new Date(),
      updatedAt: new Date()
    }

    const collection = await this.getCollection()
    const result = await collection.insertOne(duplicatedDoc)
    
    return {
      ...duplicatedDoc,
      _id: result.insertedId.toString()
    }
  }

  private static generateSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
      + '-' + Date.now().toString(36)
  }
}
