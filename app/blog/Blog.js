"use client";

import React, { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

const Blog = () => {
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBlogPosts = async () => {
      try {
        const response = await fetch('/information/blog/backpain.html');
        const content = await response.text();
        setBlogPosts([{filename: 'backpain.html', content}]);
        setLoading(false);
      } catch (error) {
        console.error('Error loading blog post:', error);
        setLoading(false);
      }
    };

    loadBlogPosts();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center mt-16">
      {blogPosts.map((post, index) => (
        <div
          key={index}
          className="w-full max-w-[90%] sm:max-w-[50%] mx-auto mb-6 bg-white rounded-lg shadow-md overflow-hidden"
        >
          <div className="p-4 sm:p-6">
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default Blog;
