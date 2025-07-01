import { motion } from 'framer-motion'

const Badge = ({
  children,
  variant = 'default',
  size = 'md',
  className = '',
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-full'
  
  const variants = {
    default: 'bg-gray-100 text-gray-700',
    primary: 'bg-primary-100 text-primary-700',
    success: 'bg-green-100 text-green-700',
    warning: 'bg-yellow-100 text-yellow-700',
    error: 'bg-red-100 text-red-700',
    high: 'bg-accent-100 text-accent-700 shadow-sm',
    medium: 'bg-warning text-gray-800 shadow-sm',
    low: 'bg-success text-white shadow-sm'
  }
  
  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs',
    lg: 'px-3 py-1.5 text-sm'
  }
  
  const badgeClasses = `
    ${baseClasses}
    ${variants[variant]}
    ${sizes[size]}
    ${className}
  `.trim()

  return (
    <motion.span
      whileHover={{ scale: 1.05 }}
      className={badgeClasses}
      {...props}
    >
      {children}
    </motion.span>
  )
}

export default Badge