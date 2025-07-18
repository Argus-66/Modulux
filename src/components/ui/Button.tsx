import { forwardRef } from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
  className?: string
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, variant = 'primary', size = 'md', isLoading, className = '', ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
    
    const variants = {
      primary: "bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg focus:ring-blue-500 active:transform active:scale-95",
      secondary: "bg-white border-2 border-blue-600 text-blue-600 hover:bg-blue-50 shadow-sm hover:shadow-md focus:ring-blue-500 active:transform active:scale-95",
      outline: "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 shadow-sm hover:shadow-md focus:ring-gray-500",
      ghost: "text-gray-700 hover:bg-gray-100 focus:ring-gray-500"
    }

    const sizes = {
      sm: "text-sm px-3 py-1.5 rounded-md",
      md: "text-sm px-4 py-2 rounded-lg",
      lg: "text-base px-6 py-3 rounded-lg"
    }

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        disabled={isLoading}
        {...props}
      >
        {isLoading ? (
          <div className="flex items-center">
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Loading...
          </div>
        ) : (
          children
        )}
      </button>
    )
  }
)

Button.displayName = 'Button'

export default Button
