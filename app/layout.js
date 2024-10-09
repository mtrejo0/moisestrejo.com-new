import localFont from "next/font/local";
import "./globals.css";
import Navbar from "./components/NavBar";
import Footer from "./components/Footer";
import Background from "./components/Background";
import LogRocket from "logrocket";
import setupLogRocketReact  from "logrocket-react";
import { GoogleAnalytics } from '@next/third-parties/google'
import { DefaultSeo } from "next-seo";

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
// after calling LogRocket.init()
if (typeof window !== 'undefined') {
  setupLogRocketReact(LogRocket);
}

export const metadata = {
  title: "Moises Trejo",
  description: "Portfolio website",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <DefaultSeo
        title="Moises Trejo - Personal Website"
        description="Welcome to the personal website of Moises Trejo, featuring blog posts, projects, and more."
        canonical="https://www.moisestrejo.com/"
        openGraph={{
          url: 'https://www.moisestrejo.com/',
          title: 'Moises Trejo - Official Site',
          description: 'Personal blog and portfolio of Moises Trejo.',
          images: [
            {
              url: 'https://www.moisestrejo.com/images/front.png',
              width: 800,
              height: 600,
              alt: 'Moises Trejo Portfolio',
            },
          ],
          site_name: 'Moises Trejo',
        }}
        twitter={{
          handle: '@MTrejo0',
          site: '@MTrejo0',
          cardType: 'summary_large_image',
        }}
      />
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <GoogleAnalytics gaId="G-LRJ9N9DN5T" />
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white text-black`}
      >
        {/* <Background/> */}
        <Navbar/>
        {children}
        <Footer />
      </body>
    </html>
  );
}