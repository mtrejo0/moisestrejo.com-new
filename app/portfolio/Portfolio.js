'use client'

import { useState, useEffect } from 'react'
import { ExternalLink, Loader2 } from 'lucide-react'
import externalApps from "../../public/information/externalApps.json"
import internalApps from "../../public/information/internalApps.json"
import AppListDisplay from '../components/AppListDisplay'
import dynamic from 'next/dynamic'
import Link from 'next/link'


const ExternalApp = ({ app }) => {
  const [isLoading, setIsLoading] = useState(true)

  const keywords = ["cloud", "youtube", "github.com"]
  const includesKeyword = keywords.some((keyword) => app.link.includes(keyword))

  useEffect(() => {
    setIsLoading(true)
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [app.id])

  return (
    <div className={`bg-white rounded-xl shadow-md overflow-hidden transition-all lg:min-h-[60vh] duration-300`}>
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">
            <a 
              href={app.link} 
              target="_blank" 
              rel="noreferrer" 
              className="text-blue-600 hover:text-blue-800 underline transition-colors duration-200 flex items-center"
            >
              {app.name}
              <ExternalLink className="ml-2 h-5 w-5" />
            </a>
          </h2>
        </div>
        <p className="text-gray-600 mb-2">{app.description}</p>
        <p className="text-sm text-gray-500 mb-4">{app.resources}</p>
        {app.date && <p className="text-sm text-gray-500 mb-4">{app.date}</p>}
      </div>
      
      {app.video && (
        <div className="aspect-w-16 aspect-h-9 mb-4 px-6 lg:aspect-h-18">
          <iframe
            src={`https://www.youtube.com/embed/${app.video}`}
            allow="autoplay; encrypted-media"
            allowFullScreen
            title={app.name}
            className="w-full h-full rounded-lg lg:h-96"
          />
        </div>
      )}
      
      {!includesKeyword && !app.hide && (
        <div className={`transition-all duration-300 h-[400px] sm:h-[600px]`}>
          <div className={`w-full h-full flex items-center justify-center bg-gray-100 ${isLoading ? 'block' : 'hidden'}`}>
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          </div>
          <div className={`w-full h-full ${isLoading ? 'hidden' : 'block'}`}>
            <iframe
              src={app.link}
              title={app.id}
              className="w-full h-full border-t border-gray-200"
            />
          </div>
        </div>
      )}
      {app.hide && (
        <a 
          href={app.link}
          target="_blank"
          rel="noreferrer"
          className="block text-center text-blue-600 hover:text-blue-800 underline mt-4"
        >
          Click here to see this app!
        </a>
      )}
    </div>
  )
}

export const InternalApp = ({ app }) => {
  const AppComponent = dynamic(() => import(`../components/internalApps/${app.component}`), {
    loading: () => <p>Loading...</p>,
    ssr: false
  })

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden lg:min-h-[60vh]">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center justify-between">
          <a 
            href={`/${app.id}`}
            target="_blank" 
            rel="noreferrer" 
            className="text-blue-600 hover:text-blue-800 underline transition-colors duration-200 flex items-center"
          >
            {app.name}
            <ExternalLink className="ml-2 h-5 w-5" />
          </a>
        </h2>
        <p className="text-gray-600 mb-4">{app.description}</p>
        {app.date && <p className="text-sm text-gray-500 mb-4">{app.date}</p>}
        <div className='h-[600px]'>
          <AppComponent />
        </div>
      </div>
    </div>
  )
}

const Portfolio = () => {
  const displayApp = (app) => {
    if (app.type === 'internal') {
      return <InternalApp app={app} />
    } else {
      return <ExternalApp app={app} />
    }
  }

  const sortedExternalApps = externalApps.sort((a, b) => new Date(b.date) - new Date(a.date));
  const allApps = [...sortedExternalApps, ...internalApps];

  return (
    <AppListDisplay
      apps={allApps}
      displayApp={displayApp}
      subRoute="portfolio"
    />
  )
}

export default Portfolio