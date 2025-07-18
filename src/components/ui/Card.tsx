import { forwardRef } from 'react'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  variant?: 'default' | 'elevated' | 'bordered'
  className?: string
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ children, variant = 'default', className = '', ...props }, ref) => {
    const variants = {
      default: "bg-white shadow-sm border border-gray-200",
      elevated: "bg-white shadow-md hover:shadow-lg transition-shadow duration-200",
      bordered: "bg-white border-2 border-gray-200 hover:border-gray-300 transition-colors duration-200"
    }

    return (
      <div
        ref={ref}
        className={`rounded-lg ${variants[variant]} ${className}`}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Card.displayName = 'Card'

export default Card
