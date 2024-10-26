'use client'

import { useParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'

import internalApps from '../../../public/information/internalApps.json'
import NotFound404 from "../../components/NotFound404.js"

export default function DynamicPage() {
  const { id } = useParams()
  const [Component, setComponent] = useState(null)

  useEffect(() => {
    const internalApp = internalApps.find(app => app.id === id)
    if (internalApp) {
      const DynamicComponent = dynamic(() => import(`../../components/internalApps/${internalApp.component}.jsx`))
      setComponent(() => DynamicComponent)
    }
  }, [id])

  if (Component) {
    return <Component />
  }

  return <NotFound404 />
}
