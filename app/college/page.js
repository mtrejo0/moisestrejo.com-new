"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function College() {
  const router = useRouter();

  useEffect(() => {
    router.push(
      "https://medium.com/@moises.trejo0/how-to-apply-to-college-b9084219ffc1",
    );
  }, []);

  return null;
}
