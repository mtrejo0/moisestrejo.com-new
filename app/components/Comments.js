"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { motion, AnimatePresence } from "framer-motion"
import { MessageSquare, Heart, Send, Loader, User } from "lucide-react"

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

    if (!comment.trim()) {
      setError("Comment text is required")
      return
    }

    setIsSubmitting(true)
    setError("")

    try {
      const response = await axios.post("/api/comment", {
        name: name.trim() || "Anonymous",
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
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
        <h2 className="text-2xl font-bold flex items-center">
          <MessageSquare className="mr-2" /> Community Comments
        </h2>
        <p className="text-blue-100">Join the conversation and share your thoughts</p>
      </div>

      <div className="p-6">
        {/* Success Message */}
        <AnimatePresence>
          {showSuccessMessage && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg"
            >
              <div className="flex items-center">
                <svg className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Comment posted successfully!</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Comment Form */}
        <form onSubmit={handleSubmit} className="mb-8 space-y-4">
          <div className="flex flex-col gap-4">
            <div className="w-full">
              <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">
                Your Comment
              </label>
              <div className="relative">
                <textarea
                  id="comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share your thoughts..."
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  required
                />
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User size={18} className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Anonymous"
                    className="pl-10 w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-md hover:from-blue-700 hover:to-purple-700 transition-all flex items-center space-x-2 disabled:opacity-70"
              >
                {isSubmitting ? (
                  <>
                    <Loader size={18} className="animate-spin" />
                    <span>Posting...</span>
                  </>
                ) : (
                  <>
                    <Send size={18} />
                    <span>Post Comment</span>
                  </>
                )}
              </motion.button>
            </div>
          </div>

          {error && (
            <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-red-500 text-sm">
              {error}
            </motion.p>
          )}
        </form>

        {/* Comments List */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-700 flex items-center">
            <MessageSquare size={18} className="mr-2" />
            {comments.length} {comments.length === 1 ? "Comment" : "Comments"}
          </h3>

          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <Loader size={24} className="animate-spin text-blue-600" />
              <span className="ml-2 text-gray-600">Loading comments...</span>
            </div>
          ) : comments.length === 0 ? (
            <div className="bg-gray-50 rounded-lg p-8 text-center">
              <MessageSquare size={40} className="mx-auto text-gray-400 mb-2" />
              <p className="text-gray-600">No comments yet. Be the first to comment!</p>
            </div>
          ) : (
            <div className="max-h-[500px] overflow-y-auto pr-2 space-y-4">
              {comments.map((comment, index) => (
                <motion.div
                  key={comment._id || index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.3 }}
                  className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mr-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 flex items-center justify-center text-blue-600 font-semibold">
                        {comment.name ? comment.name.charAt(0).toUpperCase() : "A"}
                      </div>
                    </div>
                    <div className="flex-grow">
                      <div className="flex justify-between items-center">
                        <h4 className="font-semibold text-gray-800">{comment.name}</h4>
                        <span className="text-xs text-gray-500">
                          {new Date(comment.timestamp).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                      <p className="mt-1 text-gray-700">{comment.comment}</p>
                      <div className="mt-2 flex justify-end">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleLike(comment._id)}
                          className="flex items-center space-x-1 text-gray-500 hover:text-red-500 transition-colors"
                        >
                          <Heart size={16} className={`${comment.likes > 0 ? "fill-red-500 text-red-500" : ""}`} />
                          <span>{comment.likes || 0}</span>
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Comments
