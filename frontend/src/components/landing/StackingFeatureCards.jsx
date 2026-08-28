import React from 'react';
import { motion } from 'framer-motion';
import { useThemeStore } from '../../stores/useThemeStore';
import { 
  Users, 
  Terminal, 
  MessageSquare, 
  Sparkles, 
  Cpu, 
  ShieldCheck
} from 'lucide-react';

const cards = [
  {
    id: 1,
    icon: Users,
    badge: 'Operational Transformation',
    title: 'Real-Time Multi-User Cursor Sync',
    description: 'Collaborate live in the exact same file. See multi-user remote cursors, selections, and typing tags instantly with zero cursor displacement or line drift.',
    preview: (isLight) => (
      <div className={`p-4 rounded-xl font-mono text-xs space-y-2 border ${
        isLight ? 'bg-zinc-50 border-zinc-200 text-zinc-800' : 'bg-[#121215] border-zinc-800 text-zinc-300'
      }`}>
        <div className="flex items-center justify-between pb-2 border-b border-zinc-200 dark:border-zinc-800 text-[10px] text-zinc-500">
          <span>learn.cpp</span>
          <span className="flex items-center space-x-1 text-emerald-500 font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
            <span>2 Active Collaborators</span>
          </span>
        </div>
        <div className="relative pt-1 space-y-1.5">
          <div className="flex items-center space-x-2">
            <span className="text-zinc-400">1</span>
            <span className="text-purple-500 dark:text-purple-400">#include</span>
            <span className="text-amber-500">&lt;iostream&gt;</span>
          </div>
          <div className="flex items-center space-x-2 relative">
            <span className="text-zinc-400">2</span>
            <span className="text-blue-500">int</span>
            <span className="text-emerald-500 font-bold">main()</span>
            <span>&#123;</span>
            <motion.span 
              animate={{ x: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="relative inline-block ml-1"
            >
              <span className="w-0.5 h-4 bg-emerald-500 inline-block align-middle" />
              <span className="absolute -top-4 left-0 bg-emerald-500 text-white text-[9px] font-bold px-1.5 py-0.2 rounded shadow">
                Rohit
              </span>
            </motion.span>
          </div>
          <div className="flex items-center space-x-2 pl-4">
            <span className="text-zinc-400">3</span>
            <span className="text-zinc-500">std::cout &lt;&lt; "Hello World!";</span>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 2,
    icon: Terminal,
    badge: 'Native Sandbox Compiler',
    title: 'Integrated Multi-Language Terminal',
    description: 'Compile and execute C++, Python, JavaScript, and Java directly in the browser with live STDIN/STDOUT stream outputs and compiler logs.',
    preview: (isLight) => (
      <div className={`p-4 rounded-xl font-mono text-xs space-y-2 border ${
        isLight ? 'bg-zinc-900 border-zinc-800 text-zinc-100' : 'bg-black border-zinc-800 text-zinc-200'
      }`}>
        <div className="flex items-center justify-between pb-2 border-b border-zinc-800 text-[10px] text-zinc-400">
          <span className="flex items-center space-x-1.5">
            <Terminal className="w-3.5 h-3.5 text-emerald-400" />
            <span>Terminal — Output</span>
          </span>
          <span className="text-emerald-400 font-bold">● Exit Code: 0</span>
        </div>
        <div className="space-y-1.5 pt-1 text-[11px]">
          <div className="text-zinc-400">$ g++ learn.cpp -o main && ./main</div>
          <div className="text-white font-bold">$ hello world</div>
          <div className="text-zinc-400">$ n * 22 = 44</div>
          <div className="flex items-center space-x-2 text-emerald-400 text-[10px] pt-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Execution Clean Success</span>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 3,
    icon: MessageSquare,
    badge: 'Workspace Room Streams',
    title: 'Instant Team Chat & Room Sharing',
    description: 'Stay connected with dedicated workspace chat channels, real-time message alignment, active user presence avatars, and dynamic room join codes.',
    preview: (isLight) => (
      <div className={`p-4 rounded-xl text-xs space-y-2.5 border ${
        isLight ? 'bg-zinc-50 border-zinc-200' : 'bg-[#121215] border-zinc-800'
      }`}>
        <div className="flex items-center justify-between text-[10px] text-zinc-500 pb-1 border-b border-zinc-200 dark:border-zinc-800">
          <span className="font-bold text-zinc-700 dark:text-zinc-300">Room Chat — #dev-room</span>
          <span>2 messages</span>
        </div>
        <div className="space-y-2">
          <div className="flex items-start space-x-2">
            <div className="w-5 h-5 rounded-full bg-zinc-800 text-white text-[10px] font-bold flex items-center justify-center">A</div>
            <div className={`p-2 rounded-lg text-[11px] max-w-[80%] ${
              isLight ? 'bg-white border border-zinc-200 text-zinc-800' : 'bg-zinc-800 text-zinc-200'
            }`}>
              Added vector optimization in line 12!
            </div>
          </div>
          <div className="flex items-start space-x-2 justify-end">
            <div className={`p-2 rounded-lg text-[11px] max-w-[80%] ${
              isLight ? 'bg-zinc-900 text-white' : 'bg-white text-zinc-900 font-medium'
            }`}>
              Looks great! Compiling now.
            </div>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 4,
    icon: Sparkles,
    badge: 'AI Powered Assistance',
    title: 'Integrated Gemini AI Co-Pilot',
    description: 'Ask questions, debug errors, refactor algorithms, and generate high-performance code snippets directly inside your IDE sidebar panel.',
    preview: (isLight) => (
      <div className={`p-4 rounded-xl text-xs space-y-2 border ${
        isLight ? 'bg-zinc-50 border-zinc-200' : 'bg-[#121215] border-zinc-800'
      }`}>
        <div className="flex items-center space-x-2 text-[11px] font-bold text-purple-600 dark:text-purple-400">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Gemini AI Assistant</span>
        </div>
        <div className={`p-2.5 rounded-lg text-[11px] font-mono leading-relaxed border ${
          isLight ? 'bg-white border-zinc-200 text-zinc-800' : 'bg-zinc-900 border-zinc-800 text-zinc-300'
        }`}>
          <span className="text-purple-500 font-bold">// AI Suggestion:</span> Use unordered_map for O(1) average lookup speed.
        </div>
      </div>
    )
  }
];

const StackingFeatureCards = () => {
  const { theme } = useThemeStore();
  const isLight = theme === 'light';

  return (
    <div className="w-full space-y-12 my-20">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.6 }}
        className="text-center space-y-3 max-w-2xl mx-auto"
      >
        <div className={`inline-flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider ${
          isLight ? 'text-zinc-600' : 'text-zinc-400'
        }`}>
          <Cpu className="w-3.5 h-3.5" />
          <span>Core Capabilities</span>
        </div>
        <h2 className={`text-3xl sm:text-4xl font-extrabold tracking-tight ${
          isLight ? 'text-zinc-900' : 'text-white'
        }`}>
          Built for Pair Programming
        </h2>
        <p className={`text-sm sm:text-base leading-relaxed ${
          isLight ? 'text-zinc-600' : 'text-zinc-400'
        }`}>
          Scroll down to reveal how CodeSync empowers team collaboration in real time.
        </p>
      </motion.div>

      {/* 3D Stacking Cards Deck Container with Alternating Entrance Animations */}
      <div className="relative space-y-10 pb-20 max-w-4xl mx-auto overflow-visible">
        {cards.map((card, index) => {
          const IconComp = card.icon;
          const isEven = index % 2 === 0;

          return (
            <div 
              key={card.id} 
              className="sticky top-28 transition-all"
              style={{ zIndex: 10 + index }}
            >
              <motion.div 
                initial={{ 
                  opacity: 0, 
                  x: isEven ? -160 : 160,
                  rotateY: isEven ? -22 : 22,
                  scale: 0.84,
                  rotateZ: isEven ? -3 : 3
                }}
                whileInView={{ 
                  opacity: 1, 
                  x: 0,
                  rotateY: 0,
                  scale: 1,
                  rotateZ: 0
                }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ 
                  duration: 0.75, 
                  ease: [0.22, 1, 0.36, 1] 
                }}
                className={`rounded-2xl border p-6 sm:p-10 shadow-2xl transition-all transform-gpu ${
                  isLight 
                    ? 'bg-white border-zinc-300 text-zinc-900 shadow-zinc-300/50' 
                    : 'bg-[#0c0c0e] border-zinc-800 text-zinc-100 shadow-black/90'
                }`}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${
                        isLight 
                          ? 'bg-zinc-900 text-white border-zinc-900' 
                          : 'bg-white text-zinc-900 border-white'
                      }`}>
                        <IconComp className="w-5 h-5" />
                      </div>
                      <span className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${
                        isLight 
                          ? 'bg-zinc-100 border-zinc-300 text-zinc-700' 
                          : 'bg-zinc-900 border-zinc-800 text-zinc-400'
                      }`}>
                        {card.badge}
                      </span>
                    </div>

                    <h3 className={`text-xl sm:text-2xl font-extrabold tracking-tight ${
                      isLight ? 'text-zinc-900' : 'text-white'
                    }`}>
                      {card.title}
                    </h3>
                    <p className={`text-xs sm:text-sm leading-relaxed ${
                      isLight ? 'text-zinc-600' : 'text-zinc-400'
                    }`}>
                      {card.description}
                    </p>
                  </div>

                  {/* Interactive Visual Preview */}
                  <div>
                    {card.preview(isLight)}
                  </div>
                </div>
              </motion.div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StackingFeatureCards;
