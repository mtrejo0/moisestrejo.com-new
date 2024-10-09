'use client'

import About from "./components/About.js"
import LogRocket from "logrocket";
import setupLogRocketReact from "logrocket-react";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    LogRocket.init("5ynwnu/moisestrejocom");
    setupLogRocketReact(LogRocket);
    
  }, []);

  return (
    <>
      <About />
    </>
  )
}
