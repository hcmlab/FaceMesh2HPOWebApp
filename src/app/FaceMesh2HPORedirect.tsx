"use client";

import { useEffect } from "react";

const TARGET_URL = "https://hcmlab.github.io/FaceMesh2HPO/";

export default function FaceMesh2HPORedirect() {
  useEffect(() => {
    window.location.replace(TARGET_URL);
  }, []);

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: "2rem",
        fontFamily: "system-ui, sans-serif",
        textAlign: "center",
      }}
    >
      <div>
        <p style={{ marginBottom: "0.75rem", fontSize: "1rem" }}>
          Redirecting to FaceMesh2HPO...
        </p>
        <a href={TARGET_URL} target="_blank" rel="noopener noreferrer">
          Open manually
        </a>
      </div>
    </main>
  );
}