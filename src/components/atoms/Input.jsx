import { forwardRef } from 'react'

const Input = forwardRef(({
  type = 'text',
  placeholder,
  value,
  onChange,
  disabled = false,
  error = false,
  className = '',
  ...props
}, ref) => {
const baseClasses = type === 'date' 
    ? 'w-full px-4 py-3 rounded-lg border transition-all duration-200 ease-out focus-ring bg-white [color-scheme:light]'
    : 'w-full px-4 py-3 rounded-lg border transition-all duration-200 ease-out focus-ring bg-white'
  
  const stateClasses = error
    ? 'border-accent-300 focus:border-accent-500'
    : 'border-gray-200 focus:border-primary-400 hover:border-gray-300'
  
  const disabledClasses = disabled
    ? 'bg-gray-50 text-gray-400 cursor-not-allowed'
    : 'text-gray-900'
  
  const inputClasses = `
    ${baseClasses}
    ${stateClasses}
    ${disabledClasses}
    ${className}
  `.trim()

  return (
    <input
      ref={ref}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className={inputClasses}
      {...props}
    />
  )
})

Input.displayName = 'Input'

export default Input