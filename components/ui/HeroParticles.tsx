"use client";

import { useEffect, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import type { ISourceOptions } from "@tsparticles/engine";

const options: ISourceOptions = {
  fullScreen: { enable: false },
  background: { color: { value: "transparent" } },
  fpsLimit: 30,
  detectRetina: true,
  particles: {
    number: { value: 35, density: { enable: true, width: 1200, height: 800 } },
    color: { value: ["#FFFFFF", "#F4A933", "#1FB5E0"] },
    shape: { type: "circle" },
    opacity: { value: { min: 0.1, max: 0.45 } },
    size: { value: { min: 1, max: 2 } },
    links: {
      enable: true,
      distance: 140,
      color: "#FFFFFF",
      opacity: 0.16,
      width: 1,
    },
    move: {
      enable: true,
      speed: 0.45,
      direction: "none",
      random: true,
      straight: false,
      outModes: { default: "out" },
    },
  },
  interactivity: {
    events: {
      onHover: { enable: false },
      onClick: { enable: false },
    },
  },
};

export function HeroParticles() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => setReady(true));
  }, []);

  if (!ready) return null;

  return (
    <Particles
      id="hero-particles"
      options={options}
      className="absolute inset-0 z-0 pointer-events-none"
    />
  );
}
