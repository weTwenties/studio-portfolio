"use client";

import { useEffect } from "react";

export default function PortfolioBodyClass() {
  useEffect(() => {
    document.body.classList.add("portfolio-page");
    return () => {
      document.body.classList.remove("portfolio-page");
    };
  }, []);

  return null;
}
