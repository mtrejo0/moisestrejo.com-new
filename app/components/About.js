"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import axios from "axios"
import Comments from "./Comments"
import Link from "next/link"
import p5jsProjects from "../../public/information/p5jsProjects.json"
import internalApps from "../../public/information/internalApps.json"
import dynamic from "next/dynamic"
import { motion } from "framer-motion"
import ContactPageClient from "../contact/ContactPageClient"
import SpotifyPage from "../music/Spotify"
import artList from "../../public/information/art.json"
import { RefreshCw } from "lucide-react"

const About = () => {
  const [loading, setLoading] = useState(true)
  const [users, setUsers] = useState(0)
  const [randomP5Project, setRandomP5Project] = useState(null)
  const [randomInternalApp, setRandomInternalApp] = useState(null)
  const [isExploring, setIsExploring] = useState(false)
  const [workExperience, setWorkExperience] = useState([])
  const [articles, setArticles] = useState([])
  const [randomArt, setRandomArt] = useState(null)

  const AppComponent =
    randomInternalApp &&
    dynamic(() => import(`../components/internalApps/${randomInternalApp.component}`), {
      loading: () => (
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
        </div>
      ),
      ssr: false,
    })

    useEffect(() => {
        loadRandomContent()
    }, [])

    useEffect(() => {
      fetch(
        "https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@moises.trejo0",
      )
        .then((res) => res.json())
        .then((data) => {
          setArticles(data.items);
        })
        .catch((error) => {
          console.error("Error fetching Medium articles:", error);
        });
    }, []);
  
    const loadRandomContent = () => {
      // Get a random P5.js project
      const randomP5Index = Math.floor(Math.random() * p5jsProjects.length)
      const randomP5Project = p5jsProjects[randomP5Index]
      setRandomP5Project(randomP5Project)
  
      // Get a random internal app
      const randomInternalIndex = Math.floor(Math.random() * internalApps.length)
      const randomInternalApp = internalApps[randomInternalIndex]
      setRandomInternalApp(randomInternalApp)
  
      // Get a random art piece
      const randomArtIndex = Math.floor(Math.random() * artList.length)
      const randomArt = artList[randomArtIndex]
      setRandomArt(randomArt)
    }

  // Show a different random project/app when user clicks
  const refreshRandomContent = () => {
    setIsExploring(true)
    loadRandomContent()
    setTimeout(() => setIsExploring(false), 500)
  }

  const interests = [
    "Artificial Intelligence + Machine Learning 🤖",
    "Entrepreneurship 💼",
    "Content Creation 🎥",
    "Music Production 🎵",
    "Fitness + Nutrition 💪",
    // "Computer Science",
    // "Design",
    // "Making: 3D printing, laser cutting, embedded systems",
    // "Cooking",
    // "Art and its various forms: Painting, Digital Design",
    // "Sports: Kickboxing, Brazilian Jiu Jitsu, Basketball, Soccer",
    // "Dancing: Contemporary Dance, Salsa, Merengue, Cumbias, Breakdancing",
    // "Skateboarding",
    // "Philosophy, Ethics, Theology, Psychology",
    // "Anthropology",
    // "Natural Sciences: Mathematics, Chemistry, Biology, Physics",
    // "Music: Music Producing, DJing",
    // "Comedy",
    // "Video Editing",
    // "Literature",
    // "Urban Planning",
    // "the list goes on...",
  ]

  const whatIBuild = [
    "Health and wellness technology",
    "Applicant filtering web apps",
    "Music and rhyming tech",
    "Productivity tools",
    "Data visualization projects",
    "Social impact applications"
  ]

  useEffect(() => {
    axios
      .get(`https://2r2wddk4i6.execute-api.us-east-2.amazonaws.com/test`)
      .then((res) => {
        setLoading(false)
        setUsers(res.data.body.userCount)
      })
      .catch((err) => {
        console.error(err)
      })
  }, [])

  useEffect(() => {
    const fetchWorkExperience = async () => {
      try {
        const response = await fetch('/information/work.json')
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        setWorkExperience(data.slice(0, 3)) // Only show last 5 experiences
      } catch (error) {
        console.error('Error fetching work experience:', error)
      }
    }
    
    fetchWorkExperience()
  }, [])

  // Section divider component
  const SectionDivider = ({ title, icon, color = "from-blue-600 to-purple-600" }) => (
    <div className="flex items-center my-12">
      <div className={`h-0.5 flex-grow bg-gradient-to-r ${color}`}></div>
      <h2 className="mx-4 text-2xl font-bold flex items-center">
        <span className="mr-2">{icon}</span>
        {title}
      </h2>
      <div className={`h-0.5 flex-grow bg-gradient-to-r ${color}`}></div>
    </div>
  )

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row items-center justify-between gap-8 mb-16"
      >
        <div className="md:w-1/2 flex justify-center">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="relative"
          >
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full opacity-20 blur-lg animate-pulse"></div>
            <Image
              alt="Moises Trejo"
              src="/images/portrait2.png"
              width={300}
              height={300}
              className="rounded-full border-4 border-white shadow-xl relative z-10"
            />
          </motion.div>
        </div>

        <div className="md:w-1/2">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600"
          >
            Moises Trejo
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-xl text-gray-700 mb-6"
          >
            Software Engineer | Creative Coder | MIT Alum
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="text-lg text-gray-600 mb-8"
          >
            I create interactive experiences, generative art, and tools that help people work better. 
            Currently engineering at Instacart, MIT alum, and always exploring new ways to blend creativity with code.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="flex items-center mb-6 bg-blue-50 p-3 rounded-lg border border-blue-100"
          >
            <div className="mr-3 text-2xl">👋</div>
            <div>
              <p className="text-gray-700">
                You are visitor{" "}
                <span className="font-bold text-blue-600">{loading ? "..." : users.toLocaleString()}</span>
              </p>
              <p className="text-sm text-gray-500">Thanks for stopping by!</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="flex gap-4"
          >
            <a
              href="#my-work"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md flex items-center transition-colors"
            >
              <span className="mr-2">&#128187;</span>
              See My Work
            </a>
            <a
              href="#contact"
              className="px-4 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 rounded-md flex items-center transition-colors"
            >
              <span className="mr-2">&#9749;</span>
              Let's Connect
            </a>
          </motion.div>
        </div>
      </motion.div>

      {/* About Me Section */}
      <SectionDivider title="About Me" icon="👤" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-lg transition-shadow">
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">Interests</h3>
              <p className="text-sm text-gray-500 mb-4">Things I'm passionate about</p>
              <ul className="space-y-2">
                {interests.slice(0, 6).map((interest, index) => (
                  <li key={index} className="flex items-center">
                    <div className="mr-2 h-2 w-2 rounded-full bg-blue-600"></div>
                    <span>{interest}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-lg transition-shadow">
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">What I Build</h3>
              <p className="text-sm text-gray-500 mb-4">Areas I love to work in</p>
              <ul className="space-y-2">
                {whatIBuild.map((item, index) => (
                  <li key={index} className="flex items-center">
                    <div className="mr-2 h-2 w-2 rounded-full bg-purple-600"></div>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Career Timeline */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-lg transition-shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">Career Timeline</h3>
            <Link href="/resume" className="text-blue-600 hover:text-blue-800 text-sm">
              View Full Details →
            </Link>
          </div>
          <div className="relative border-l-2 border-blue-200 ml-8">
            {workExperience.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.2, duration: 0.5 }}
                className="mb-8 relative pl-8"
              >
                {/* Timeline dot */}
                <div className="absolute -left-[17px] top-1/2 -translate-y-1/2 w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <div className="w-4 h-4 bg-white rounded-full"></div>
                </div>
                
                {/* Content */}
                <div className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                  <h4 className="text-lg font-semibold">{item.name}</h4>
                  <div className="font-bold text-blue-600">{item.year}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Random Internal App Section */}
      <div id="my-work">
        <SectionDivider title="Try My Apps" icon="🚀" color="from-green-600 to-teal-600" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-lg transition-shadow overflow-hidden mb-12"
        >
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-4 text-white flex justify-between items-center">
            <div>
              <h3 className="text-xl font-semibold flex items-center">
                <span className="mr-2">🚀</span>
                Internal Tools
              </h3>
              <p className="text-sm text-purple-100">Tools and applications I've built</p>
            </div>
            <Link
              href="/tools"
              className="flex items-center text-white hover:text-purple-200 font-medium text-sm"
            >
              Explore more
              <span className="ml-1">→</span>
            </Link>
          </div>
          <div className="p-0">
            {randomInternalApp && (
              <div className="w-full h-[500px] overflow-hidden relative">
                <div className="w-full h-full">
                  <AppComponent />
                </div>
                {isExploring && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="bg-gray-50 p-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              {randomInternalApp && (
                <div className="text-sm text-gray-600">
                  Now viewing:{" "}
                  <Link
                    href={`/${randomInternalApp.id}`}
                    className="text-purple-600 hover:text-purple-800 transition-colors underline"
                  >
                    {randomInternalApp.name || "Random application"}
                  </Link>
                </div>
              )}
              {!randomInternalApp && (
                <p className="text-sm text-gray-600">Loading...</p>
              )}
            </div>
            <button
              onClick={refreshRandomContent}
              className="px-3 py-1 bg-purple-100 text-purple-700 rounded-md hover:bg-purple-200 transition-colors text-sm font-medium flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Try another
            </button>
          </div>
        </motion.div>
      </div>

      <SectionDivider title="P5.js Projects" icon="🎨" color="from-blue-600 to-indigo-600" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-lg transition-shadow overflow-hidden mb-12"
      >
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 text-white flex justify-between items-center">
          <div>
            <h3 className="text-xl font-semibold flex items-center">
              <span className="mr-2">🎨</span>
              P5.js Projects
            </h3>
            <p className="text-sm text-blue-100">Generative art and creative coding projects</p>
          </div>
          <Link 
            href="/p5art" 
            className="flex items-center text-white hover:text-blue-200 font-medium text-sm"
          >
            Explore more
            <span className="ml-1">→</span>
          </Link>
        </div>
        <div className="p-0">
          {randomP5Project && (
            <div className="w-full h-[500px] bg-black relative">
              <iframe
                src={`${process.env.NEXT_PUBLIC_P5}/${randomP5Project.id}`}
                width="100%"
                height="100%"
                className="border-0"
                title="P5.js Art"
              />
              {isExploring && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
                </div>
              )}
            </div>
          )}
        </div>
        <div className="bg-gray-50 p-4 flex justify-between items-center">
          {randomP5Project && (
            <div className="text-sm text-gray-600">
              Now viewing:{" "}
              <Link
                href={`${process.env.NEXT_PUBLIC_P5}/${randomP5Project.id}`}
                className="text-purple-600 hover:text-purple-800 transition-colors underline"
              >
                {randomP5Project.name || "Random P5.js artwork"}
              </Link>
            </div>
          )}
          {!randomP5Project && (
            <p className="text-sm text-gray-600">Loading...</p>
          )}
          <button
            onClick={refreshRandomContent}
            className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors text-sm font-medium flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Try another
          </button>
        </div>
      </motion.div>

      <SectionDivider title="Artwork" icon="🎨" color="from-yellow-600 to-orange-600" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-lg transition-shadow overflow-hidden mb-12"
      >
        <div className="bg-gradient-to-r from-yellow-600 to-orange-600 p-4 text-white flex justify-between items-center">
          <div>
            <h3 className="text-xl font-semibold flex items-center">
              <span className="mr-2">🎨</span>
              Artwork
            </h3>
            <p className="text-sm text-yellow-100">Check out my latest creations</p>
          </div>
          <Link
            href="/art"
            className="flex items-center text-white hover:text-yellow-200 font-medium text-sm"
          >
            Explore more
            <span className="ml-1">→</span>
          </Link>
        </div>
        <div className="p-6">
          {randomArt && (
            <div className="relative h-[400px] sm:h-[600px]">
              <Image
                src={`/images/art/${randomArt.id}`}
                alt={randomArt.name}
                layout="fill"
                objectFit="contain"
                className="rounded-lg"
              />
            </div>
          )}
        </div>
        <div className="bg-gray-50 p-4 flex justify-between items-center">
          <p className="text-sm text-gray-600">
            {randomArt ? `Viewing: ${randomArt.name}` : "Loading..."}
          </p>
          <button
            onClick={refreshRandomContent}
            className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-md hover:bg-yellow-200 transition-colors text-sm font-medium flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Try another
          </button>
        </div>
      </motion.div>

      <SectionDivider title="My Music" icon="🎵" color="from-pink-600 to-red-600" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-lg transition-shadow overflow-hidden mb-12"
      >
        <div className="bg-gradient-to-r from-pink-600 to-red-600 p-4 text-white">
          <h3 className="text-xl font-semibold flex items-center">
            <span className="mr-2">🎵</span>
            Music
          </h3>
          <p className="text-sm text-pink-100">Check out my latest tracks and remixes</p>
        </div>
        <div className="p-6">
          <SpotifyPage />
        </div>
        <div className="bg-gray-50 p-4 flex justify-end">
          <Link
            href="/music"
            className="flex items-center text-pink-600 hover:text-pink-800 font-medium text-sm"
          >
            See all music
            <span className="ml-1">→</span>
          </Link>
        </div>
      </motion.div>

      {/* Medium Articles Section */}
      <SectionDivider title="Medium Articles" icon="📝" color="from-gray-600 to-gray-800" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-lg transition-shadow overflow-hidden mb-12"
      >
        <div className="bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-600 p-4 text-white">
          <h3 className="text-xl font-semibold flex items-center">
            <span className="mr-2">📝</span>
            Latest Article
          </h3>
          <p className="text-sm text-emerald-100">Read my thoughts and tutorials</p>
        </div>

        <div className="p-6">
          <div className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
            {articles && articles[0] ? (
              <>
                <div className="p-4">
                  <h4 className="font-semibold text-lg mb-2">{articles[0].title}</h4>
                  <p className="text-gray-600 text-sm mb-3">
                    {articles[0].description.replace(/<[^>]*>/g, '').replace(/Summary/g, '').split(' ').slice(0, 120).join(' ')}...
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">
                      {new Date(articles[0].pubDate).toLocaleDateString()}
                    </span>
                    <a 
                      href={articles[0].link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                    >
                      Read more 
                      <span className="ml-1">→</span>
                    </a>
                  </div>
                </div>
              </>
            ) : (
              <div className="p-4 text-center text-gray-500">
                Loading latest article...
              </div>
            )}
          </div>
        </div>

        <div className="bg-gray-50 p-4 flex justify-end">
          <Link
            href="/blog"
            className="flex items-center text-gray-600 hover:text-gray-800 font-medium text-sm"
          >
            See all articles
            <span className="ml-1">→</span>
          </Link>
        </div>
      </motion.div>

      <div id="contact">
        <ContactPageClient/>
      </div>

      
      <Comments />

    </div>
  )
}

export default About
