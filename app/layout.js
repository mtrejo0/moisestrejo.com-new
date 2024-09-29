import localFont from "next/font/local";
import "./globals.css";
import Navbar from "./components/NavBar";
import Footer from "./components/Footer";
import Background from "./components/Background";

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
