'use client'

import { useState, useEffect, Suspense } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { useInView } from 'react-intersection-observer'
import ProjectLikes from './ProjectLikes'
import { Shuffle } from 'lucide-react'

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
  const [sortedApps, setSortedApps] = useState([])
  const [appLikes, setAppLikes] = useState({})

  useEffect(() => {
    const fetchLikesAndSortApps = async () => {
      try {
        const response = await fetch('/api/like/all');
        const data = await response.json();
        const projectsWithLikes = data.projects;

        const likesMap = projectsWithLikes.reduce((acc, project) => {
          acc[project.id] = project.likeCount;
          return acc;
        }, {});

        setAppLikes(likesMap);

        const sortedApps = apps.sort((a, b) => {
          const aLikes = likesMap[a.id] || 0;
          const bLikes = likesMap[b.id] || 0;
          return bLikes - aLikes;
        });

        setSortedApps(sortedApps);

        const queryId = searchParams.get('id')
        if (queryId) {
          const initialApp = sortedApps.find(app => app.id === (queryId || id)) || sortedApps[0]
          setActiveApp(initialApp)
        }
        
      } catch (error) {
        console.error('Error fetching likes:', error);
        setSortedApps(apps);
      }
    };

    fetchLikesAndSortApps();
    console.log("ok")
  }, [apps, id, searchParams])

  const shuffleApps = () => {
    const shuffled = [...sortedApps].sort(() => Math.random() - 0.5);
    setSortedApps(shuffled);
  }

  return (
    <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
      <div className="fixed bottom-4 right-4 z-50">
        <button 
          onClick={shuffleApps}
          className="w-12 h-12 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors duration-300 shadow-lg flex items-center justify-center"
        >
          <Shuffle className="w-6 h-6" />
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {activeApp && <LazyLoadedApp key={activeApp.id} app={activeApp} displayApp={displayApp} likeCount={appLikes[activeApp.id]} />}
        {sortedApps.filter(app => app.id !== activeApp?.id).map((app) => (
          <LazyLoadedApp key={app.id} app={app} displayApp={displayApp} likeCount={appLikes[app.id]} />
        ))}
      </div>
    </div>
  )
}

function LazyLoadedApp({ app, displayApp, likeCount }) {
  const { ref, inView } = useInView({
    triggerOnce: true,
    rootMargin: '200px 0px',
  })

  return (
    <div ref={ref} className="bg-white p-3 sm:p-6 rounded-lg relative">
      {inView ? (
        <>
          <div className="absolute top-8 right-8 z-10">
            <ProjectLikes projectId={app.id} initialLikeCount={likeCount} />
          </div>
          {displayApp(app)}
        </>
      ) : (
        <div style={{ height: '600px' }} />
      )}
    </div>
  )
}