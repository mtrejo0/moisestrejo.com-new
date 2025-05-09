'use client'

import { ExternalLink } from 'lucide-react'
import internalApps from "../../public/information/internalApps.json"
import AppListDisplay from '../components/AppListDisplay'
import dynamic from 'next/dynamic'

export const InternalApp = ({ app }) => {
  const AppComponent = dynamic(() => import(`../components/internalApps/${app.component}`), {
    loading: () => <p>Loading...</p>,
    ssr: false
  })

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden lg:min-h-[60vh]">
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
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
          <span className="text-sm text-gray-500">
              {new Date(app.date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </span>
        </div>
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
    return <InternalApp app={app} />
  }

  console.log(internalApps)

  console.log([...internalApps].reverse())

  return (
    <AppListDisplay
      apps={[...internalApps].reverse()}
      displayApp={displayApp}
      subRoute="portfolio"
    />
  )
}

export default Portfolio