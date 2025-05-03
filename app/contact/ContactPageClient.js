"use client"

import contact from "../../public/information/contact.json"
import EmailForm from "./EmailForm"
import { motion } from "framer-motion"
import { FaLinkedin, FaTwitter, FaInstagram, FaGithub, FaYoutube, FaTiktok, FaSoundcloud, FaMedium, FaFacebook, FaPatreon, FaEgg, FaLink, FaEnvelope, FaGlobe, FaQuestionCircle, FaMailBulk } from 'react-icons/fa'
import { SiDevpost } from 'react-icons/si'

// Define social media brand colors
const brandColors = {
    LinkedIn: "bg-blue-700 hover:bg-blue-800",
    Twitter: "bg-blue-400 hover:bg-blue-500",
    Instagram:
      "bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 hover:from-purple-600 hover:via-pink-600 hover:to-orange-600",
    Github: "bg-gray-800 hover:bg-gray-900",
    Devpost: "bg-blue-600 hover:bg-blue-700",
    Youtube: "bg-red-600 hover:bg-red-700",
    TikTok: "bg-black hover:bg-gray-900",
    Soundcloud: "bg-orange-500 hover:bg-orange-600",
    Medium: "bg-green-700 hover:bg-green-800",
    Facebook: "bg-blue-600 hover:bg-blue-700",
    Patreon: "bg-orange-600 hover:bg-orange-700",
    "Easter Egg": "bg-yellow-500 hover:bg-yellow-600",
    default: "bg-blue-600 hover:bg-blue-700",
}

// Define social media icons
const socialIcons = {
    LinkedIn: FaLinkedin,
    Twitter: FaTwitter,
    Instagram: FaInstagram,
    Github: FaGithub,
    Devpost: SiDevpost,
    Youtube: FaYoutube,
    TikTok: FaTiktok,
    Soundcloud: FaSoundcloud,
    Medium: FaMedium,
    Facebook: FaFacebook,
    Patreon: FaPatreon,
    "Easter Egg": FaEgg,
    default: FaLink,
}

const ContactCard = ({ item, index }) => {
  const getBgColor = (name) => {
    return brandColors[name] || brandColors.default
  }

  const Icon = socialIcons[item.name] || socialIcons.default
  const isEmail = item.name.includes("@")

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="w-full"
    >
      {item.link ? (
        <a
          href={item.link}
          target="_blank"
          rel="noopener noreferrer"
          className={`flex items-center p-4 rounded-lg transition-all transform hover:-translate-y-1 hover:shadow-lg ${
            isEmail ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white" : getBgColor(item.name)
          } text-white`}
        >
          <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-white bg-opacity-20 rounded-full mr-4">
            <Icon className="text-xl" />
          </div>
          <div className="flex-grow">
            <h3 className="font-bold">{item.name}</h3>
          </div>
          <div className="flex-shrink-0">
            <FaLink />
          </div>
        </a>
      ) : (
        <div className="flex items-center p-4 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-white bg-opacity-20 rounded-full mr-4">
            <FaEnvelope className="text-xl" />
          </div>
          <div className="flex-grow">
            <h3 className="font-bold">{item.name}</h3>
            <p className="text-sm text-white text-opacity-80">{item.description}</p>
          </div>
        </div>
      )}
    </motion.div>
  )
}

const ContactPageClient = () => {
  // Group contacts by category
  const emailContacts = contact.filter((item) => item.name.includes("@"))
  const socialContacts = contact.filter((item) => !item.name.includes("@"))

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 mb-4">
            Let's Connect
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            I'm always open to new opportunities, collaborations, or just a friendly chat. Reach out through any of
            these platforms!
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          {/* Contact Methods */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white rounded-xl shadow-xl overflow-hidden"
          >
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
              <h2 className="text-2xl font-bold flex items-center">
                <FaMailBulk className="mr-2" /> Contact Methods
              </h2>
              <p className="text-blue-100">Choose your preferred way to reach me</p>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                {socialContacts.map((item, index) => (
                  <ContactCard key={index} item={item} index={index + emailContacts.length} />
                ))}
              </div>
            </div>
          </motion.div>

          {/* Email Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-white rounded-xl shadow-xl overflow-hidden"
          >
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 text-white">
              <h2 className="text-2xl font-bold flex items-center">
                <FaEnvelope className="mr-2" /> Send a Message
              </h2>
              <p className="text-purple-100">I'll get back to you as soon as possible</p>
            </div>
            <div className="p-6">
              <EmailForm />
            </div>
          </motion.div>
        </div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="bg-white rounded-xl shadow-xl overflow-hidden"
        >
          <div className="bg-gradient-to-r from-green-600 to-teal-600 p-6 text-white">
            <h2 className="text-2xl font-bold flex items-center">
              <FaQuestionCircle className="mr-2" /> Frequently Asked Questions
            </h2>
            <p className="text-green-100">Quick answers to common questions</p>
          </div>
          <div className="p-6 space-y-6">
            <div className="border-l-4 border-green-500 pl-4 py-2">
              <h3 className="font-bold text-lg mb-2">What's the best way to contact you?</h3>
              <p className="text-gray-600">
                The email form above or LinkedIn are the fastest ways to reach me. I check both regularly and try to respond within 24-48 hours.
              </p>
            </div>

            <div className="border-l-4 border-green-500 pl-4 py-2">
              <h3 className="font-bold text-lg mb-2">Are you available for freelance work?</h3>
              <p className="text-gray-600">
                Yes! I'm open to discussing freelance opportunities. Please reach out with details about your project.
              </p>
            </div>

            <div className="border-l-4 border-green-500 pl-4 py-2">
              <h3 className="font-bold text-lg mb-2">Do you offer mentorship?</h3>
              <p className="text-gray-600">
                I occasionally take on mentees depending on my availability. Feel free to contact me to discuss
                possibilities.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default ContactPageClient
