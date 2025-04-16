"use client";

import { useState, useEffect, useRef } from "react";
import { ExternalLink, Play, Loader2 } from "lucide-react";
import p5jsProjects from "../../public/information/p5jsProjects.json";
import AppListDisplay from "../components/AppListDisplay";

const P5App = ({ app }) => {
  const [showVideo, setShowVideo] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const iframeRef = useRef(null);

  const link = `http://18.119.17.181:8000/${app.id}`;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      {
        threshold: 0.1
      }
    );

    if (iframeRef.current) {
      observer.observe(iframeRef.current);
    }

    return () => {
      if (iframeRef.current) {
        observer.unobserve(iframeRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isVisible) {
      setIsLoading(true);
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [isVisible, app.id]);

  return (
    <div
      className={`bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300`}
    >
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">
            <a
              href={link}
              target="_blank"
              rel="noreferrer"
              className="hover:text-blue-600 transition-colors duration-200 flex items-center"
            >
              {app.name}
              <ExternalLink className="ml-2 h-5 w-5" />
            </a>
          </h2>
        </div>
        {app.description.map((desc, index) => (
          <p key={index} className="text-gray-600 mb-2">
            {desc}
          </p>
        ))}

        {app.youtubeLink && (
          <button
            onClick={() => setShowVideo(!showVideo)}
            className="bg-red-600 text-white px-4 py-2 rounded-md flex items-center hover:bg-red-700 transition-colors duration-200 mt-4"
          >
            <Play className="mr-2 h-5 w-5" />
            {showVideo ? "Hide" : "Watch"} Video
          </button>
        )}
      </div>

      {showVideo && app.youtubeLink && (
        <div className="aspect-w-16 aspect-h-9 mb-4 px-6">
          <iframe
            src={app.youtubeLink}
            allow="autoplay; encrypted-media"
            allowFullScreen
            title={app.name}
            className="w-full h-full rounded-lg"
          />
        </div>
      )}

      <div 
        ref={iframeRef}
        className={`transition-all duration-300 h-[400px] sm:h-[600px]`}
      >
        {isLoading && isVisible ? (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          </div>
        ) : isVisible ? (
          <iframe
            src={`http://18.119.17.181:8000/${app.id}`}
            title={app.id}
            className="w-full h-full border-t border-gray-200"
            onLoad={() => setIsLoading(false)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <p className="text-gray-500">Scroll to view</p>
          </div>
        )}
      </div>
    </div>
  );
};

const P5Art = () => {
  const displayApp = (app) => <P5App app={app} />;

  return (
    <AppListDisplay
      apps={p5jsProjects}
      displayApp={displayApp}
      subRoute="p5art"
    />
  );
};

export default P5Art;
