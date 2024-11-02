import localFont from "next/font/local";
import "./globals.css";
import Navbar from "./components/NavBar";
import Footer from "./components/Footer";
import Background from "./components/Background";
import LogRocket from "logrocket";
import setupLogRocketReact  from "logrocket-react";
import { GoogleAnalytics } from '@next/third-parties/google'

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

LogRocket.init("5ynwnu/moisestrejocom");

export const metadata = {
  title: "Moises Trejo",
  description: "MIT Software Engineer crafting innovative web applications. Specializing in full-stack development, data visualization, and AI-powered tools.",
  openGraph: {
    title: "Moises Trejo",
    images: [
      {
        url: '/images/front.png',
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/images/front.png'],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <GoogleAnalytics gaId="G-LRJ9N9DN5T" />
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white text-black`}
      >
        <Background/>
        <Navbar/>
        {children}
        <Footer />
      </body>
    </html>
  );
}