import { forwardRef } from 'react'
import ApperIcon from '@/components/ApperIcon'

const Select = forwardRef(({
  value,
  onChange,
  options = [],
  placeholder = 'Select an option',
  disabled = false,
  error = false,
  className = '',
  ...props
}, ref) => {
  const baseClasses = 'w-full px-4 py-3 pr-10 rounded-lg border transition-all duration-200 ease-out focus-ring bg-white appearance-none'
  
  const stateClasses = error
    ? 'border-accent-300 focus:border-accent-500'
    : 'border-gray-200 focus:border-primary-400 hover:border-gray-300'
  
  const disabledClasses = disabled
    ? 'bg-gray-50 text-gray-400 cursor-not-allowed'
    : 'text-gray-900 cursor-pointer'
  
  const selectClasses = `
    ${baseClasses}
    ${stateClasses}
    ${disabledClasses}
    ${className}
  `.trim()

  return (
    <div className="relative">
      <select
        ref={ref}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={selectClasses}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
        <ApperIcon name="ChevronDown" size={20} className="text-gray-400" />
      </div>
    </div>
  )
})

Select.displayName = 'Select'

export default Select