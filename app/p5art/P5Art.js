'use client'

import { ExternalLink } from 'lucide-react'
import p5jsProjects from "../../public/information/p5jsProjects.json"
import { useEffect, useState } from 'react'

const P5App = ({ app }) => {
  const [link, setLink] = useState(`/${app.id}`)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setLink(`${window.location.origin}/${app.id}`)
    }
  }, [app.id])

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">
          <a 
            href={link}
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
            year: 'numeric'
          })}
        </span>
      </div>
      {app.description.map((desc, index) => (
        <p key={index} className="text-gray-600 mb-2">{desc}</p>
      ))}
    </div>
  )
}

const P5Art = () => {
  const sortedProjects = p5jsProjects.sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">P5.js Art</h1>
      <div className="space-y-6">
        {sortedProjects.map((app, index) => (
          <P5App key={index} app={app} />
        ))}
      </div>
    </div>
  )
}

export default P5Art
