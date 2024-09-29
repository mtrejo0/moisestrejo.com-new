'use client'

import { useState } from 'react'
import { ExternalLink, Maximize2, Minimize2 } from 'lucide-react'
import artList from "../../public/information/art.json"
import AppListDisplay from '../components/AppListDisplay'
import Image from 'next/image'

const ArtDisplay = ({ app }) => {
  const [isFullscreen, setIsFullscreen] = useState(false)

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">
            {app.name}
          </h2>
          <button
            onClick={toggleFullscreen}
            className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
            aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
          >
            {isFullscreen ? <Minimize2 className="h-6 w-6" /> : <Maximize2 className="h-6 w-6" />}
          </button>
        </div>
        <div className={`relative transition-all duration-300 ${isFullscreen ? 'h-[calc(100vh-200px)]' : 'h-[600px]'}`}>
          <Image
            src={`/images/art/${app.id}`}
            alt={app.name}
            layout="fill"
            objectFit="contain"
            className="rounded-lg"
          />
        </div>
      </div>
    </div>
  )
}

const Art = () => {
  const displayApp = (app) => <ArtDisplay app={app} />

  return (
    <AppListDisplay
      apps={artList}
      displayApp={displayApp}
      subRoute="art"
    />
  )
}

export default Art
