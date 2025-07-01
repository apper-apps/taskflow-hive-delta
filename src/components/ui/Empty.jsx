import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'

const Empty = ({ 
  title = "No tasks yet",
  description = "Create your first task to get started with TaskFlow",
  actionLabel = "Create Task",
  onAction,
  icon = "CheckSquare"
}) => {
  const handleAction = () => {
    if (onAction) {
      onAction()
    } else {
      // Trigger the add task button in the header
      const addButton = document.querySelector('[data-testid="add-task-button"]')
      if (addButton) {
        addButton.click()
      }
    }
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="bg-white rounded-2xl p-12 shadow-soft border border-gray-100 text-center max-w-md w-full"
      >
        {/* Icon with Animation */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ 
            delay: 0.2, 
            type: "spring", 
            stiffness: 200,
            duration: 0.6
          }}
          className="w-24 h-24 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center mx-auto mb-8"
        >
          <motion.div
            animate={{ 
              y: [0, -4, 0],
            }}
            transition={{ 
              delay: 0.8,
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <ApperIcon name={icon} size={36} className="text-primary-600" />
          </motion.div>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="font-display font-bold text-2xl text-gray-900 mb-4">
            {title}
          </h3>
          <p className="text-gray-600 mb-8 leading-relaxed">
            {description}
          </p>
        </motion.div>

        {/* Action Button */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Button
            variant="primary"
            icon="Plus"
            onClick={handleAction}
            className="mb-6 shadow-medium hover:shadow-hover"
            size="lg"
          >
            {actionLabel}
          </Button>
        </motion.div>

        {/* Inspiring Message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="pt-6 border-t border-gray-100"
        >
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
            <ApperIcon name="Sparkles" size={16} className="text-primary-400" />
            <span>Let's build something amazing together</span>
          </div>
        </motion.div>

        {/* Feature Highlights */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-8 grid grid-cols-3 gap-4"
        >
          {[
            { icon: "Target", label: "Stay Focused" },
            { icon: "Calendar", label: "Set Due Dates" },
            { icon: "Award", label: "Track Progress" }
          ].map((feature, index) => (
            <motion.div
              key={feature.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.9 + index * 0.1 }}
              className="text-center"
            >
              <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center mx-auto mb-2">
                <ApperIcon name={feature.icon} size={16} className="text-primary-600" />
              </div>
              <span className="text-xs font-medium text-gray-600">{feature.label}</span>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  )
}

export default Empty