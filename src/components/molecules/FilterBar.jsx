import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'

const FilterBar = ({ 
  filters, 
  onFilterChange, 
  taskCounts = {}
}) => {
  const filterButtons = [
    { 
      key: 'all', 
      label: 'All Tasks', 
      icon: 'List',
      count: taskCounts.all || 0
    },
    { 
      key: 'active', 
      label: 'Active', 
      icon: 'Circle',
      count: taskCounts.active || 0
    },
    { 
      key: 'completed', 
      label: 'Completed', 
      icon: 'CheckCircle',
      count: taskCounts.completed || 0
    }
  ]

  const priorityFilters = [
    { key: 'high', label: 'High', color: 'text-accent-600' },
    { key: 'medium', label: 'Medium', color: 'text-yellow-600' },
    { key: 'low', label: 'Low', color: 'text-green-600' }
  ]

  return (
    <div className="bg-white rounded-xl p-6 shadow-soft border border-gray-100">
      <div className="space-y-6">
        {/* Status Filters */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3">Status</h3>
          <div className="flex flex-wrap gap-2">
            {filterButtons.map((filter) => (
              <motion.button
                key={filter.key}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onFilterChange('status', filter.key)}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium
                  transition-all duration-200 ease-out
                  ${filters.status === filter.key
                    ? 'bg-primary-50 text-primary-700 border-2 border-primary-200'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border-2 border-transparent'
                  }
                `}
              >
                <ApperIcon name={filter.icon} size={16} />
                {filter.label}
                <span className={`
                  px-2 py-0.5 rounded-full text-xs
                  ${filters.status === filter.key
                    ? 'bg-primary-100 text-primary-600'
                    : 'bg-white text-gray-500'
                  }
                `}>
                  {filter.count}
                </span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Priority Filters */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3">Priority</h3>
          <div className="flex flex-wrap gap-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onFilterChange('priority', 'all')}
              className={`
                px-4 py-2 rounded-lg text-sm font-medium
                transition-all duration-200 ease-out
                ${filters.priority === 'all'
                  ? 'bg-primary-50 text-primary-700 border-2 border-primary-200'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border-2 border-transparent'
                }
              `}
            >
              All Priorities
            </motion.button>
            
            {priorityFilters.map((filter) => (
              <motion.button
                key={filter.key}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onFilterChange('priority', filter.key)}
                className={`
                  px-4 py-2 rounded-lg text-sm font-medium
                  transition-all duration-200 ease-out
                  ${filters.priority === filter.key
                    ? 'bg-primary-50 text-primary-700 border-2 border-primary-200'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border-2 border-transparent'
                  }
                `}
              >
                <span className={filter.color}>●</span>
                {filter.label}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Sort Options */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3">Sort by</h3>
          <div className="flex flex-wrap gap-2">
            {[
              { key: 'dueDate', label: 'Due Date', icon: 'Calendar' },
              { key: 'priority', label: 'Priority', icon: 'AlertCircle' },
              { key: 'created', label: 'Created', icon: 'Clock' },
              { key: 'alphabetical', label: 'A-Z', icon: 'ArrowUpDown' }
            ].map((sort) => (
              <motion.button
                key={sort.key}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onFilterChange('sortBy', sort.key)}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium
                  transition-all duration-200 ease-out
                  ${filters.sortBy === sort.key
                    ? 'bg-primary-50 text-primary-700 border-2 border-primary-200'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border-2 border-transparent'
                  }
                `}
              >
                <ApperIcon name={sort.icon} size={16} />
                {sort.label}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Clear Filters */}
        {(filters.status !== 'all' || filters.priority !== 'all' || filters.sortBy !== 'dueDate') && (
          <div className="pt-4 border-t border-gray-100">
            <Button
              variant="ghost"
              size="sm"
              icon="X"
              onClick={() => onFilterChange('reset')}
              className="text-gray-500 hover:text-gray-700"
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

export default FilterBar