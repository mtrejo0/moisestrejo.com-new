'use client'

import { useState, useEffect, Suspense } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { useInView } from 'react-intersection-observer'
import ProjectLikes from './ProjectLikes'

export default function AppListDisplay({ apps, displayApp, subRoute }) {
  const { id } = useParams()
  const router = useRouter()

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AppListDisplayContent apps={apps} displayApp={displayApp} subRoute={subRoute} id={id} router={router} />
    </Suspense>
  )
}

function AppListDisplayContent({ apps, displayApp, subRoute, id, router }) {
  const searchParams = useSearchParams()
  const [activeApp, setActiveApp] = useState(null)

  useEffect(() => {
    const queryId = searchParams.get('id')
    const initialApp = apps.find(app => app.id === (queryId || id)) || apps[0]
    setActiveApp(initialApp)
  }, [apps, id, searchParams])

  if (!activeApp) return null

  return (
    <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {activeApp && <LazyLoadedApp key={activeApp.id} app={activeApp} displayApp={displayApp} />}
        {apps.filter(app => app.id !== activeApp?.id).map((app) => (
          <LazyLoadedApp key={app.id} app={app} displayApp={displayApp} />
        ))}
      </div>
    </div>
  )
}

function LazyLoadedApp({ app, displayApp }) {
  const { ref, inView } = useInView({
    triggerOnce: true,
    rootMargin: '200px 0px',
  })

  return (
    <div ref={ref} className="bg-white p-3 sm:p-6 rounded-lg relative">
      {inView ? (
        <>
          <div className="absolute top-8 right-8 z-10">
            <ProjectLikes projectId={app.id} />
          </div>
          {displayApp(app)}
        </>
      ) : (
        <div style={{ height: '600px' }} />
      )}
    </div>
  )
}