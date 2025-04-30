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

const About = () => {
  const [loading, setLoading] = useState(true)
  const [users, setUsers] = useState(0)
  const [activeTab, setActiveTab] = useState("about")

  const [randomProject, setRandomProject] = useState(null)
  const [randomInternalApp, setRandomInternalApp] = useState(null)

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
    const timer = setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * p5jsProjects.length)
      const project = p5jsProjects[randomIndex]
      setRandomProject(project)

      const randomAppIndex = Math.floor(Math.random() * internalApps.length)
      const app = internalApps[randomAppIndex]
      setRandomInternalApp(app)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const interests = [
    "Computer Science",
    "Design",
    "Entrepreneurship",
    "Making: 3D printing, laser cutting, embedded systems",
    "Cooking",
    "Art and its various forms: Painting, Digital Design",
    "Sports: Kickboxing, Brazilian Jiu Jitsu, Basketball, Soccer",
    "Dancing: Contemporary Dance, Salsa, Merengue, Cumbias, Breakdancing",
    "Skateboarding",
    "Philosophy, Ethics, Theology, Psychology",
    "Anthropology",
    "Natural Sciences: Mathematics, Chemistry, Biology, Physics",
    "Music: Music Producing, DJing",
    "Comedy",
    "Video Editing",
    "Literature",
    "Urban Planning",
    "the list goes on...",
  ]

  const skills = [
    { name: "JavaScript/TypeScript", category: "frontend" },
    { name: "React", category: "frontend" },
    { name: "Next.js", category: "frontend" },
    { name: "Node.js", category: "backend" },
    { name: "Python", category: "backend" },
    { name: "AWS", category: "cloud" },
    { name: "P5.js", category: "creative" },
    { name: "SQL", category: "data" },
    { name: "MongoDB", category: "data" },
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

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row items-center justify-between gap-8 mb-16"
      >
        <div className="md:w-1/2">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="relative"
          >
            
            <Image
              alt="Moises Trejo"
              src="/images/portrait.png"
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

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="flex flex-wrap gap-2 mb-6"
          >
            {["JavaScript", "React", "Next.js", "P5.js", "AWS", "Python"].map((skill) => (
              <span
                key={skill}
                className="px-3 py-1 text-sm bg-white border border-gray-200 rounded-full shadow-sm hover:shadow-md transition-shadow"
              >
                {skill}
              </span>
            ))}
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="text-lg text-gray-600 mb-6"
          >
            You are visitor <span className="font-bold text-blue-600">{loading ? "..." : users.toLocaleString()}</span>
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="flex gap-4"
          >
            <a
              href="https://github.com/mtrejo0"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md flex items-center transition-colors"
            >
              <span className="mr-2">&#128187;</span>
              GitHub
            </a>
            <a
              href="/contact"
              className="px-4 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 rounded-md flex items-center transition-colors"
            >
              <span className="mr-2">&#9749;</span>
              Contact Me
            </a>
          </motion.div>
        </div>
      </motion.div>

      {/* Custom Tabs */}
      <div className="mb-16">
        <div className="grid grid-cols-4 mb-8 border-b">
          {[
            { id: "about", label: "About Me", icon: "👤" },
            { id: "skills", label: "Skills", icon: "💻" },
            { id: "interests", label: "Interests", icon: "🌟" },
            { id: "projects", label: "Projects", icon: "🎨" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center justify-center py-3 px-4 font-medium text-sm transition-colors ${
                activeTab === tab.id ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-600 hover:text-blue-600"
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* About Tab Content */}
        {activeTab === "about" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="grid md:grid-cols-2 gap-6"
          >
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">Professional</h3>
                <p className="text-sm text-gray-500 mb-4">My career journey</p>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <div className="mr-2 mt-1 h-2 w-2 rounded-full bg-blue-600"></div>
                    <span>Software Engineer at Instacart on the Catalog Enrichment Team</span>
                  </li>
                  <li className="flex items-start">
                    <div className="mr-2 mt-1 h-2 w-2 rounded-full bg-blue-600"></div>
                    <span>MIT Class of 2022 BS in Computer Science</span>
                  </li>
                  <li className="flex items-start">
                    <div className="mr-2 mt-1 h-2 w-2 rounded-full bg-blue-600"></div>
                    <span>Based in Dallas, Texas</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">What I Build</h3>
                <p className="text-sm text-gray-500 mb-4">Areas I love to work in</p>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <div className="mr-2 mt-1 h-2 w-2 rounded-full bg-purple-600"></div>
                    <span>Health and wellness technology</span>
                  </li>
                  <li className="flex items-start">
                    <div className="mr-2 mt-1 h-2 w-2 rounded-full bg-purple-600"></div>
                    <span>Applicant filtering web apps</span>
                  </li>
                  <li className="flex items-start">
                    <div className="mr-2 mt-1 h-2 w-2 rounded-full bg-purple-600"></div>
                    <span>Music and rhyming tech</span>
                  </li>
                  <li className="flex items-start">
                    <div className="mr-2 mt-1 h-2 w-2 rounded-full bg-purple-600"></div>
                    <span>Productivity tools</span>
                  </li>
                  <li className="flex items-start">
                    <div className="mr-2 mt-1 h-2 w-2 rounded-full bg-purple-600"></div>
                    <span>Data visualization projects</span>
                  </li>
                  <li className="flex items-start">
                    <div className="mr-2 mt-1 h-2 w-2 rounded-full bg-purple-600"></div>
                    <span>Social impact applications</span>
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>
        )}

        {/* Skills Tab Content */}
        {activeTab === "skills" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-lg transition-shadow overflow-hidden">
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4">
                <h3 className="text-lg font-semibold flex items-center">
                  <span className="mr-2">&#128187;</span>
                  Frontend
                </h3>
              </div>
              <div className="p-6">
                <div className="flex flex-wrap gap-2">
                  {skills
                    .filter((s) => s.category === "frontend")
                    .map((skill) => (
                      <span
                        key={skill.name}
                        className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full hover:bg-blue-200 transition-colors"
                      >
                        {skill.name}
                      </span>
                    ))}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-lg transition-shadow overflow-hidden">
              <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4">
                <h3 className="text-lg font-semibold flex items-center">
                  <span className="mr-2">&#128736;</span>
                  Backend
                </h3>
              </div>
              <div className="p-6">
                <div className="flex flex-wrap gap-2">
                  {skills
                    .filter((s) => s.category === "backend" || s.category === "cloud")
                    .map((skill) => (
                      <span
                        key={skill.name}
                        className="px-3 py-1 text-sm bg-purple-100 text-purple-800 rounded-full hover:bg-purple-200 transition-colors"
                      >
                        {skill.name}
                      </span>
                    ))}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-lg transition-shadow overflow-hidden">
              <div className="bg-gradient-to-r from-green-50 to-green-100 p-4">
                <h3 className="text-lg font-semibold flex items-center">
                  <span className="mr-2">&#127912;</span>
                  Creative & Data
                </h3>
              </div>
              <div className="p-6">
                <div className="flex flex-wrap gap-2">
                  {skills
                    .filter((s) => s.category === "creative" || s.category === "data")
                    .map((skill) => (
                      <span
                        key={skill.name}
                        className="px-3 py-1 text-sm bg-green-100 text-green-800 rounded-full hover:bg-green-200 transition-colors"
                      >
                        {skill.name}
                      </span>
                    ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Interests Tab Content */}
        {activeTab === "interests" && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">My Diverse Interests</h3>
                <p className="text-sm text-gray-500 mb-4">I'm passionate about many things</p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {interests.slice(0, 15).map((interest, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05, duration: 0.3 }}
                      className="flex items-start"
                    >
                      <div className="mr-2 mt-1.5 h-2 w-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600"></div>
                      <span>{interest}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
              <div className="px-6 py-4 border-t border-gray-100">
                <button className="text-blue-600 hover:text-blue-800 font-medium">And many more...</button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Projects Tab Content */}
        {activeTab === "projects" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-lg transition-shadow overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 text-white">
                <h3 className="text-xl font-semibold flex items-center">
                  <span className="mr-2">&#127912;</span>
                  P5.js Creative Coding
                </h3>
                <p className="text-sm text-blue-100">Generative art and creative coding projects</p>
              </div>
              <div className="p-0">
                {randomProject && (
                  <div className="w-full h-[400px] bg-black">
                    <iframe
                      src={`${process.env.NEXT_PUBLIC_P5}/${randomProject.id}`}
                      width="100%"
                      height="100%"
                      className="border-0"
                      title="P5.js Art"
                    />
                  </div>
                )}
              </div>
              <div className="bg-gray-50 p-4 flex justify-between items-center">
                <p className="text-sm text-gray-600">Random P5.js artwork</p>
                <Link href="/p5Art" className="flex items-center text-blue-600 hover:text-blue-800 font-medium">
                  See more artwork
                  <span className="ml-1">&#8594;</span>
                </Link>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-lg transition-shadow overflow-hidden">
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-4 text-white">
                <h3 className="text-xl font-semibold flex items-center">
                  <span className="mr-2">&#128736;</span>
                  Internal Applications
                </h3>
                <p className="text-sm text-purple-100">Tools and applications I've built</p>
              </div>
              <div className="p-0">
                {randomInternalApp && (
                  <div className="w-full h-[400px] overflow-hidden">
                    <div className="w-full h-full">
                      <AppComponent />
                    </div>
                  </div>
                )}
              </div>
              <div className="bg-gray-50 p-4 flex justify-between items-center">
                <p className="text-sm text-gray-600">Random internal application</p>
                <Link href="/portfolio" className="flex items-center text-purple-600 hover:text-purple-800 font-medium">
                  Explore portfolio
                  <span className="ml-1">&#8594;</span>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Comments Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="bg-white rounded-lg shadow-md p-6"
      >
        <h2 className="text-2xl font-semibold mb-6 flex items-center">
          <span className="mr-2">&#128172;</span>
          Leave a Comment
        </h2>
        <Comments />
      </motion.div>
    </div>
  )
}

export default About
