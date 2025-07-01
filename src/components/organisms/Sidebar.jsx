import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import CategoryItem from '@/components/molecules/CategoryItem'
import CategoryForm from '@/components/molecules/CategoryForm'

const Sidebar = ({ 
  categories = [], 
  activeCategoryId, 
  onCategorySelect, 
  onCategoryCreate,
  onCategoryUpdate,
  onCategoryDelete,
  taskCounts = {},
  isMobileOpen = false,
  onMobileClose
}) => {
  const [showCategoryForm, setShowCategoryForm] = useState(false)
  const [editingCategory, setEditingCategory] = useState(null)

  const handleCategorySubmit = async (categoryData) => {
    try {
      if (editingCategory) {
        await onCategoryUpdate(editingCategory.Id, categoryData)
        setEditingCategory(null)
      } else {
        await onCategoryCreate(categoryData)
      }
      setShowCategoryForm(false)
    } catch (error) {
      throw error
    }
  }

  const handleEditCategory = (category) => {
    setEditingCategory(category)
    setShowCategoryForm(true)
  }

  const handleCancelForm = () => {
    setShowCategoryForm(false)
    setEditingCategory(null)
  }

  const allTasksCount = taskCounts.all || 0

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onMobileClose}
        />
      )}

      {/* Sidebar */}
      <motion.aside 
        initial={{ x: 0 }}
        animate={{ 
          x: isMobileOpen ? 0 : 0  // Always visible on desktop, controlled by parent on mobile
        }}
        className={`
          fixed lg:static inset-y-0 left-0 z-50 lg:z-auto
          w-80 bg-white border-r border-gray-200 shadow-lg lg:shadow-none
          transform transition-transform duration-300 ease-out lg:transform-none
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl flex items-center justify-center">
                  <ApperIcon name="CheckSquare" size={20} className="text-white" />
                </div>
                <div>
                  <h1 className="font-display font-bold text-xl text-gray-900">TaskFlow</h1>
                  <p className="text-sm text-gray-500">Stay organized</p>
                </div>
              </div>
              
              {/* Mobile Close Button */}
              <button
                onClick={onMobileClose}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
              >
                <ApperIcon name="X" size={20} className="text-gray-500" />
              </button>
            </div>

            {/* All Tasks Button */}
            <motion.button
              whileHover={{ x: 4 }}
              onClick={() => onCategorySelect(null)}
              className={`
                w-full flex items-center justify-between p-4 rounded-xl mb-4
                transition-all duration-200 ease-out
                ${!activeCategoryId 
                  ? 'bg-primary-50 border-2 border-primary-200' 
                  : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                }
              `}
            >
              <div className="flex items-center gap-3">
                <ApperIcon 
                  name="Inbox" 
                  size={20} 
                  className={activeCategoryId ? 'text-gray-600' : 'text-primary-600'} 
                />
                <span className={`font-medium ${activeCategoryId ? 'text-gray-700' : 'text-primary-700'}`}>
                  All Tasks
                </span>
              </div>
              <span className={`
                px-2 py-1 rounded-full text-xs font-medium
                ${!activeCategoryId
                  ? 'bg-primary-100 text-primary-600'
                  : 'bg-white text-gray-500'
                }
              `}>
                {allTasksCount}
              </span>
            </motion.button>
          </div>

          {/* Categories */}
          <div className="flex-1 overflow-hidden flex flex-col">
            <div className="p-6 pb-3">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display font-semibold text-gray-900">Categories</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  icon="Plus"
                  onClick={() => setShowCategoryForm(!showCategoryForm)}
                  className="text-primary-600 hover:text-primary-700 hover:bg-primary-50"
                />
              </div>

              <AnimatePresence>
                {showCategoryForm && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-4 p-4 bg-gray-50 rounded-xl"
                  >
                    <CategoryForm
                      category={editingCategory}
                      onSubmit={handleCategorySubmit}
                      onCancel={handleCancelForm}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="flex-1 overflow-y-auto px-6 pb-6 custom-scrollbar">
              <div className="space-y-2">
                {categories.length > 0 ? (
                  categories.map((category) => (
                    <CategoryItem
                      key={category.Id}
                      category={category}
                      isActive={activeCategoryId === category.Id}
                      onClick={onCategorySelect}
                      onEdit={handleEditCategory}
                      onDelete={onCategoryDelete}
                    />
                  ))
                ) : (
                  <div className="text-center py-8">
                    <ApperIcon name="FolderPlus" size={48} className="text-gray-300 mx-auto mb-3" />
                    <p className="text-sm text-gray-500 mb-2">No categories yet</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      icon="Plus"
                      onClick={() => setShowCategoryForm(true)}
                      className="text-primary-600"
                    >
                      Create your first category
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer Stats */}
          <div className="p-6 border-t border-gray-100 bg-gray-50">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-600">
                  {taskCounts.completed || 0}
                </div>
                <div className="text-xs text-gray-500">Completed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent-600">
                  {taskCounts.active || 0}
                </div>
                <div className="text-xs text-gray-500">Remaining</div>
              </div>
            </div>
          </div>
        </div>
      </motion.aside>
    </>
  )
}

export default Sidebar