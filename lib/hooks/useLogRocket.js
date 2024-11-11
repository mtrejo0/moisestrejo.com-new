"use client";

import { useEffect } from "react";
import LogRocket from "logrocket";
import setupLogRocketReact from "logrocket-react";

export const useLogRocket = () => {
  useEffect(() => {
    LogRocket.init("5ynwnu/moisestrejocom");
    setupLogRocketReact(LogRocket);
  }, []);
};
