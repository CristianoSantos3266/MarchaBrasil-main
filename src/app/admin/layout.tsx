'use client'

import AdminSidebar from '@/components/admin/AdminSidebar'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  console.log('🚀 Admin Layout: Rendering admin interface - No auth checks')

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <AdminSidebar />
      <main className="flex-1 min-h-screen overflow-auto">
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  )
}