import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useThemeStore } from '../../stores/useThemeStore';
import { Sun, Moon, Sliders, Sparkles } from 'lucide-react';

const ThemeShowcase = () => {
  const { theme } = useThemeStore();
  const isLight = theme === 'light';

  const [activeTab, setActiveTab] = useState('split'); // 'split' | 'dark' | 'light'
  const [sliderPos, setSliderPos] = useState(50); // 0% to 100%
  const targetPosRef = useRef(50);
  const animFrameRef = useRef(null);
  const containerRef = useRef(null);

  // Smooth lerp animation loop for butter-smooth slider movement
  useEffect(() => {
    const updateLerp = () => {
      setSliderPos((prev) => {
        const diff = targetPosRef.current - prev;
        if (Math.abs(diff) < 0.05) return targetPosRef.current;
        return prev + diff * 0.15; // Smooth interpolation factor
      });
      animFrameRef.current = requestAnimationFrame(updateLerp);
    };

    animFrameRef.current = requestAnimationFrame(updateLerp);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, []);

  const handleMove = (clientX) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(2, Math.min(98, (x / rect.width) * 100));
    targetPosRef.current = percentage;
  };

  const handleMouseMove = (e) => {
    if (activeTab === 'split') {
      handleMove(e.clientX);
    }
  };

  const handleTouchMove = (e) => {
    if (activeTab === 'split' && e.touches && e.touches[0]) {
      handleMove(e.touches[0].clientX);
    }
  };

  return (
    <div className="w-full space-y-10 my-16 select-none">
      {/* Section Sub-Header & Mode Controls */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6 }}
        className="flex flex-col md:flex-row items-center justify-between gap-6 pb-2"
      >
        <div className="space-y-2 text-center md:text-left">
          <div className={`inline-flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider ${
            isLight ? 'text-zinc-600' : 'text-zinc-400'
          }`}>
            <Sparkles className="w-3.5 h-3.5" />
            <span>Dual Theme Architecture</span>
          </div>
          <h3 className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${isLight ? 'text-zinc-900' : 'text-white'}`}>
            Designed for Day & Night Coding
          </h3>
        </div>

        {/* Interactive Mode Toggle Pills (Clean monochrome, NO text emojis!) */}
        <div className={`flex items-center p-1.5 rounded-xl border shadow-sm ${
          isLight ? 'bg-zinc-100 border-zinc-300' : 'bg-zinc-900 border-zinc-800'
        }`}>
          <button
            onClick={() => {
              setActiveTab('split');
              targetPosRef.current = 50;
            }}
            className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'split'
                ? isLight 
                  ? 'bg-white text-zinc-900 shadow-sm border border-zinc-200' 
                  : 'bg-white text-zinc-900 shadow-md'
                : isLight 
                  ? 'text-zinc-600 hover:text-zinc-900' 
                  : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Interactive Split</span>
          </button>

          <button
            onClick={() => setActiveTab('dark')}
            className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'dark'
                ? isLight 
                  ? 'bg-zinc-900 text-white shadow-sm' 
                  : 'bg-white text-zinc-900 shadow-md'
                : isLight 
                  ? 'text-zinc-600 hover:text-zinc-900' 
                  : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Moon className="w-3.5 h-3.5" />
            <span>Dark Theme</span>
          </button>

          <button
            onClick={() => setActiveTab('light')}
            className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'light'
                ? isLight 
                  ? 'bg-zinc-900 text-white shadow-sm' 
                  : 'bg-white text-zinc-900 shadow-md'
                : isLight 
                  ? 'text-zinc-600 hover:text-zinc-900' 
                  : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Sun className="w-3.5 h-3.5" />
            <span>Light Theme</span>
          </button>
        </div>
      </motion.div>

      {/* Main Interactive IDE Window Showcase */}
      <motion.div 
        initial={{ opacity: 0, y: 40, scale: 0.98 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className={`rounded-2xl border shadow-2xl overflow-hidden backdrop-blur-md relative ${
          isLight ? 'bg-white border-zinc-300' : 'bg-[#09090b] border-zinc-800'
        }`}
      >
        {/* Window Chrome Header Bar */}
        <div className={`h-10 px-4 border-b flex items-center justify-between text-xs select-none ${
          isLight ? 'bg-zinc-100 border-zinc-200 text-zinc-700' : 'bg-[#121215] border-zinc-800 text-zinc-300'
        }`}>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
            <span className="font-mono text-[11px] font-bold ml-2">CodeSync IDE — learn.cpp</span>
          </div>

          <div className="flex items-center space-x-2">
            <span className={`text-[10px] uppercase font-bold px-2.5 py-0.5 rounded border flex items-center space-x-1 ${
              isLight ? 'bg-zinc-200 border-zinc-300 text-zinc-800' : 'bg-zinc-800 border-zinc-700 text-zinc-300'
            }`}>
              {activeTab === 'split' ? (
                <>
                  <Sliders className="w-3 h-3" />
                  <span>Interactive Split</span>
                </>
              ) : activeTab === 'dark' ? (
                <>
                  <Moon className="w-3 h-3" />
                  <span>Dark Mode</span>
                </>
              ) : (
                <>
                  <Sun className="w-3 h-3" />
                  <span>Light Mode</span>
                </>
              )}
            </span>
          </div>
        </div>

        {/* IDE Preview Image Container */}
        <div 
          ref={containerRef}
          onMouseMove={handleMouseMove}
          onTouchMove={handleTouchMove}
          className="relative w-full h-[400px] sm:h-[500px] md:h-[580px] overflow-hidden cursor-ew-resize group"
        >
          {/* Base Layer: Light Mode Screenshot */}
          <img 
            src="/ide-light.png" 
            alt="CodeSync Light Theme IDE" 
            className="absolute inset-0 w-full h-full object-cover object-top select-none pointer-events-none" 
          />

          {/* Overlay Layer: Dark Mode Screenshot (Clipped by slider position) */}
          <div 
            className="absolute inset-0 overflow-hidden select-none pointer-events-none"
            style={{
              clipPath: activeTab === 'light' 
                ? 'inset(0 100% 0 0)' 
                : activeTab === 'dark' 
                ? 'inset(0 0% 0 0)' 
                : `inset(0 ${100 - sliderPos}% 0 0)`
            }}
          >
            <img 
              src="/ide-dark.png" 
              alt="CodeSync Dark Theme IDE" 
              className="w-full h-full object-cover object-top select-none pointer-events-none" 
            />
          </div>

          {/* Smooth Vertical Split Divider (Only in 'split' mode) */}
          {activeTab === 'split' && (
            <div 
              className="absolute top-0 bottom-0 w-0.5 bg-white shadow-2xl z-30 pointer-events-none flex items-center justify-center"
              style={{ left: `${sliderPos}%` }}
            >
              <div className={`w-8 h-8 rounded-full border shadow-xl flex items-center justify-center font-bold text-xs ${
                isLight ? 'bg-zinc-900 text-white border-zinc-700' : 'bg-white text-zinc-900 border-zinc-200'
              }`}>
                <Sliders className="w-3.5 h-3.5 rotate-90" />
              </div>
            </div>
          )}

          {/* Floating Theme Badges (Clean Lucide icons, no text emojis!) */}
          <div className="absolute top-4 left-4 z-20 flex items-center space-x-2 pointer-events-none">
            <span className="bg-black/80 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1 rounded-full border border-white/20 shadow-lg flex items-center space-x-1.5">
              <Moon className="w-3 h-3 text-zinc-300" />
              <span>Dark Theme</span>
            </span>
          </div>

          <div className="absolute top-4 right-4 z-20 flex items-center space-x-2 pointer-events-none">
            <span className="bg-white/90 backdrop-blur-md text-zinc-900 text-[11px] font-bold px-3 py-1 rounded-full border border-zinc-300 shadow-lg flex items-center space-x-1.5">
              <Sun className="w-3 h-3 text-zinc-700" />
              <span>Light Theme</span>
            </span>
          </div>

          {/* Drag Instruction Banner */}
          {activeTab === 'split' && (
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 bg-black/80 backdrop-blur-md text-white text-xs font-semibold px-4 py-1.5 rounded-full border border-white/20 shadow-2xl pointer-events-none flex items-center space-x-2">
              <Sliders className="w-3.5 h-3.5 text-zinc-400" />
              <span>Move mouse horizontally to compare Light & Dark themes</span>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default ThemeShowcase;
