import localFont from "next/font/local";
import "./globals.css";
import Navbar from "./components/NavBar";
import Footer from "./components/Footer";
import Background from "./components/Background";
import LogRocket from "logrocket";
import { setupLogRocketReact } from "logrocket-react";

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
// setupLogRocketReact(LogRocket);

export const metadata = {
  title: "Moises Trejo",
  description: "Portfolio website",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta
          property="og:image"
          content="/images/front.png"
        />
        <meta property="og:url" content="http://moisestrejo.com" />
        <meta name="twitter:card" content="summary_large_image" />
        {/* Google tag (gtag.js) */}
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-LRJ9N9DN5T"
        ></script>
        <script dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag() {
              dataLayer.push(arguments);
            }
            gtag("js", new Date());

            gtag("config", "G-LRJ9N9DN5T");
          `
        }} />
      </head>
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
