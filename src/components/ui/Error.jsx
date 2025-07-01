import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'

const Error = ({ 
  message = 'Something went wrong', 
  onRetry,
  showRetry = true 
}) => {
  return (
    <div className="min-h-[60vh] flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-2xl p-12 shadow-soft border border-gray-100 text-center max-w-md w-full"
      >
        {/* Error Icon with Animation */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="w-20 h-20 bg-gradient-to-br from-accent-100 to-accent-200 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <motion.div
            animate={{ 
              rotate: [0, -10, 10, -10, 0],
            }}
            transition={{ 
              delay: 0.5,
              duration: 0.8,
              ease: "easeInOut"
            }}
          >
            <ApperIcon name="AlertTriangle" size={32} className="text-accent-600" />
          </motion.div>
        </motion.div>

        {/* Error Message */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="font-display font-bold text-xl text-gray-900 mb-3">
            Oops! Something went wrong
          </h3>
          <p className="text-gray-600 mb-8 leading-relaxed">
            {message}
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-3"
        >
          {showRetry && onRetry && (
            <Button
              variant="primary"
              icon="RefreshCw"
              onClick={onRetry}
              className="w-full"
            >
              Try Again
            </Button>
          )}
          
          <Button
            variant="ghost"
            icon="ArrowLeft"
            onClick={() => window.location.reload()}
            className="w-full"
          >
            Refresh Page
          </Button>
        </motion.div>

        {/* Helpful Tips */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-8 pt-6 border-t border-gray-100"
        >
          <p className="text-sm text-gray-500 mb-3">Having trouble?</p>
          <div className="flex items-center justify-center gap-4 text-xs text-gray-400">
            <span className="flex items-center gap-1">
              <ApperIcon name="Wifi" size={14} />
              Check connection
            </span>
            <span className="flex items-center gap-1">
              <ApperIcon name="Clock" size={14} />
              Wait a moment
            </span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default Error