import { forwardRef } from 'react'

const Textarea = forwardRef(({
  placeholder,
  value,
  onChange,
  disabled = false,
  error = false,
  rows = 3,
  className = '',
  ...props
}, ref) => {
  const baseClasses = 'w-full px-4 py-3 rounded-lg border transition-all duration-200 ease-out focus-ring bg-white resize-none'
  
  const stateClasses = error
    ? 'border-accent-300 focus:border-accent-500'
    : 'border-gray-200 focus:border-primary-400 hover:border-gray-300'
  
  const disabledClasses = disabled
    ? 'bg-gray-50 text-gray-400 cursor-not-allowed'
    : 'text-gray-900'
  
  const textareaClasses = `
    ${baseClasses}
    ${stateClasses}
    ${disabledClasses}
    ${className}
  `.trim()

  return (
    <textarea
      ref={ref}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      disabled={disabled}
      rows={rows}
      className={textareaClasses}
      {...props}
    />
  )
})

Textarea.displayName = 'Textarea'

export default Textarea