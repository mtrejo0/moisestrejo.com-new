'use client'

import { useState, useEffect } from 'react'
import { ExternalLink, Play, Maximize2, Minimize2, Loader2 } from 'lucide-react'
import p5jsProjects from "../../public/information/p5jsProjects.json"
import AppListDisplay from '../components/AppListDisplay'

const P5App = ({ app }) => {
  const [showVideo, setShowVideo] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const link = `https://moisestrejo.com/${app.id}`

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  useEffect(() => {
    setIsLoading(true)
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [app.id])

  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">
            <a 
              href={link} 
              target="_blank" 
              rel="noreferrer" 
              className="hover:text-blue-600 transition-colors duration-200 flex items-center"
            >
              {app.name}
              <ExternalLink className="ml-2 h-5 w-5" />
            </a>
          </h2>
          <button
            onClick={toggleFullscreen}
            className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
            aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
          >
            {isFullscreen ? <Minimize2 className="h-6 w-6" /> : <Maximize2 className="h-6 w-6" />}
          </button>
        </div>
        {app.description.map((desc, index) => (
          <p key={index} className="text-gray-600 mb-2">{desc}</p>
        ))}
        
        {app.youtubeLink && (
          <button
            onClick={() => setShowVideo(!showVideo)}
            className="bg-red-600 text-white px-4 py-2 rounded-md flex items-center hover:bg-red-700 transition-colors duration-200 mt-4"
          >
            <Play className="mr-2 h-5 w-5" />
            {showVideo ? 'Hide' : 'Watch'} Video
          </button>
        )}
      </div>
      
      {showVideo && app.youtubeLink && (
        <div className="aspect-w-16 aspect-h-9 mb-4 px-6">
          <iframe
            src={app.youtubeLink}
            allow="autoplay; encrypted-media"
            allowFullScreen
            title={app.name}
            className="w-full h-full rounded-lg"
          />
        </div>
      )}
      
      <div className={`transition-all duration-300 ${isFullscreen ? 'h-[calc(100vh-200px)]' : 'h-[600px]'}`}>
        {isLoading ? (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          </div>
        ) : (
          <iframe
            src={`https://p5moises-27cba0c96786.herokuapp.com/${app.id}`}
            title={app.id}
            className="w-full h-full border-t border-gray-200"
          />
        )}
      </div>
    </div>
  )
}

const P5Art = () => {
  const displayApp = (app) => <P5App app={app} />

  return (
    <AppListDisplay
      apps={p5jsProjects}
      displayApp={displayApp}
      subRoute="p5art"
    />
  )
}

export default P5Art
