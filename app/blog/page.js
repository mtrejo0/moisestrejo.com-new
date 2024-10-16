'use client'

import React, { useEffect, useState } from "react";
import { ExternalLink } from 'lucide-react';

const Blog = () => {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    fetch(
      "https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@moises.trejo0"
    )
      .then((res) => res.json())
      .then((data) => setArticles(data.items));
  }, []);

  return (
    <div className="flex flex-col items-center mt-16">
      {articles.map((article, index) => (
        <div
          key={index}
          className="w-full max-w-[90%] sm:max-w-[50%] mx-auto mb-6 bg-white rounded-lg shadow-md overflow-hidden"
        >
          <div className="p-4 sm:p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">{article.title}</h2>
            <p className="text-sm text-gray-500 mb-4">
              Published: {new Date(article.pubDate).toLocaleDateString()}
            </p>
            <a
              href={article.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 transition-colors duration-200 flex items-center"
            >
              Read More
              <ExternalLink className="ml-2 h-5 w-5" />
            </a>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Blog;
