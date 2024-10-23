'use client'

import { useState, useEffect } from 'react'
import { FaThumbsUp } from 'react-icons/fa'

const ProjectLikes = ({ projectId, initialLikeCount }) => {
  const [likeCount, setLikeCount] = useState(initialLikeCount || 0)
  const [isLiked, setIsLiked] = useState(false)

  useEffect(() => {
    const fetchLikeCount = async () => {
      if (initialLikeCount === undefined) {
        try {
          const response = await fetch(`/api/like/${projectId}`)
          if (response.ok) {
            const data = await response.json()
            setLikeCount(data.count)
          }
        } catch (error) {
          console.error('Error fetching like count:', error)
        }
      }
    }

    fetchLikeCount()
  }, [projectId, initialLikeCount])

  const handleLike = async () => {
    if (isLiked) return

    try {
      const response = await fetch(`/api/like/${projectId}`, { method: 'POST' })
      if (response.ok) {
        const data = await response.json()
        setLikeCount(data.count)
        setIsLiked(true)
      }
    } catch (error) {
      console.error('Error updating like count:', error)
    }
  }

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={handleLike}
        className={`p-2 rounded-full ${isLiked ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'}`}
        disabled={isLiked}
      >
        <FaThumbsUp />
      </button>
      <span className="font-semibold">{likeCount}</span>
    </div>
  )
}

export default ProjectLikes
