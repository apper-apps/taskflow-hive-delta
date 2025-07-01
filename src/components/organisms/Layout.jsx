import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import Sidebar from '@/components/organisms/Sidebar'

const Layout = () => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen)
  }

  const closeMobileSidebar = () => {
    setIsMobileSidebarOpen(false)
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-30 bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-primary-600 rounded-lg flex items-center justify-center">
              <ApperIcon name="CheckSquare" size={16} className="text-white" />
            </div>
            <h1 className="font-display font-bold text-lg text-gray-900">TaskFlow</h1>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            icon="Menu"
            onClick={toggleMobileSidebar}
            className="text-gray-600"
          />
        </div>
      </div>

      {/* Sidebar - Always visible on desktop, toggle on mobile */}
      <div className="hidden lg:block">
        <Sidebar 
          isMobileOpen={false}
          onMobileClose={closeMobileSidebar}
        />
      </div>

      {/* Mobile Sidebar */}
      <div className="lg:hidden">
        <Sidebar 
          isMobileOpen={isMobileSidebarOpen}
          onMobileClose={closeMobileSidebar}
        />
      </div>

      {/* Main Content */}
      <main className="flex-1 lg:ml-0 pt-16 lg:pt-0">
        <div className="h-full">
          <Outlet context={{ 
            closeMobileSidebar,
            isMobileSidebarOpen 
          }} />
        </div>
      </main>
    </div>
  )
}

export default Layout