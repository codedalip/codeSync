import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useThemeStore } from '../../stores/useThemeStore';
import { Play, Check, Terminal, Code2, Sparkles } from 'lucide-react';

const SAMPLE_CODES = {
  cpp: {
    lang: 'C++',
    file: 'learn.cpp',
    code: `#include <vector>
#include <unordered_map>
#include <iostream>
using namespace std;

vector<int> twoSum(vector<int>& nums, int target) {
    unordered_map<int, int> numMap;
    for (int i = 0; i < nums.size(); ++i) {
        int complement = target - nums[i];
        if (numMap.count(complement)) {
            return {numMap[complement], i};
        }
        numMap[nums[i]] = i;
    }
    return {};
}

int main() {
    cout << "Executing CodeSync C++ Compiler..." << endl;
    vector<int> nums = {2, 7, 11, 15};
    vector<int> res = twoSum(nums, 9);
    cout << "TwoSum Indices Result: [" << res[0] << ", " << res[1] << "]" << endl;
    return 0;
}`,
    output: `Executing CodeSync C++ Compiler...
TwoSum Indices Result: [0, 1]
✔ Process exited with code 0 in 14ms`
  },
  javascript: {
    lang: 'JavaScript',
    file: 'main.js',
    code: `// Real-Time Collaborative Stream
async function fetchRoomCollaborators(workspaceId) {
    console.log(\`Connecting to Workspace Room stream: \${workspaceId}\`);
    const users = [
        { name: "Rohit", role: "Driver", status: "online" },
        { name: "Alex", role: "Navigator", status: "online" }
    ];
    
    users.forEach(user => {
        console.log(\`[ACTIVE] \${user.name} (\${user.role}) - Cursor Synced\`);
    });
    return users;
}

fetchRoomCollaborators("CS-601025");`,
    output: `Connecting to Workspace Room stream: CS-601025
[ACTIVE] Rohit (Driver) - Cursor Synced
[ACTIVE] Alex (Navigator) - Cursor Synced
✔ Process exited with code 0 in 8ms`
  },
  python: {
    lang: 'Python',
    file: 'algo.py',
    code: `# Multi-User Data Stream Processor
def calculate_matrix_latency(stream_nodes):
    print("Evaluating CodeSync Socket Stream Latency...")
    latencies = [12, 14, 18, 15]
    avg_latency = sum(latencies) / len(latencies)
    print(f"Average Stream Latency: {avg_latency:.2f}ms")
    return avg_latency

calculate_matrix_latency(4)`,
    output: `Evaluating CodeSync Socket Stream Latency...
Average Stream Latency: 14.75ms
✔ Process exited with code 0 in 11ms`
  }
};

const LiveCodePreview = () => {
  const { theme } = useThemeStore();
  const isLight = theme === 'light';

  const [activeLang, setActiveLang] = useState('cpp');
  const [isRunning, setIsRunning] = useState(false);
  const [showOutput, setShowOutput] = useState(true);

  const sample = SAMPLE_CODES[activeLang];

  const handleRun = () => {
    setIsRunning(true);
    setShowOutput(false);
    setTimeout(() => {
      setIsRunning(false);
      setShowOutput(true);
    }, 600);
  };

  return (
    <div className="w-full space-y-8 my-20">
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
          <Code2 className="w-3.5 h-3.5" />
          <span>Interactive Sandbox</span>
        </div>
        <h2 className={`text-3xl sm:text-4xl font-extrabold tracking-tight ${
          isLight ? 'text-zinc-900' : 'text-white'
        }`}>
          Experience the Editor Live
        </h2>
        <p className={`text-sm sm:text-base leading-relaxed ${
          isLight ? 'text-zinc-600' : 'text-zinc-400'
        }`}>
          Select a language below and simulate immediate compilation output right on the landing page.
        </p>
      </motion.div>

      {/* Main Interactive Editor Box */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.7 }}
        className={`rounded-2xl border shadow-2xl overflow-hidden backdrop-blur-md ${
          isLight ? 'bg-white border-zinc-300' : 'bg-[#09090b] border-zinc-800'
        }`}
      >
        {/* Language Tabs & Run Bar */}
        <div className={`px-4 py-2.5 border-b flex flex-wrap items-center justify-between gap-3 text-xs ${
          isLight ? 'bg-zinc-100 border-zinc-200' : 'bg-[#121215] border-zinc-800'
        }`}>
          {/* Language Selector */}
          <div className="flex items-center space-x-1.5">
            {Object.keys(SAMPLE_CODES).map((langKey) => (
              <button
                key={langKey}
                onClick={() => {
                  setActiveLang(langKey);
                  setShowOutput(true);
                }}
                className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-all ${
                  activeLang === langKey
                    ? isLight 
                      ? 'bg-zinc-900 text-white shadow' 
                      : 'bg-white text-zinc-900 shadow'
                    : isLight 
                      ? 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/60' 
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
                }`}
              >
                {SAMPLE_CODES[langKey].lang}
              </button>
            ))}
          </div>

          {/* Action Run Code Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleRun}
            disabled={isRunning}
            className={`px-4 py-1.5 rounded-lg font-bold text-xs transition-all flex items-center space-x-1.5 shadow ${
              isLight 
                ? 'bg-zinc-900 hover:bg-zinc-800 text-white' 
                : 'bg-white hover:bg-zinc-200 text-zinc-900'
            }`}
          >
            <Play className={`w-3.5 h-3.5 ${isRunning ? 'animate-spin' : ''}`} />
            <span>{isRunning ? 'Compiling...' : `Run ${sample.lang} Code`}</span>
          </motion.button>
        </div>

        {/* Code View & Terminal Output Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x border-zinc-200 dark:divide-zinc-800">
          {/* Code Input (2 cols) */}
          <div className="lg:col-span-2 p-5 font-mono text-xs overflow-x-auto min-h-[260px] leading-relaxed">
            <div className="flex items-center justify-between text-[11px] text-zinc-500 pb-3 border-b border-zinc-200 dark:border-zinc-800 mb-3">
              <span>{sample.file}</span>
              <span className="text-[10px] uppercase font-bold text-zinc-400">Read-Only Preview</span>
            </div>
            <pre className={isLight ? 'text-zinc-800' : 'text-zinc-200'}>
              <code>{sample.code}</code>
            </pre>
          </div>

          {/* Output Terminal (1 col) */}
          <div className={`p-5 font-mono text-xs flex flex-col justify-between ${
            isLight ? 'bg-zinc-950 text-zinc-100' : 'bg-black text-zinc-100'
          }`}>
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-2 text-[11px] text-zinc-400">
                <span className="flex items-center space-x-1.5">
                  <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Output Terminal</span>
                </span>
                <span className="text-[10px] text-emerald-400 font-bold">STDOUT</span>
              </div>

              <AnimatePresence mode="wait">
                {isRunning ? (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-zinc-400 py-4 flex items-center space-x-2"
                  >
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <span>Compiling and executing script...</span>
                  </motion.div>
                ) : showOutput ? (
                  <motion.div 
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-1.5 whitespace-pre-wrap text-emerald-400/90 text-[11px] leading-relaxed"
                  >
                    {sample.output}
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>

            <div className="pt-4 border-t border-zinc-800/80 text-[10px] text-zinc-500 flex items-center justify-between">
              <span>Built with CodeSync Engine</span>
              <span className="flex items-center space-x-1 text-emerald-400 font-bold">
                <Check className="w-3 h-3" />
                <span>Ready</span>
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LiveCodePreview;
