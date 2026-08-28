import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Terminal as TerminalIcon, 
  Sparkles, 
  CheckCircle2, 
  Play, 
  Cpu, 
  Code2, 
  FileCode, 
  Users,
  Zap
} from 'lucide-react';

const codeSnippets = [
  {
    filename: 'collaborate.py',
    language: 'python',
    lines: [
      { text: '# CodeSync Real-Time Pair Programming Session', color: 'text-gray-500' },
      { text: 'from codesync import RoomStream, GeminiAI', color: 'text-purple-400' },
      { text: '', color: '' },
      { text: 'async def sync_pair_session(room_id: str):', color: 'text-blue-400 font-bold' },
      { text: '    session = await RoomStream.connect(room_id)', color: 'text-gray-200' },
      { text: '    print(f"🟢 Connected user: {session.active_user}")', color: 'text-green-300' },
      { text: '    ', color: '' },
      { text: '    # Ask Gemini AI to optimize current code', color: 'text-gray-500' },
      { text: '    ai_reply = await GeminiAI.analyze(session.code)', color: 'text-purple-300' },
      { text: '    return session.broadcast_code(ai_reply)', color: 'text-indigo-300 font-bold' }
    ],
    output: [
      { text: '▶ Running collaborate.py (Python 3.10)...', type: 'info' },
      { text: '⚡ Connected WebSocket Room: CS-87FC82', type: 'success' },
      { text: '🤖 Gemini AI: Code structure validated with 0 syntax errors.', type: 'ai' },
      { text: '✓ Execution finished in 12ms (Memory: 4.2 MB)', type: 'success' }
    ]
  },
  {
    filename: 'server.js',
    language: 'javascript',
    lines: [
      { text: '// CodeSync Socket.IO Room Broadcast Engine', color: 'text-gray-500' },
      { text: 'import { Server } from "socket.io";', color: 'text-purple-400' },
      { text: 'import { GeminiAssistant } from "@codesync/ai";', color: 'text-purple-400' },
      { text: '', color: '' },
      { text: 'io.on("connection", (socket) => {', color: 'text-blue-400 font-bold' },
      { text: '  socket.on("code:stream", ({ room, delta }) => {', color: 'text-gray-200' },
      { text: '    socket.to(room).emit("code:update", delta);', color: 'text-green-300' },
      { text: '    console.log(`[Stream] Synced cursor for ${socket.user}`);', color: 'text-indigo-300' },
      { text: '  });', color: 'text-blue-400' },
      { text: '});', color: 'text-blue-400 font-bold' }
    ],
    output: [
      { text: '▶ Starting CodeSync WebSocket Stream Server...', type: 'info' },
      { text: '🟢 3 Users connected in room CS-87FC82', type: 'success' },
      { text: '⚡ Live remote cursor broadcast active (Latency: 2ms)', type: 'info' },
      { text: '✓ Build compiled cleanly with Vite & Monaco', type: 'success' }
    ]
  }
];

