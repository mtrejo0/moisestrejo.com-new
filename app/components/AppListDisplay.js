"use client";

import { useState, useEffect, Suspense } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useInView } from "react-intersection-observer";
// import ProjectLikes from "./ProjectLikes";  // Comment out import
import { Shuffle, Search, ChevronDown } from "lucide-react";

export default function AppListDisplay({ apps, displayApp, subRoute }) {
  const { id } = useParams();
  const router = useRouter();

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AppListDisplayContent
        apps={apps}
        displayApp={displayApp}
        subRoute={subRoute}
        id={id}
        router={router}
      />
    </Suspense>
  );
}

function AppListDisplayContent({ apps, displayApp, subRoute, id, router }) {
  const searchParams = useSearchParams();
  const [activeApp, setActiveApp] = useState(null);
  const [sortedApps, setSortedApps] = useState([]);
  // const [appLikes, setAppLikes] = useState({});  // Comment out state
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredApps, setFilteredApps] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, []);

  useEffect(() => {
    const fetchLikesAndSortApps = async () => {
      try {
        // Comment out likes fetching
        // const response = await fetch("/api/like/all");
        // const data = await response.json();
        // const projectsWithLikes = data.projects;

        // const likesMap = projectsWithLikes.reduce((acc, project) => {
        //   acc[project.id] = project.likeCount;
        //   return acc;
        // }, {});

        // setAppLikes(likesMap);

        // const sortedApps = apps.sort((a, b) => {
        //   const aLikes = likesMap[a.id] || 0;
        //   const bLikes = likesMap[b.id] || 0;
        //   return bLikes - aLikes;
        // });

        setSortedApps(apps);
        setFilteredApps(apps);

        const queryId = searchParams.get("id");
        if (queryId) {
          const initialApp =
            apps.find((app) => app.id === (queryId || id)) ||
            apps[0];
          setActiveApp(initialApp);
        }
      } catch (error) {
        console.error("Error:", error);
        setSortedApps(apps);
        setFilteredApps(apps);
      }
    };

    fetchLikesAndSortApps();
  }, [apps, id, searchParams]);

  useEffect(() => {
    const filtered = sortedApps.filter((app) =>
      app.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );
    setFilteredApps(filtered);
  }, [searchTerm, sortedApps]);

  const shuffleApps = () => {
    const shuffled = [...filteredApps].sort(() => Math.random() - 0.5);
    setFilteredApps(shuffled);
  };

  const handleAppSelect = (app) => {
    setActiveApp(app);
    setSearchTerm(app.name);
    setIsDropdownOpen(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
        <div className="ml-4 text-xl font-semibold text-gray-700">
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
      <div className="mb-4 relative">
        <div className="relative">
          <input
            type="text"
            placeholder="Search apps..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setIsDropdownOpen(true);
            }}
            onFocus={() => setIsDropdownOpen(true)}
            className="w-full p-2 pl-10 pr-10 border border-gray-300 rounded-md"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <ChevronDown
            className={`absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          />
        </div>
        {isDropdownOpen && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
            {filteredApps.map((app) => (
              <div
                key={app.id}
                className="p-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleAppSelect(app)}
              >
                {app.name}
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={shuffleApps}
          className="w-12 h-12 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors duration-300 shadow-lg flex items-center justify-center"
        >
          <Shuffle className="w-6 h-6" />
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {activeApp && (
          <LazyLoadedApp
            key={activeApp.id}
            app={activeApp}
            displayApp={displayApp}
            // likeCount={appLikes[activeApp.id]}  // Comment out prop
          />
        )}
        {filteredApps
          .filter((app) => app.id !== activeApp?.id)
          .map((app) => (
            <LazyLoadedApp
              key={app.id}
              app={app}
              displayApp={displayApp}
              // likeCount={appLikes[app.id]}  // Comment out prop
            />
          ))}
      </div>
    </div>
  );
}

function LazyLoadedApp({ app, displayApp }) {  // Remove likeCount from props
  const { ref, inView } = useInView({
    triggerOnce: true,
    rootMargin: "200px 0px",
  });

  return (
    <div ref={ref} className="bg-white p-3 sm:p-6 rounded-lg relative">
      {inView ? (
        <>
          {/* Comment out the likes display */}
          {/* <div className="absolute top-8 right-8 z-2">
            <ProjectLikes projectId={app.id} initialLikeCount={likeCount} />
          </div> */}
          {displayApp(app)}
        </>
      ) : (
        <div style={{ height: "600px" }} />
      )}
    </div>
  );
}
