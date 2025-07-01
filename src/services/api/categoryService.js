import categoriesData from '@/services/mockData/categories.json'

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

// In-memory storage for demo purposes
let categories = [...categoriesData]

export const getAllCategories = async () => {
  await delay(250)
  return [...categories]
}

export const getCategoryById = async (id) => {
  await delay(200)
  const category = categories.find(category => category.Id === parseInt(id))
  if (!category) {
    throw new Error('Category not found')
  }
  return { ...category }
}

export const createCategory = async (categoryData) => {
  await delay(350)
  
  // Find the highest Id and add 1
  const maxId = categories.length > 0 ? Math.max(...categories.map(category => category.Id)) : 0
  const newCategory = {
    Id: maxId + 1,
    ...categoryData,
    taskCount: categoryData.taskCount || 0
  }
  
  categories.push(newCategory)
  return { ...newCategory }
}

export const updateCategory = async (id, categoryData) => {
  await delay(300)
  
  const index = categories.findIndex(category => category.Id === parseInt(id))
  if (index === -1) {
    throw new Error('Category not found')
  }
  
  const updatedCategory = {
    ...categories[index],
    ...categoryData
  }
  
  categories[index] = updatedCategory
  return { ...updatedCategory }
}

export const deleteCategory = async (id) => {
  await delay(250)
  
  const index = categories.findIndex(category => category.Id === parseInt(id))
  if (index === -1) {
    throw new Error('Category not found')
  }
  
  categories.splice(index, 1)
  return true
}

export const getCategoryTaskCount = async (categoryId) => {
  await delay(150)
  // This would typically be calculated on the backend
  // For now, we'll return the stored count
  const category = categories.find(category => category.Id === parseInt(categoryId))
  return category ? category.taskCount : 0
}