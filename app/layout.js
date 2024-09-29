import localFont from "next/font/local";
import "./globals.css";
import Navbar from "./components/NavBar";
import Footer from "./components/Footer";
import Background from "./components/Background";
// import LogRocket from "logrocket";
// import { setupLogRocketReact } from "logrocket-react";

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

// LogRocket.init("5ynwnu/moisestrejocom");
// // after calling LogRocket.init()
// setupLogRocketReact(LogRocket);

export const metadata = {
  title: "Moises Trejo",
  description: "Portfolio website",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Background/>
        <Navbar/>
        {children}
        <Footer />
      </body>
    </html>
  );
}
