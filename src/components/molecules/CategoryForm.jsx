import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import Input from '@/components/atoms/Input'
import Button from '@/components/atoms/Button'

const CategoryForm = ({ 
  category = null, 
  onSubmit, 
  onCancel 
}) => {
  const [formData, setFormData] = useState({
    name: '',
    color: '#6B8E7F'
  })
  
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const predefinedColors = [
    '#6B8E7F', '#FF6B6B', '#4ECDC4', '#45B7D1', 
    '#96CEB4', '#FECA57', '#FF9FF3', '#54A0FF',
    '#5F27CD', '#00D2D3', '#FF9F43', '#EE5A24'
  ]

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name || '',
        color: category.color || '#6B8E7F'
      })
    }
  }, [category])

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.name.trim()) {
      newErrors.name = 'Category name is required'
    }
    
    if (formData.name.trim().length > 50) {
      newErrors.name = 'Category name must be less than 50 characters'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      toast.error('Please fix the errors below')
      return
    }
    
    setIsSubmitting(true)
    
    try {
      const categoryData = {
        ...formData,
        name: formData.name.trim()
      }
      
      await onSubmit(categoryData)
      
      toast.success(category ? 'Category updated successfully!' : 'Category created successfully!')
      
      if (!category) {
        // Reset form for new categories
        setFormData({
          name: '',
          color: '#6B8E7F'
        })
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }))
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Category Name
        </label>
        <Input
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          placeholder="Enter category name..."
          error={!!errors.name}
          disabled={isSubmitting}
        />
        {errors.name && (
          <p className="mt-1 text-sm text-accent-600">{errors.name}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Category Color
        </label>
        <div className="grid grid-cols-6 gap-3">
          {predefinedColors.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => handleChange('color', color)}
              className={`
                w-10 h-10 rounded-lg shadow-sm border-2 transition-all duration-200
                ${formData.color === color 
                  ? 'border-gray-400 scale-110' 
                  : 'border-gray-200 hover:border-gray-300 hover:scale-105'
                }
              `}
              style={{ backgroundColor: color }}
              disabled={isSubmitting}
            >
              {formData.color === color && (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="w-3 h-3 border-2 border-white rounded-full" />
                </div>
              )}
            </button>
          ))}
        </div>
        
        <div className="mt-4">
          <label className="block text-xs font-medium text-gray-500 mb-2">
            Or enter custom color
          </label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={formData.color}
              onChange={(e) => handleChange('color', e.target.value)}
              className="w-12 h-10 rounded-lg border border-gray-200 cursor-pointer"
              disabled={isSubmitting}
            />
            <Input
              value={formData.color.toUpperCase()}
              onChange={(e) => handleChange('color', e.target.value)}
              placeholder="#6B8E7F"
              className="flex-1 font-mono text-sm"
              disabled={isSubmitting}
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 pt-4">
        <Button
          type="submit"
          variant="primary"
          loading={isSubmitting}
          icon={category ? "Save" : "Plus"}
        >
          {category ? 'Update Category' : 'Create Category'}
        </Button>
        
        {onCancel && (
          <Button
            type="button"
            variant="ghost"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        )}
      </div>
    </form>
  )
}

export default CategoryForm