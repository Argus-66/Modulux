import { useState, useEffect } from 'react'
import { Portfolio } from '@/types/portfolio'

export function usePortfolios() {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPortfolios = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch('/api/portfolios')
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to fetch portfolios')
      }
      
      const data = await response.json()
      setPortfolios(data.portfolios || [])
    } catch (err) {
      console.error('Error fetching portfolios:', err)
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const createPortfolio = async (name: string): Promise<Portfolio> => {
    try {
      const response = await fetch('/api/portfolios', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create portfolio')
      }

      const data = await response.json()
      setPortfolios(prev => [data.portfolio, ...prev])
      return data.portfolio
    } catch (err) {
      console.error('Error creating portfolio:', err)
      throw err instanceof Error ? err : new Error('An error occurred')
    }
  }

  const deletePortfolio = async (portfolioId: string): Promise<void> => {
    try {
      const response = await fetch(`/api/portfolios/${portfolioId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to delete portfolio')
      }

      setPortfolios(prev => prev.filter(p => p._id !== portfolioId))
    } catch (err) {
      console.error('Error deleting portfolio:', err)
      throw err instanceof Error ? err : new Error('An error occurred')
    }
  }

  const publishPortfolio = async (portfolioId: string): Promise<Portfolio> => {
    try {
      const response = await fetch(`/api/portfolios/${portfolioId}/publish`, {
        method: 'POST',
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to publish portfolio')
      }

      const data = await response.json()
      setPortfolios(prev => prev.map(p => 
        p._id === portfolioId ? data.portfolio : p
      ))
      return data.portfolio
    } catch (err) {
      console.error('Error publishing portfolio:', err)
      throw err instanceof Error ? err : new Error('An error occurred')
    }
  }

  useEffect(() => {
    fetchPortfolios()
  }, [])

  return {
    portfolios,
    loading,
    error,
    createPortfolio,
    deletePortfolio,
    publishPortfolio,
    refetch: fetchPortfolios
  }
}

export function usePortfolio(portfolioId: string) {
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPortfolio = async () => {
    if (!portfolioId) return
    
    try {
      setLoading(true)
      setError(null)
      const response = await fetch(`/api/portfolios/${portfolioId}`)
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to fetch portfolio')
      }
      
      const data = await response.json()
      setPortfolio(data.portfolio)
    } catch (err) {
      console.error('Error fetching portfolio:', err)
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const updatePortfolio = async (updates: Partial<Portfolio>): Promise<Portfolio | null> => {
    if (!portfolioId) return null
    
    try {
      const response = await fetch(`/api/portfolios/${portfolioId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update portfolio')
      }

      const data = await response.json()
      setPortfolio(data.portfolio)
      return data.portfolio
    } catch (err) {
      console.error('Error updating portfolio:', err)
      throw err instanceof Error ? err : new Error('An error occurred')
    }
  }

  useEffect(() => {
    fetchPortfolio()
  }, [portfolioId])

  return {
    portfolio,
    loading,
    error,
    updatePortfolio,
    refetch: fetchPortfolio
  }
}
