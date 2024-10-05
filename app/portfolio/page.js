'use client'

import { useState, useEffect } from 'react'
import { ExternalLink, Maximize2, Minimize2, Loader2 } from 'lucide-react'
import externalApps from "../../public/information/externalApps.json"
import internalApps from "../../public/information/internalApps.json"
import AppListDisplay from '../components/AppListDisplay'
import RandomNumbers from '../components/internalApps/RandomNumbers'
import WordFrequency from '../components/internalApps/WordFrequency'
import WordFinderGenerator from '../components/internalApps/WordFinderGenerator'

const ExternalApp = ({ app }) => {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const keywords = ["cloud", "youtube", "github.com"]
  const includesKeyword = keywords.some((keyword) => app.link.includes(keyword))

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  useEffect(() => {
    setIsLoading(true)
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [app.id])

  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden transition-all lg:min-h-[60vh] duration-300 ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">
            <a 
              href={app.link} 
              target="_blank" 
              rel="noreferrer" 
              className="hover:text-blue-600 transition-colors duration-200 flex items-center"
            >
              {app.name}
              <ExternalLink className="ml-2 h-5 w-5" />
            </a>
          </h2>
          {!includesKeyword && !app.hide && (
            <button
              onClick={toggleFullscreen}
              className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
              aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
            >
              {isFullscreen ? <Minimize2 className="h-6 w-6" /> : <Maximize2 className="h-6 w-6" />}
            </button>
          )}
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
        <div className={`transition-all duration-300 ${isFullscreen ? 'h-[calc(100vh-200px)]' : 'h-[600px] lg:h-[1200px]'}`}>
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
    </div>
  )
}

const InternalApp = ({ app }) => {
  const componentMap = {
    RandomNumbers: RandomNumbers,
    WordFrequency: WordFrequency,
    WordFinderGenerator: WordFinderGenerator
  }

  const AppComponent = componentMap[app.component]

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden lg:min-h-[60vh]">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">{app.name}</h2>
        <p className="text-gray-600 mb-4">{app.description}</p>
        {app.date && <p className="text-sm text-gray-500 mb-4">{app.date}</p>}
        {AppComponent && <AppComponent />}
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