'use client'

import { useParams, useRouter } from 'next/navigation'
import { useEffect } from 'react'

import p5jsProjects from '../../public/information/p5jsProjects.json'
import links from '../../public/information/links.json'
import externalApps from '../../public/information/externalApps.json'

export default function DynamicPage() {
  const { id } = useParams()
  const router = useRouter()

  useEffect(() => {
    if (id === 'home') {
      router.push('/about')
      return
    }

    const link = links.find(link => link.ids.includes(id))
    if (link) {
      window.location.href = link.link
      return
    }

    const p5Project = p5jsProjects.find(project => project.id === id)
    if (p5Project) {
      window.location.href = `https://p5moises-27cba0c96786.herokuapp.com/${id}`
      return
    }

    const externalApp = externalApps.find(app => app.id === id)
    if (externalApp) {
      window.location.href = externalApp.link
      return
    }

    if (id === 'college') {
      window.location.href = 'https://medium.com/@moises.trejo0/how-to-apply-to-college-b9084219ffc1'
      return
    }
  }, [id, router])

  return <></>
}

