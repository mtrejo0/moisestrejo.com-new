"use client";

import About from "./components/About.js";
import { useLogRocket } from "../lib/hooks/useLogRocket.js";

export default function Home() {
  useLogRocket();

  return (
    <>
      <About />
    </>
  );
}
