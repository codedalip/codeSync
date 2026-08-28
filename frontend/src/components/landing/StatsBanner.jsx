import React from 'react';
import { motion } from 'framer-motion';
import { useThemeStore } from '../../stores/useThemeStore';
import { Zap, ShieldCheck, Cpu, Globe } from 'lucide-react';

const stats = [
  {
    icon: Zap,
    value: '< 50ms',
    label: 'Real-Time Socket Stream Latency',
    desc: 'Instant Operational Transformation cursor updates'
  },
  {
    icon: Cpu,
    value: '0ms',
    label: 'Local Monaco Editor Overhead',
    desc: 'Native VS Code editing performance in browser'
  },
  {
    icon: ShieldCheck,
    value: '100%',
    label: 'Browser Executable Terminals',
    desc: 'Multi-language C++, Python, JS execution'
  },
  {
    icon: Globe,
    value: '∞',
    label: 'Collaborative Workspace Rooms',
    desc: 'Seamless team room code sharing'
  }
];

const StatsBanner = () => {
  const { theme } = useThemeStore();
  const isLight = theme === 'light';

  return (
    <div className="w-full my-20">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.6 }}
        className={`rounded-2xl border p-8 sm:p-10 backdrop-blur-md shadow-xl ${
          isLight ? 'bg-white/80 border-zinc-300 text-zinc-900' : 'bg-[#09090b]/80 border-zinc-800 text-zinc-100'
        }`}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 divide-y sm:divide-y-0 lg:divide-x divide-zinc-200 dark:divide-zinc-800">
          {stats.map((stat, idx) => {
            const IconComp = stat.icon;
            return (
              <div 
                key={idx} 
                className={`flex flex-col space-y-2 ${idx !== 0 ? 'pt-6 sm:pt-0 lg:pl-8' : ''}`}
              >
                <div className="flex items-center space-x-2">
                  <IconComp className={`w-4 h-4 ${isLight ? 'text-zinc-700' : 'text-zinc-300'}`} />
                  <span className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${
                    isLight ? 'text-zinc-900' : 'text-white'
                  }`}>
                    {stat.value}
                  </span>
                </div>
                <div className={`text-xs font-bold ${isLight ? 'text-zinc-800' : 'text-zinc-200'}`}>
                  {stat.label}
                </div>
                <div className={`text-[11px] leading-relaxed ${isLight ? 'text-zinc-600' : 'text-zinc-400'}`}>
                  {stat.desc}
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};

export default StatsBanner;
