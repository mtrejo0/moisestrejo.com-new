import { notFound, redirect } from 'next/navigation'
import { Metadata } from 'next'
import dynamic from 'next/dynamic'

import p5jsProjects from '../../public/information/p5jsProjects.json'
import links from '../../public/information/links.json'
import externalApps from '../../public/information/externalApps.json'
import internalApps from '../../public/information/internalApps.json'

// Generate static paths for all known routes
export async function generateStaticParams() {
  const allIds = [
    ...internalApps.map(app => ({ id: app.id })),
    ...externalApps.map(app => ({ id: app.id })),
    ...p5jsProjects.map(project => ({ id: project.id })),
    ...links.map(link => link.ids.map(id => ({ id }))).flat()
  ]
  return allIds
}

// Generate metadata for the page
export async function generateMetadata({ params }) {
  const { id } = params

  // Find matching app/project/link
  const internalApp = internalApps.find(app => app.id === id)
  const externalApp = externalApps.find(app => app.id === id)
  const p5Project = p5jsProjects.find(project => project.id === id)

  if (internalApp) {
    return {
      title: internalApp.name,
      description: internalApp.description,
      openGraph: {
        title: internalApp.name,
        description: internalApp.description
      }
    }
  }

  if (externalApp) {
    return {
      title: externalApp.name, 
      description: externalApp.description,
      openGraph: {
        title: externalApp.name,
        description: externalApp.description
      }
    }
  }

  if (p5Project) {
    return {
      title: p5Project.name,
      description: p5Project.description.join(' '),
      openGraph: {
        title: p5Project.name,
        description: p5Project.description.join(' ')
      }
    }
  }

  return {
    title: 'Not Found',
    description: 'The requested page could not be found'
  }
}

export default async function Page({ params }) {
  const { id } = params

  // Handle special cases first
  if (id === 'home') {
    redirect('/')
  }

  if (id === 'college') {
    redirect('https://medium.com/@moises.trejo0/how-to-apply-to-college-b9084219ffc1')
  }

  // Check for matching link
  const link = links.find(link => link.ids.includes(id))
  if (link) {
    redirect(link.link)
  }

  // Check for p5 project
  const p5Project = p5jsProjects.find(project => project.id === id)
  if (p5Project) {
    redirect(`https://p5moises-27cba0c96786.herokuapp.com/${p5Project.id}`)
  }

  // Check for external app
  const externalApp = externalApps.find(app => app.id === id)
  if (externalApp) {
    redirect(externalApp.link)
  }

  // Check for internal app
  const internalApp = internalApps.find(app => app.id === id)
  if (internalApp) {
    const DynamicComponent = dynamic(
      () => import(`../components/internalApps/${internalApp.component}.jsx`),
      { ssr: true }
    )
    return (
      <>
        <title>{internalApp.name}</title>
        <meta name="description" content={internalApp.description} />
        <meta property="og:title" content={internalApp.name} />
        <meta property="og:description" content={internalApp.description} />
        <DynamicComponent />
      </>
    )
  }

  // If no matches found, return 404
  notFound()
}