const HeroCodeAnimation = () => {
  const [snippetIndex, setSnippetIndex] = useState(0);
  const [typedLineCount, setTypedLineCount] = useState(1);
  const [isExecuting, setIsExecuting] = useState(false);
  const [showOutput, setShowOutput] = useState(true);

  const currentSnippet = codeSnippets[snippetIndex];

  // Typing simulator effect
  useEffect(() => {
    setTypedLineCount(1);
    setIsExecuting(false);

    const interval = setInterval(() => {
      setTypedLineCount((prev) => {
        if (prev < currentSnippet.lines.length) {
          return prev + 1;
        } else {
          clearInterval(interval);
          setIsExecuting(true);
          return prev;
        }
      });
    }, 400);

    return () => clearInterval(interval);
  }, [snippetIndex]);

  // Switch snippet every 12 seconds
  useEffect(() => {
    const snippetTimer = setInterval(() => {
      setSnippetIndex((prev) => (prev + 1) % codeSnippets.length);
    }, 12000);

    return () => clearInterval(snippetTimer);
  }, []);

  return (
    <div className="relative rounded-2xl bg-[#0f111a]/95 border border-gray-800 shadow-2xl overflow-hidden backdrop-blur-2xl text-left select-none group">
      {/* Glow aura accent */}
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-blue-600/15 rounded-full blur-3xl pointer-events-none group-hover:bg-purple-600/25 transition-all duration-700"></div>

      {/* Top Window Title Bar */}
      <div className="h-10 bg-[#161826] border-b border-gray-800/80 px-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-500/80 hover:bg-red-500 transition-colors"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500/80 hover:bg-yellow-500 transition-colors"></div>
          <div className="w-3 h-3 rounded-full bg-green-500/80 hover:bg-green-500 transition-colors"></div>

          {/* Active File Tab */}
          <div className="ml-3 flex items-center space-x-1.5 bg-[#0f111a] px-3 py-1 rounded-t border-t border-x border-gray-700/60 text-xs font-mono text-gray-200">
            <FileCode className="w-3.5 h-3.5 text-blue-400" />
            <span>{currentSnippet.filename}</span>
          </div>
        </div>

        {/* Online Presence & AI Status */}
        <div className="flex items-center space-x-3">
          <div className="hidden sm:flex items-center space-x-1 bg-purple-500/10 border border-purple-500/20 px-2.5 py-0.5 rounded-full text-[11px] font-semibold text-purple-300">
            <Sparkles className="w-3 h-3 text-purple-400 animate-pulse" />
            <span>Gemini AI Connected</span>
          </div>

          <div className="flex items-center space-x-1.5">
            <div className="flex items-center -space-x-1.5">
              <div className="w-6 h-6 rounded-full bg-blue-600 border border-gray-900 flex items-center justify-center text-[10px] font-bold text-white shadow">R</div>
              <div className="w-6 h-6 rounded-full bg-purple-600 border border-gray-900 flex items-center justify-center text-[10px] font-bold text-white shadow">A</div>
            </div>
            <span className="text-[11px] text-green-400 font-medium bg-green-500/10 px-2 py-0.5 rounded border border-green-500/20 hidden xs:inline">
              🟢 2 Live
            </span>
          </div>
        </div>
      </div>

      {/* Editor Body & Live Animated Lines */}
      <div className="p-4 font-mono text-xs sm:text-sm min-h-[260px] sm:min-h-[300px] relative overflow-hidden bg-[#0c0d14]/90 leading-relaxed">
        {currentSnippet.lines.slice(0, typedLineCount).map((line, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
            className="flex items-center space-x-4 py-0.5 hover:bg-gray-800/30 px-2 rounded group/line relative"
          >
            <span className="w-6 text-gray-600 text-right select-none text-[11px] font-mono">{idx + 1}</span>
            <span className={`${line.color || 'text-gray-200'} whitespace-pre`}>
              {line.text}
            </span>

            {/* Simulated Blinking Typing Caret on active line */}
            {idx === typedLineCount - 1 && (
              <motion.span 
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 0.8, repeat: Infinity }}
                className="w-2 h-4 bg-blue-400 inline-block align-middle ml-1 rounded-sm shadow-sm"
              />
            )}
          </motion.div>
        ))}

        {/* Dynamic Floating Remote Cursors moving smoothly */}
        <motion.div 
          animate={{ 
            x: [20, 180, 140, 220],
            y: [30, 90, 150, 80] 
          }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute pointer-events-none flex items-center space-x-1 bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-2xl z-20"
        >
          <div className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></div>
          <span>Rahul (typing...)</span>
        </motion.div>

        <motion.div 
          animate={{ 
            x: [220, 100, 240, 160],
            y: [160, 60, 190, 120] 
          }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          className="absolute pointer-events-none flex items-center space-x-1 bg-purple-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-2xl z-20"
        >
          <div className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></div>
          <span>Aman</span>
        </motion.div>
      </div>

      {/* Terminal Panel Bar at Bottom */}
      <div className="bg-[#121420] border-t border-gray-800/80 p-3">
        <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
          <div className="flex items-center space-x-2">
            <TerminalIcon className="w-3.5 h-3.5 text-blue-400" />
            <span className="font-bold text-gray-300 font-mono text-[11px]">OUTPUT TERMINAL</span>
            {isExecuting && (
              <span className="flex items-center space-x-1 text-green-400 text-[10px] bg-green-500/10 px-2 py-0.5 rounded border border-green-500/20 font-mono">
                <Zap className="w-3 h-3 animate-spin" />
                <span>EXECUTING</span>
              </span>
            )}
          </div>
          <button 
            onClick={() => setShowOutput(!showOutput)} 
            className="hover:text-white transition-colors text-[11px]"
          >
            {showOutput ? 'Hide Output' : 'Show Output'}
          </button>
        </div>

        <AnimatePresence>
          {showOutput && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="space-y-1 font-mono text-[11px]"
            >
              {currentSnippet.output.map((out, oIdx) => (
                <div 
                  key={oIdx}
                  className={`flex items-center space-x-2 ${
                    out.type === 'success' 
                      ? 'text-green-400' 
                      : out.type === 'ai' 
                      ? 'text-purple-300 font-semibold' 
                      : 'text-blue-300'
                  }`}
                >
                  {out.type === 'success' && <CheckCircle2 className="w-3 h-3 text-green-400 flex-shrink-0" />}
                  {out.type === 'ai' && <Sparkles className="w-3 h-3 text-purple-400 flex-shrink-0 animate-pulse" />}
                  {out.type === 'info' && <Play className="w-3 h-3 text-blue-400 flex-shrink-0" />}
                  <span>{out.text}</span>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default HeroCodeAnimation;
