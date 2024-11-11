"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";

import internalApps from "../../../public/information/internalApps.json";
import NotFound404 from "../../components/NotFound404.js";

export default function DynamicPage() {
  const { id } = useParams();
  const [Component, setComponent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const internalApp = internalApps.find((app) => app.id === id);
    if (internalApp) {
      const DynamicComponent = dynamic(
        () =>
          import(`../../components/internalApps/${internalApp.component}.jsx`),
      );
      setComponent(() => DynamicComponent);
    }

    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, [id]);

  if (Component) {
    return <Component />;
  }

  if (loading) {
    return null; // or a loading spinner if preferred
  }

  return <NotFound404 />;
}
