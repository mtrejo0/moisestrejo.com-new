"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { AnimatePresence, motion } from "framer-motion"
import { Heart, Loader } from "lucide-react"

const Comments = () => {
  const [comments, setComments] = useState([])
  const [name, setName] = useState("")
  const [comment, setComment] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)

  useEffect(() => {
    fetchComments()
  }, [])

  const fetchComments = async () => {
    try {
      const response = await axios.get("/api/comment")
      setComments(response.data)
    } catch (error) {
      console.error("Error fetching comments:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!name.trim()) {
      setError("Name is required")
      return
    }

    if (!comment.trim()) {
      setError("Comment text is required")
      return
    }

    setIsSubmitting(true)
    setError("")

    try {
      const response = await axios.post("/api/comment", {
        name: name.trim(),
        comment: comment.trim(),
      })

      if (response.status === 201) {
        setName("")
        setComment("")
        setError("")
        fetchComments()
        setShowSuccessMessage(true)
        setTimeout(() => setShowSuccessMessage(false), 3000)
      }
    } catch (error) {
      console.error("Error posting comment:", error)
      setError("Failed to post comment. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleLike = async (id) => {
    // Optimistically update the like count
    setComments((prevComments) => prevComments.map((c) => (c._id === id ? { ...c, likes: (c.likes || 0) + 1 } : c)))

    try {
      await axios.put(`/api/comment/like/${id}`)
    } catch (error) {
      console.error("Error liking comment:", error)
      // Revert the optimistic update on error
      setComments((prevComments) => prevComments.map((c) => (c._id === id ? { ...c, likes: (c.likes || 0) - 1 } : c)))
    }
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900">Comments</h2>
      </div>

      <div className="p-6">
        {/* Success Message */}
        <AnimatePresence>
          {showSuccessMessage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mb-4 text-sm text-gray-600"
            >
              Comment posted
            </motion.div>
          )}
        </AnimatePresence>

        {/* Comment Form */}
        <form onSubmit={handleSubmit} className="mb-8 space-y-3">
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-gray-400 text-sm"
            required
          />
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Add a comment..."
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:border-gray-400 resize-none"
            rows={3}
            required
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors text-sm disabled:opacity-50"
          >
            {isSubmitting ? "Posting..." : "Post"}
          </button>

          {error && (
            <p className="text-red-600 text-sm">{error}</p>
          )}
        </form>

        {/* Comments List */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <Loader size={20} className="animate-spin text-gray-400" />
            </div>
          ) : comments.length === 0 ? (
            <p className="text-gray-500 text-sm text-center py-8">No comments yet</p>
          ) : (
            <div className="space-y-4">
              {comments.map((comment) => (
                <div
                  key={comment._id}
                  className="border-b border-gray-200 pb-4 last:border-0 last:pb-0"
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-sm font-medium text-gray-900">{comment.name}</span>
                    <span className="text-xs text-gray-500">
                      {new Date(comment.timestamp).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 mb-2">{comment.comment}</p>
                  <button
                    onClick={() => handleLike(comment._id)}
                    className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700"
                  >
                    <Heart size={14} className={comment.likes > 0 ? "fill-red-500 text-red-500" : ""} />
                    <span>{comment.likes || 0}</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Comments
