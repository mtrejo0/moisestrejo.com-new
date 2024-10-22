'use client'

import { useState } from 'react'
import artList from "../../public/information/art.json"
import AppListDisplay from '../components/AppListDisplay'
import Image from 'next/image'

const ArtDisplay = ({ app }) => {
  const [name, date] = app.name.split(', ')
  
  return (
    <div className="bg-white rounded-lg shadow-xl overflow-hidden transition-all duration-300">
      <div className="p-6">
        <div className="flex flex-col mb-4">
          <h2 className="text-2xl font-bold text-gray-800">
            {name}
          </h2>
          <p className="text-sm text-gray-500">{date}</p>
        </div>
        <div className="relative transition-all duration-300 h-[400px] sm:h-[600px]">
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
