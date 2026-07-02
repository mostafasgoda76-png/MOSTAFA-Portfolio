"use client";
import React, { useEffect, useRef } from "react";

export default function Background() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    const mouse = { x: -1000, y: -1000, targetX: -1000, targetY: -1000, radius: 240 };
    let time = 0;

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
    };

    const handleMouseLeave = () => {
      mouse.targetX = -1000;
      mouse.targetY = -1000;
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);

    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      baseRadius: number;
    }

    const particles: Particle[] = [];
    const particleCount = 45;

    for (let i = 0; i < particleCount; i++) {
      const r = Math.random() * 1.3 + 0.6;
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.18,
        vy: (Math.random() - 0.5) * 0.18,
        radius: r,
        baseRadius: r,
      });
    }

    const animate = () => {
      time += 0.002;
      ctx.clearRect(0, 0, width, height);

      // Smooth mouse coordinate interpolation
      if (mouse.targetX !== -1000) {
        if (mouse.x === -1000) {
          mouse.x = mouse.targetX;
          mouse.y = mouse.targetY;
        } else {
          mouse.x += (mouse.targetX - mouse.x) * 0.08;
          mouse.y += (mouse.targetY - mouse.y) * 0.08;
        }
      } else {
        mouse.x = -1000;
        mouse.y = -1000;
      }

      // Base solid dark cyan/teal color (#021c27)
      ctx.fillStyle = "#021c27";
      ctx.fillRect(0, 0, width, height);

      // 1. Moving ambient light: Cyan glow on the left
      const light1X = width * 0.25 + Math.cos(time) * 150;
      const light1Y = height * 0.35 + Math.sin(time) * 100;
      const grad1 = ctx.createRadialGradient(light1X, light1Y, 0, light1X, light1Y, width * 0.6);
      grad1.addColorStop(0, "rgba(0, 217, 255, 0.2)");
      grad1.addColorStop(1, "rgba(2, 28, 39, 0)");
      ctx.fillStyle = grad1;
      ctx.fillRect(0, 0, width, height);

      // 2. Moving ambient light: Soft sky blue glow on the right
      const light2X = width * 0.75 + Math.sin(time * 0.8) * 120;
      const light2Y = height * 0.55 + Math.cos(time * 0.8) * 150;
      const grad2 = ctx.createRadialGradient(light2X, light2Y, 0, light2X, light2Y, width * 0.55);
      grad2.addColorStop(0, "rgba(56, 189, 248, 0.15)");
      grad2.addColorStop(1, "rgba(2, 28, 39, 0)");
      ctx.fillStyle = grad2;
      ctx.fillRect(0, 0, width, height);

      // 3. Mouse-following cyan spotlight glow
      if (mouse.x !== -1000) {
        const gradMouse = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, mouse.radius);
        gradMouse.addColorStop(0, "rgba(0, 217, 255, 0.06)");
        gradMouse.addColorStop(0.5, "rgba(0, 217, 255, 0.02)");
        gradMouse.addColorStop(1, "rgba(2, 28, 39, 0)");
        ctx.fillStyle = gradMouse;
        ctx.fillRect(0, 0, width, height);
      }

      // Draw and animate neural network nodes
      particles.forEach((p, idx) => {
        // Translate node
        p.x += p.vx;
        p.y += p.vy;

        // Bounce check
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        // Gentle mouse interaction (smooth push attraction/repulsion)
        if (mouse.x !== -1000) {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const dist = Math.hypot(dx, dy);
          if (dist < mouse.radius) {
            const force = (mouse.radius - dist) / mouse.radius;
            // Push particles away gently
            p.x -= dx * force * 0.015;
            p.y -= dy * force * 0.015;
            p.radius = p.baseRadius + force * 0.8;
          } else {
            p.radius = p.baseRadius;
          }
        } else {
          p.radius = p.baseRadius;
        }

        // Draw particle node
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(0, 217, 255, 0.35)";
        ctx.fill();

        // Connect nearby nodes
        for (let j = idx + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.hypot(dx, dy);

          if (dist < 140) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(0, 217, 255, ${0.12 * (1 - dist / 140)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 -z-50 bg-[#021c27] overflow-hidden pointer-events-none">
      <canvas ref={canvasRef} className="absolute inset-0 block animate-fade-in" />
      {/* Luxury glassmorphic overlay div */}
      <div className="absolute inset-0 bg-white/[0.005] backdrop-blur-[2px] pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-[#00D9FF]/[0.02] to-transparent pointer-events-none" />
      {/* Premium subtle grid backdrop layer */}
      <div 
        className="absolute inset-0 opacity-[0.035] pointer-events-none" 
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(0, 217, 255, 0.25) 1px, transparent 0)`,
          backgroundSize: "2.5rem 2.5rem"
        }}
      />
    </div>
  );
}
