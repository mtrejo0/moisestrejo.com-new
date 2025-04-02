import djLinks from '../../../public/information/djLinks.json'
import { notFound, redirect } from 'next/navigation'

interface PageProps {
  params: {
    id: string
  }
}

export default function DJPage({ params }: PageProps) {
  const { id } = params
  const mix = djLinks[id as keyof typeof djLinks]

  if (!mix) {
    notFound()
  }

  redirect(mix.link)
} 