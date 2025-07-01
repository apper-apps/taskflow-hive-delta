import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const CategoryItem = ({ 
  category, 
  isActive, 
  onClick, 
  onEdit, 
  onDelete 
}) => {
  return (
    <motion.div
      whileHover={{ x: 4 }}
      className={`
        group flex items-center justify-between p-3 rounded-lg cursor-pointer
        transition-all duration-200 ease-out
        ${isActive 
          ? 'bg-primary-50 border-l-4 border-primary-400' 
          : 'hover:bg-gray-50'
        }
      `}
      onClick={() => onClick(category.Id)}
    >
      <div className="flex items-center gap-3 flex-1">
        <div 
          className="w-3 h-3 rounded-full shadow-sm"
          style={{ backgroundColor: category.color }}
        />
        <div className="flex-1">
          <h4 className={`
            font-medium text-sm
            ${isActive ? 'text-primary-700' : 'text-gray-700'}
          `}>
            {category.name}
          </h4>
          <p className="text-xs text-gray-500 mt-0.5">
            {category.taskCount} {category.taskCount === 1 ? 'task' : 'tasks'}
          </p>
        </div>
      </div>
      
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={(e) => {
            e.stopPropagation()
            onEdit(category)
          }}
          className="p-1 rounded hover:bg-primary-100 text-gray-400 hover:text-primary-600"
        >
          <ApperIcon name="Edit3" size={14} />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation()
            onDelete(category.Id)
          }}
          className="p-1 rounded hover:bg-accent-50 text-gray-400 hover:text-accent-600"
        >
          <ApperIcon name="Trash2" size={14} />
        </button>
      </div>
    </motion.div>
  )
}

export default CategoryItem