'use client'

import { ExternalLink } from 'lucide-react'
import externalApps from "../../public/information/externalApps.json"

const ExternalApp = ({ app }) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6">
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
        <span className="text-sm text-gray-500">
          {new Date(app.date).toLocaleDateString('en-US', {
            month: 'long',
            year: 'numeric',
            day: new Date(app.date).getDate() !== 0 ? 'numeric' : undefined
          })}
        </span>
      </div>
      <p className="text-gray-600 mb-2">{app.description}</p>
      <p className="text-sm text-gray-500">{app.resources}</p>
      {app.product_hunt && (
        <a
          href={app.product_hunt}
          target="_blank" 
          rel="noreferrer"
          className="mt-2 text-orange-500 hover:text-orange-700 underline transition-colors duration-200 flex items-center text-sm font-medium"
        >
          Product Hunt
          <ExternalLink className="ml-1 h-4 w-4" />
        </a>
      )}
    </div>
  )
}

const Apps = () => {
  const sortedExternalApps = externalApps.sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Products</h1>
      <div className="space-y-6">
        {sortedExternalApps.map((app, index) => (
          <ExternalApp key={index} app={app} />
        ))}
      </div>
    </div>
  )
}

export default Apps