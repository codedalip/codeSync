import React, { useEffect, useRef } from 'react';
import { useThemeStore } from '../../stores/useThemeStore';

const CRTGridBackground = () => {
  const canvasRef = useRef(null);
  const { theme } = useThemeStore();
  const isLight = theme === 'light';

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Mouse Position State
    let mouse = {
      x: -1000,
      y: -1000,
      targetX: -1000,
      targetY: -1000,
      radius: 240
    };

    const handleMouseMove = (e) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
    };

    const handleMouseLeave = () => {
      mouse.targetX = -1000;
      mouse.targetY = -1000;
    };

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('resize', handleResize);

    // Generate Luminous Shining 3D Orbs for Left and Right Edge Arrays
    const createOrbs = (side) => {
      const orbs = [];
      const count = 30; // Number of shining 3D orbs per side
      for (let i = 0; i < count; i++) {
        const radius = Math.random() * 58 + 18; // Sizes from 18px to 76px
        const initialX = side === 'left' 
          ? Math.random() * 0.28 * width 
          : (0.72 + Math.random() * 0.28) * width;
        orbs.push({
          x: initialX,
          baseX: initialX,
          y: Math.random() * height,
          vx: 0,
          vy: 0,
          radius,
          baseRadius: radius,
          speed: Math.random() * 1.5 + 0.8, // Fast floating speed
          opacity: Math.random() * 0.35 + 0.5, // High visibility opacity
          side
        });
      }
      return orbs;
    };

    const leftOrbs = createOrbs('left');
    const rightOrbs = createOrbs('right');
    const allOrbs = [...leftOrbs, ...rightOrbs];

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Smooth lerp mouse position
      mouse.x += (mouse.targetX - mouse.x) * 0.12;
      mouse.y += (mouse.targetY - mouse.y) * 0.12;

      // Theme Colors
      const primaryColor = isLight ? '24, 24, 27' : '255, 255, 255';
      const gridDotColor = isLight ? 'rgba(0, 0, 0, 0.06)' : 'rgba(255, 255, 255, 0.05)';

      // 1. Draw High-Tech Fine Dot Matrix Grid with Mouse Interactive Aura
      ctx.shadowBlur = 0;
      ctx.shadowColor = 'transparent';
      const gridSize = 18;
      for (let x = 0; x < width; x += gridSize) {
        for (let y = 0; y < height; y += gridSize) {
          if ((x / gridSize + y / gridSize) % 2 === 0) {
            const dx = x - mouse.x;
            const dy = y - mouse.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < mouse.radius) {
              const alpha = (1 - dist / mouse.radius) * (isLight ? 0.35 : 0.45);
              ctx.fillStyle = `rgba(${primaryColor}, ${alpha})`;
              ctx.fillRect(x - 1, y - 1, 3.5, 3.5);
            } else {
              ctx.fillStyle = gridDotColor;
              ctx.fillRect(x, y, 1.5, 1.5);
            }
          }
        }
      }

      // 2. Draw & Animate Shining 3D Orbs with Blurred Luminous Rim Glow
      allOrbs.forEach((orb) => {
        // Fast vertical ambient floating
        orb.y -= orb.speed;

        // Reset offscreen
        if (orb.y < -100) {
          orb.y = height + Math.random() * 80;
          orb.baseX = orb.side === 'left' ? Math.random() * 0.28 * width : (0.72 + Math.random() * 0.28) * width;
        }

        // Instant High-Response Mouse Repulsion & Scale Bounce
        const dx = orb.x - mouse.x;
        const dy = orb.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < mouse.radius + orb.radius) {
          const force = (1 - dist / (mouse.radius + orb.radius)) * 18;
          const angle = Math.atan2(dy, dx);
          orb.vx += Math.cos(angle) * force * 0.25;
          orb.vy += Math.sin(angle) * force * 0.25;
          // Scale bounce when hovered
          orb.radius = Math.min(orb.baseRadius * 1.35, orb.radius + 1.5);
        } else {
          orb.radius = Math.max(orb.baseRadius, orb.radius - 0.6);
        }

        // Spring back physics
        orb.vx += (orb.baseX - orb.x) * 0.035;
        orb.vx *= 0.85;
        orb.vy *= 0.85;

        orb.x += orb.vx;
        orb.y += orb.vy;

        // Hover opacity boost
        let opacityBoost = 0;
        if (dist < mouse.radius + orb.radius) {
          opacityBoost = (1 - dist / (mouse.radius + orb.radius)) * 0.3;
        }

        const opacity = Math.min(0.95, orb.opacity + opacityBoost);

        // 3D Metallic Sphere Radial Gradient
        const highlightX = orb.x - orb.radius * 0.32;
        const highlightY = orb.y - orb.radius * 0.32;
        const orbGradient = ctx.createRadialGradient(
          highlightX, highlightY, orb.radius * 0.05,
          orb.x, orb.y, orb.radius
        );

        if (isLight) {
          orbGradient.addColorStop(0, `rgba(255, 255, 255, ${opacity})`);
          orbGradient.addColorStop(0.3, `rgba(212, 212, 216, ${opacity * 0.85})`);
          orbGradient.addColorStop(0.7, `rgba(113, 113, 122, ${opacity * 0.7})`);
          orbGradient.addColorStop(1, `rgba(24, 24, 27, ${opacity * 0.45})`);
        } else {
          orbGradient.addColorStop(0, `rgba(255, 255, 255, ${opacity})`);
          orbGradient.addColorStop(0.3, `rgba(228, 228, 231, ${opacity * 0.85})`);
          orbGradient.addColorStop(0.7, `rgba(82, 82, 91, ${opacity * 0.65})`);
          orbGradient.addColorStop(1, `rgba(24, 24, 27, ${opacity * 0.4})`);
        }

        // Enable Soft Luminous Shadow Blur for Shining Outer Rim
        ctx.shadowColor = isLight 
          ? `rgba(24, 24, 27, ${opacity * 0.5})` 
          : `rgba(255, 255, 255, ${opacity * 0.75})`;
        ctx.shadowBlur = Math.min(22, orb.radius * 0.45);

        ctx.fillStyle = orbGradient;
        ctx.beginPath();
        ctx.arc(orb.x, orb.y, orb.radius, 0, Math.PI * 2);
        ctx.fill();

        // Glowing Outer Rim Ring
        ctx.strokeStyle = isLight 
          ? `rgba(24, 24, 27, ${opacity * 0.8})` 
          : `rgba(255, 255, 255, ${opacity * 0.9})`;
        ctx.lineWidth = 1.8;
        ctx.stroke();

        // Sharp Glossy Specular Spot
        ctx.shadowBlur = 0; // Reset shadow for specular highlight
        ctx.fillStyle = `rgba(255, 255, 255, ${opacity * 0.95})`;
        ctx.beginPath();
        ctx.arc(highlightX, highlightY, orb.radius * 0.22, 0, Math.PI * 2);
        ctx.fill();
      });

      // 3. Mouse Follower Interactive Glow Ring
      if (mouse.x > 0 && mouse.y > 0) {
        ctx.shadowBlur = 0;
        const mouseGlow = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, mouse.radius * 1.2);
        mouseGlow.addColorStop(0, `rgba(${primaryColor}, ${isLight ? '0.08' : '0.12'})`);
        mouseGlow.addColorStop(0.5, `rgba(${primaryColor}, ${isLight ? '0.03' : '0.04'})`);
        mouseGlow.addColorStop(1, 'transparent');
        ctx.fillStyle = mouseGlow;
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, mouse.radius * 1.2, 0, Math.PI * 2);
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isLight]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 transition-opacity duration-300 opacity-95"
    />
  );
};

export default CRTGridBackground;
