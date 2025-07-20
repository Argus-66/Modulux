import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { PortfolioService } from '@/lib/portfolio-service'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const portfolio = await PortfolioService.publishPortfolio(
      params.id,
      session.user.id
    )

    if (!portfolio) {
      return NextResponse.json(
        { error: 'Portfolio not found' },
        { status: 404 }
      )
    }

    // TODO: Implement actual deployment logic (GitHub + Vercel integration)
    console.log('Publishing portfolio:', portfolio.slug)

    return NextResponse.json({
      success: true,
      portfolio,
      message: 'Portfolio published successfully'
    })
  } catch (error) {
    console.error('Error publishing portfolio:', error)
    return NextResponse.json(
      { error: 'Failed to publish portfolio' },
      { status: 500 }
    )
  }
}
