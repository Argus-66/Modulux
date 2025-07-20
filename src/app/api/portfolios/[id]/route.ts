import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { PortfolioService } from '@/lib/portfolio-service'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const portfolio = await PortfolioService.getPortfolio(params.id, session.user.id)
    
    if (!portfolio) {
      return NextResponse.json(
        { error: 'Portfolio not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      portfolio
    })
  } catch (error) {
    console.error('Error fetching portfolio:', error)
    return NextResponse.json(
      { error: 'Failed to fetch portfolio' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required', code: 'UNAUTHORIZED' }, 
        { status: 401 }
      )
    }

    const updates = await request.json()
    
    // Validate updates object
    if (!updates || typeof updates !== 'object') {
      return NextResponse.json(
        { error: 'Invalid request body', code: 'INVALID_DATA' },
        { status: 400 }
      )
    }

    const portfolio = await PortfolioService.updatePortfolio(
      params.id,
      session.user.id,
      updates
    )

    if (!portfolio) {
      return NextResponse.json(
        { error: 'Portfolio not found', code: 'NOT_FOUND' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      portfolio,
      message: 'Portfolio updated successfully'
    })
  } catch (error) {
    console.error('API Error updating portfolio:', error)
    
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Internal server error',
        code: 'INTERNAL_ERROR' 
      },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const deleted = await PortfolioService.deletePortfolio(params.id, session.user.id)
    
    if (!deleted) {
      return NextResponse.json(
        { error: 'Portfolio not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Portfolio deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting portfolio:', error)
    return NextResponse.json(
      { error: 'Failed to delete portfolio' },
      { status: 500 }
    )
  }
}
