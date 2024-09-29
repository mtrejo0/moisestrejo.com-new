'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'

export default function AppListDisplay({ apps, displayApp, subRoute }) {
  const { id } = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [activeApp, setActiveApp] = useState(null)

  useEffect(() => {
    const queryId = searchParams.get('id')
    const initialApp = apps.find(app => app.id === (queryId || id)) || apps[0]
    setActiveApp(initialApp)
  }, [apps, id, searchParams])

  const handleAppChange = (appId) => {
    const newApp = apps.find(app => app.id === appId)
    if (newApp) {
      setActiveApp(newApp)
      router.push(`/${subRoute}?id=${appId}`, undefined, { shallow: true })
    }
  }

  if (!activeApp) return null

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-1/4">
          <div className="lg:hidden mb-4">
            <label htmlFor="app-select" className="sr-only">Select an app</label>
            <select
              id="app-select"
              className="w-full p-2 border border-gray-300 rounded"
              value={activeApp.id}
              onChange={(e) => handleAppChange(e.target.value)}
            >
              {apps.map((app) => (
                <option key={app.id} value={app.id}>
                  {app.name}
                </option>
              ))}
            </select>
          </div>
          <nav className="hidden lg:block h-[calc(100vh-4rem)] overflow-y-auto" aria-label="App navigation">
            <div className="pr-4 space-y-2">
              {apps.map((app) => (
                <button
                  key={app.id}
                  className={`w-full text-left px-4 py-2 rounded transition-colors duration-200 ${
                    app.id === activeApp.id
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                  }`}
                  onClick={() => handleAppChange(app.id)}
                  aria-current={app.id === activeApp.id ? 'page' : undefined}
                >
                  {app.name}
                </button>
              ))}
            </div>
          </nav>
        </div>
        <main className="w-full lg:w-3/4 overflow-y-auto h-[calc(100vh-4rem)]">
          <div className="bg-white p-6 rounded-lg">
            {displayApp(activeApp)}
          </div>
        </main>
      </div>
    </div>
  )
}