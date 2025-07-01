import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const Checkbox = ({
  checked = false,
  onChange,
  disabled = false,
  label,
  className = '',
  ...props
}) => {
  const handleChange = (e) => {
    if (!disabled && onChange) {
      onChange(e.target.checked)
    }
  }

  return (
    <label className={`inline-flex items-center cursor-pointer ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}>
      <div className="relative">
        <input
          type="checkbox"
          checked={checked}
          onChange={handleChange}
          disabled={disabled}
          className="sr-only"
          {...props}
        />
        <motion.div
          className={`
            w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-200
            ${checked
              ? 'bg-primary-400 border-primary-400'
              : 'bg-white border-gray-300 hover:border-primary-300'
            }
          `}
          whileHover={!disabled ? { scale: 1.05 } : {}}
          whileTap={!disabled ? { scale: 0.95 } : {}}
          animate={checked ? { scale: [1, 1.1, 1] } : {}}
          transition={{ duration: 0.2 }}
        >
          {checked && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              <ApperIcon name="Check" size={14} className="text-white" />
            </motion.div>
          )}
        </motion.div>
      </div>
      {label && (
        <span className="ml-3 text-sm font-medium text-gray-700 select-none">
          {label}
        </span>
      )}
    </label>
  )
}

export default Checkbox