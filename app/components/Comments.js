'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'

const Comments = () => {
  const [comments, setComments] = useState([])
  const [name, setName] = useState('')
  const [comment, setComment] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    fetchComments()
  }, [])

  const fetchComments = async () => {
    try {
      const response = await axios.get('/api/comment')
      setComments(response.data)
    } catch (error) {
      console.error('Error fetching comments:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!comment.trim()) {
      setError('Comment text is required')
      return
    }

    try {
      const response = await axios.post('/api/comment', {
        name: name.trim() || 'Anonymous',
        comment: comment.trim()
      })

      if (response.status === 201) {
        setName('')
        setComment('')
        setError('')
        fetchComments()
      }
    } catch (error) {
      console.error('Error posting comment:', error)
    }
  }

  const handleLike = async (id) => {
    // Optimistically update the like count
    setComments(prevComments => 
      prevComments.map(c => 
        c._id === id ? {...c, likes: (c.likes || 0) + 1} : c
      )
    )

    try {
      await axios.put(`/api/comment/like/${id}`)
    } catch (error) {
      console.error('Error liking comment:', error)
      // Revert the optimistic update on error
      setComments(prevComments =>
        prevComments.map(c =>
          c._id === id ? {...c, likes: (c.likes || 0) - 1} : c
        )
      )
    }
  }

  return (
    <div className="space-y-6 bg-white p-6 rounded-lg">
      <h2 className="text-2xl font-semibold mb-4 text-center">Sign my guestbook!</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name (optional)"
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Write a comment..."
            className="w-full p-2 border rounded"
            rows={3}
            required
          />
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Post Comment
        </button>
      </form>

      <div className="space-y-4 max-h-[calc(3*120px)] overflow-y-auto">
        {comments.map((comment, index) => (
          <div key={index} className="p-4 border rounded">
            <div className="font-semibold">{comment.name}</div>
            <div className="mt-1">{comment.comment}</div>
            <div className="flex justify-between items-center text-sm text-gray-500 mt-2">
              <span>{new Date(comment.timestamp).toLocaleString()}</span>
              <button 
                onClick={() => handleLike(comment._id)}
                className="flex items-center space-x-1 text-blue-500 hover:text-blue-600"
              >
                <span>❤️</span>
                <span>{comment.likes || 0}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Comments
