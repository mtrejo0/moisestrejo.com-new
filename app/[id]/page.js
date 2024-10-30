'use client'

import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

import p5jsProjects from '../../public/information/p5jsProjects.json'
import links from '../../public/information/links.json'
import externalApps from '../../public/information/externalApps.json'
import internalApps from '../../public/information/internalApps.json'
import NotFound404 from "../components/NotFound404.js"
import dynamic from 'next/dynamic'

export default function DynamicPage() {
  const { id } = useParams()
  const router = useRouter()
  const [Component, setComponent] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setTimeout(() => {
      setLoading(false)
    }, 500)

    if (id === 'home') {
      router.push('/')
      return
    }

    const link = links.find(link => link.ids.includes(id))
    if (link) {
      router.push(link.link)
      return
    }

    const p5Project = p5jsProjects.find(project => project.id === id)
    if (p5Project) {
      router.push(`https://p5moises-27cba0c96786.herokuapp.com/${p5Project.id}`)
      return
    }

    const externalApp = externalApps.find(app => app.id === id)
    if (externalApp) {
      router.push(externalApp.link)
      return
    }

    const internalApp = internalApps.find(app => app.id === id)
    if (internalApp) {
      const DynamicComponent = dynamic(() => import(`../components/internalApps/${internalApp.component}.jsx`))
      setComponent(() => DynamicComponent)
      return
    }

    if (id === 'college') {
      router.push('https://medium.com/@moises.trejo0/how-to-apply-to-college-b9084219ffc1')
      return
    }

  }, [id, router])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
        <div className="ml-4 text-xl font-semibold text-gray-700">Loading...</div>
      </div>
    )
  }

  if (Component) {
    return <Component />
  }

  return <NotFound404/>
}
