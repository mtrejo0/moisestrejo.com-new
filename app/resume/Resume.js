"use client";

import React, { useState, useEffect } from "react";
import ResumePlusPlus from "./resume++";
import { Download, Loader2 } from "lucide-react";

export default function Resume() {
  const [isIframeLoaded, setIsIframeLoaded] = useState(false);
  const [iframeError, setIframeError] = useState(false);
  const [activeTab, setActiveTab] = useState("preview");

  const id = "17BKQrfpLi5IcTNLteQFf-x9ryXTra822";
  const preview = `https://drive.google.com/file/d/${id}/preview`;
  const view = `https://drive.google.com/file/d/${id}/view`;

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isIframeLoaded) {
        setIframeError(true);
      }
    }, 10000); // 10 seconds timeout

    return () => clearTimeout(timer);
  }, [isIframeLoaded]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col items-center space-y-6">
        <div className="flex space-x-4">
          <a
            href={view}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            <Download className="mr-2 h-5 w-5" />
            Download Resume
          </a>
        </div>

        <div className="w-full max-w-3xl">
          <div className="flex mb-4 border-b">
            <button
              className={`px-4 py-2 ${
                activeTab === "preview"
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("preview")}
            >
              Preview
            </button>
            <button
              className={`px-4 py-2 ${
                activeTab === "interactive"
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("interactive")}
            >
              Interactive Version
            </button>
          </div>

          {activeTab === "preview" && (
            <div className="relative w-full" style={{ paddingTop: "141.4%" }}>
              {!isIframeLoaded && !iframeError && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                </div>
              )}
              {iframeError && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-red-500">
                  Failed to load resume preview. Please try again later.
                </div>
              )}
              <iframe
                title="resume"
                className={`absolute top-0 left-0 w-full h-full border-none ${isIframeLoaded ? "opacity-100" : "opacity-0"}`}
                src={preview}
                onLoad={() => setIsIframeLoaded(true)}
                onError={() => setIframeError(true)}
              />
            </div>
          )}

          {activeTab === "interactive" && (
            <div className="mt-8">
              <ResumePlusPlus />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
