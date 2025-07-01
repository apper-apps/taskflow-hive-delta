import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  disabled = false,
  loading = false,
  className = '',
  onClick,
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg focus-ring transition-all duration-200 ease-out'
  
  const variants = {
    primary: 'bg-primary-400 hover:bg-primary-500 text-white shadow-soft hover:shadow-medium',
    secondary: 'bg-secondary-50 hover:bg-secondary-100 text-primary-600 border border-primary-200',
    ghost: 'bg-transparent hover:bg-primary-50 text-primary-600',
    danger: 'bg-accent-500 hover:bg-accent-600 text-white shadow-soft hover:shadow-medium',
    success: 'bg-success hover:bg-opacity-90 text-white shadow-soft hover:shadow-medium'
  }
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
    xl: 'px-8 py-4 text-lg'
  }
  
  const buttonClasses = `
    ${baseClasses}
    ${variants[variant]}
    ${sizes[size]}
    ${disabled || loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
    ${className}
  `.trim()

  const iconSize = size === 'sm' ? 16 : size === 'lg' ? 20 : size === 'xl' ? 24 : 18

  return (
    <motion.button
      whileHover={!disabled && !loading ? { scale: 1.02 } : {}}
      whileTap={!disabled && !loading ? { scale: 0.98 } : {}}
      className={buttonClasses}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading && (
        <ApperIcon 
          name="Loader2" 
          size={iconSize} 
          className={`animate-spin ${iconPosition === 'left' ? 'mr-2' : 'ml-2'}`} 
        />
      )}
      
      {!loading && icon && iconPosition === 'left' && (
        <ApperIcon 
          name={icon} 
          size={iconSize} 
          className="mr-2" 
        />
      )}
      
      {children}
      
      {!loading && icon && iconPosition === 'right' && (
        <ApperIcon 
          name={icon} 
          size={iconSize} 
          className="ml-2" 
        />
      )}
    </motion.button>
  )
}

export default Button