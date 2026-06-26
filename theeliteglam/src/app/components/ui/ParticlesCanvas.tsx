"use client";

import { useEffect, useRef } from "react";

export function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const ratio = window.devicePixelRatio || 1;
      canvas.width = canvas.offsetWidth * ratio;
      canvas.height = canvas.offsetHeight * ratio;
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    };

    type ParticleType = "soft" | "spark" | "flare";
    type Particle = {
      x: number;
      y: number;
      radius: number;
      vx: number;
      vy: number;
      opacity: number;
      life: number;
      baseLife: number;
      type: ParticleType;
      twinkle: number;
      glow: number;
      hue: number;
    };

    const types: ParticleType[] = ["soft", "spark", "flare"];
    const baseHue = 42;

    const createParticle = (): Particle => {
      const type = types[Math.floor(Math.random() * types.length)];
      const life = Math.random() * 0.8 + 0.6;
      const hue = baseHue + Math.random() * 18 - 9;
      const radius = type === "flare" ? Math.random() * 2 + 1 : type === "spark" ? Math.random() * 1.4 + 0.6 : Math.random() * 1.6 + 0.7;
      return {
        x: Math.random() * canvas.offsetWidth,
        y: canvas.offsetHeight + Math.random() * 140,
        radius,
        vx: Math.random() * 0.8 - 0.4,
        vy: Math.random() * 0.8 + 0.3,
        opacity: type === "flare" ? Math.random() * 0.35 + 0.3 : Math.random() * 0.35 + 0.15,
        life,
        baseLife: life,
        type,
        twinkle: Math.random() * Math.PI * 2,
        glow: Math.random() * 0.6 + 0.4,
        hue,
      };
    };

    resize();
    const particles: Particle[] = Array.from({ length: 120 }, createParticle);
    let animId: number;

    window.addEventListener("resize", resize);

    const drawGlow = (particle: Particle) => {
      const glowStrength = Math.max(0, Math.min(1, (particle.life / particle.baseLife) * particle.glow));
      const gradient = ctx.createRadialGradient(particle.x, particle.y, 0, particle.x, particle.y, particle.radius * 4);
      gradient.addColorStop(0, `hsla(${particle.hue}, 92%, 75%, ${0.18 * glowStrength})`);
      gradient.addColorStop(0.35, `hsla(${particle.hue}, 92%, 75%, ${0.05 * glowStrength})`);
      gradient.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.radius * 4, 0, Math.PI * 2);
      ctx.fill();
    };

    const drawSoft = (particle: Particle) => {
      drawGlow(particle);
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${particle.hue}, 90%, 75%, ${Math.max(0.1, particle.opacity * 0.8 * (particle.life / particle.baseLife))})`;
      ctx.fill();
    };

    const drawSpark = (particle: Particle) => {
      const twinkle = 0.5 + Math.abs(Math.sin(particle.twinkle)) * 0.5;
      ctx.fillStyle = `hsla(${particle.hue}, 96%, 82%, ${particle.opacity * twinkle * 0.9})`;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      ctx.fill();
      if (particle.radius > 1) {
        ctx.strokeStyle = `hsla(${particle.hue}, 96%, 82%, ${particle.opacity * twinkle * 0.6})`;
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.moveTo(particle.x - particle.radius * 1.6, particle.y);
        ctx.lineTo(particle.x + particle.radius * 1.6, particle.y);
        ctx.moveTo(particle.x, particle.y - particle.radius * 1.6);
        ctx.lineTo(particle.x, particle.y + particle.radius * 1.6);
        ctx.stroke();
      }
    };

    const drawFlare = (particle: Particle) => {
      const sparkle = 0.35 + Math.abs(Math.cos(particle.twinkle)) * 0.65;
      const alpha = particle.opacity * sparkle * (particle.life / particle.baseLife);
      ctx.strokeStyle = `hsla(${particle.hue}, 95%, 90%, ${alpha})`;
      ctx.lineWidth = 1.2;
      ctx.save();
      ctx.translate(particle.x, particle.y);
      ctx.rotate(particle.twinkle);
      ctx.beginPath();
      ctx.moveTo(-particle.radius * 2.5, 0);
      ctx.lineTo(particle.radius * 2.5, 0);
      ctx.moveTo(0, -particle.radius * 2.5);
      ctx.lineTo(0, particle.radius * 2.5);
      ctx.stroke();
      ctx.restore();
      drawGlow(particle);
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.radius * 0.9, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${particle.hue}, 100%, 85%, ${alpha * 1.1})`;
      ctx.fill();
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
      particles.forEach((particle) => {
        particle.x += particle.vx;
        particle.y -= particle.vy;
        particle.life -= 0.002;
        particle.twinkle += 0.06;

        if (particle.life <= 0 || particle.y < -60 || particle.x < -60 || particle.x > canvas.offsetWidth + 60) {
          Object.assign(particle, createParticle());
          return;
        }

        if (particle.type === "soft") {
          drawSoft(particle);
        } else if (particle.type === "flare") {
          drawFlare(particle);
        } else {
          drawSpark(particle);
        }
      });
      animId = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 h-full w-full pointer-events-none" />;
}