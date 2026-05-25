"use client";

import contact from "../../public/information/contact.json";
import { motion } from "framer-motion";
import {
  FaLinkedin,
  FaTwitter,
  FaInstagram,
  FaGithub,
  FaYoutube,
  FaTiktok,
  FaSoundcloud,
  FaMedium,
  FaFacebook,
  FaPatreon,
  FaEgg,
  FaLink,
  FaEnvelope,
} from "react-icons/fa";
import { SiDevpost, SiProducthunt } from "react-icons/si";

const brandColors = {
  LinkedIn: "bg-blue-700 hover:bg-blue-800",
  Twitter: "bg-blue-400 hover:bg-blue-500",
  Instagram:
    "bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 hover:from-purple-600 hover:via-pink-600 hover:to-orange-600",
  Github: "bg-gray-800 hover:bg-gray-900",
  "Product Hunt": "bg-[#da552f] hover:bg-[#c44929]",
  Devpost: "bg-blue-600 hover:bg-blue-700",
  Youtube: "bg-red-600 hover:bg-red-700",
  TikTok: "bg-black hover:bg-gray-900",
  Soundcloud: "bg-orange-500 hover:bg-orange-600",
  Medium: "bg-green-700 hover:bg-green-800",
  Facebook: "bg-blue-600 hover:bg-blue-700",
  Patreon: "bg-orange-600 hover:bg-orange-700",
  "Easter Egg": "bg-yellow-500 hover:bg-yellow-600",
  email: "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700",
  default: "bg-blue-600 hover:bg-blue-700",
};

const socialIcons = {
  LinkedIn: FaLinkedin,
  Twitter: FaTwitter,
  Instagram: FaInstagram,
  Github: FaGithub,
  "Product Hunt": SiProducthunt,
  Devpost: SiDevpost,
  Youtube: FaYoutube,
  TikTok: FaTiktok,
  Soundcloud: FaSoundcloud,
  Medium: FaMedium,
  Facebook: FaFacebook,
  Patreon: FaPatreon,
  "Easter Egg": FaEgg,
  email: FaEnvelope,
  default: FaLink,
};

const CONTACT_EMAIL = "contact@moisestrejo.com";

function getHref(item) {
  if (item.link) return item.link;
  if (isEmail(item)) return `mailto:${CONTACT_EMAIL}`;
  return null;
}

function isEmail(item) {
  return item.name.includes("@") || item.name.includes("[@]");
}

function getLabel(item) {
  if (isEmail(item)) return "Email";
  return item.name;
}

const LinkStackItem = ({ item, index }) => {
  const href = getHref(item);
  if (!href) return null;

  const email = isEmail(item);
  const Icon = email ? socialIcons.email : socialIcons[item.name] || socialIcons.default;
  const colorClass = email
    ? brandColors.email
    : brandColors[item.name] || brandColors.default;
  const label = getLabel(item);

  return (
    <motion.a
      href={href}
      target={email ? undefined : "_blank"}
      rel={email ? undefined : "noopener noreferrer"}
      aria-label={label}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.35 }}
      className={`flex h-14 w-full items-center gap-4 rounded-xl px-4 text-white shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg ${colorClass}`}
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/20">
        <Icon className="text-xl" />
      </span>
      <span className="min-w-0">
        <span className="block font-semibold">{label}</span>
        {email && (
          <span className="block truncate text-sm text-white/80">{CONTACT_EMAIL}</span>
        )}
      </span>
    </motion.a>
  );
};

const ContactPageClient = () => {
  const links = contact.filter((item) => getHref(item));

  return (
    <div className="flex min-h-[60vh] justify-center px-4 py-16">
      <div className="grid w-full grid-cols-1 gap-3 md:w-1/2 md:grid-cols-2">
        {links.map((item, index) => (
          <LinkStackItem key={item.name} item={item} index={index} />
        ))}
      </div>
    </div>
  );
};

export default ContactPageClient;
