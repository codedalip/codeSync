import React, { useState, useRef, useEffect } from 'react';
import { useWorkspaceStore } from '../../stores/useWorkspaceStore';
import { useThemeStore } from '../../stores/useThemeStore';
import { 
  Terminal as TerminalIcon, 
  TerminalSquare, 
  X, 
  Clock, 
  Cpu, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  Loader2,
  Trash2
} from 'lucide-react';

const TerminalPanel = ({ isOpen = true, onClose }) => {
  const { execution, setStdin, setExecutionTab, clearExecutionOutput } = useWorkspaceStore();
  const { theme } = useThemeStore();

  const [panelHeight, setPanelHeight] = useState(240);
  const isDraggingRef = useRef(false);
  const startYRef = useRef(0);
  const startHeightRef = useRef(240);
  const outputContainerRef = useRef(null);

  const isLight = theme === 'light';

  // Auto-scroll to bottom when output or error changes
  useEffect(() => {
    if (outputContainerRef.current) {
      outputContainerRef.current.scrollTop = outputContainerRef.current.scrollHeight;
    }
  }, [execution.output, execution.error, execution.isExecuting]);

  const handleMouseDown = (e) => {
    isDraggingRef.current = true;
    startYRef.current = e.clientY;
    startHeightRef.current = panelHeight;
    document.body.style.cursor = 'row-resize';
    document.body.style.userSelect = 'none';

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = (e) => {
    if (!isDraggingRef.current) return;
    const deltaY = startYRef.current - e.clientY;
    const newHeight = Math.max(120, Math.min(600, startHeightRef.current + deltaY));
    setPanelHeight(newHeight);
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
    window.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('mouseup', handleMouseUp);
  };

  if (!isOpen) return null;

  const getStatusBadge = () => {
    if (!execution.status) return null;

    switch (execution.status) {
      case 'SUCCESS':
        return (
          <span className="flex items-center space-x-1 text-green-500 text-xs font-semibold bg-green-500/10 px-2 py-0.5 rounded border border-green-500/20">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Passed (Code 0)</span>
          </span>
        );
      case 'COMPILE_ERROR':
        return (
          <span className="flex items-center space-x-1 text-red-500 text-xs font-semibold bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20">
            <XCircle className="w-3.5 h-3.5" />
            <span>Compilation Error</span>
          </span>
        );
      case 'RUNTIME_ERROR':
        return (
          <span className="flex items-center space-x-1 text-amber-500 text-xs font-semibold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Runtime Error</span>
          </span>
        );
      case 'TIMEOUT':
        return (
          <span className="flex items-center space-x-1 text-purple-500 text-xs font-semibold bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
            <Clock className="w-3.5 h-3.5" />
            <span>Time Limit Exceeded</span>
          </span>
        );
      default:
        return (
          <span className="flex items-center space-x-1 text-zinc-500 text-xs font-semibold bg-zinc-500/10 px-2 py-0.5 rounded border border-zinc-500/20">
            <span>{execution.status}</span>
          </span>
        );
    }
  };

  return (
    <div
      style={{ height: `${panelHeight}px` }}
      className={`border-t flex flex-col w-full select-none z-20 transition-colors ${
        isLight ? 'bg-white border-zinc-200 text-zinc-900' : 'bg-[#0e0e11] border-zinc-800 text-zinc-100'
      }`}
    >
      {/* Draggable Resize Bar */}
      <div
        onMouseDown={handleMouseDown}
        className={`h-1.5 cursor-row-resize transition-colors w-full ${
          isLight ? 'bg-zinc-200 hover:bg-zinc-400' : 'bg-zinc-800 hover:bg-zinc-600'
        }`}
        title="Drag to resize terminal panel"
      />

      {/* Terminal Header & Navigation */}
      <div className={`h-9 px-3 border-b flex items-center justify-between text-xs ${
        isLight ? 'bg-zinc-100 border-zinc-200' : 'bg-[#18181c] border-zinc-800'
      }`}>
        {/* Tabs */}
        <div className="flex items-center space-x-1">
          <button
            onClick={() => setExecutionTab('output')}
            className={`px-3 py-1.5 rounded-t text-xs font-semibold flex items-center space-x-1.5 transition-colors ${
              execution.activeTab === 'output'
                ? isLight
                  ? 'bg-white text-zinc-900 border-t-2 border-zinc-900'
                  : 'bg-[#0e0e11] text-white border-t-2 border-white'
                : isLight
                  ? 'text-zinc-500 hover:text-zinc-900'
                  : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <TerminalIcon className="w-3.5 h-3.5" />
            <span>Output</span>
          </button>

          <button
            onClick={() => setExecutionTab('stdin')}
            className={`px-3 py-1.5 rounded-t text-xs font-semibold flex items-center space-x-1.5 transition-colors ${
              execution.activeTab === 'stdin'
                ? isLight
                  ? 'bg-white text-zinc-900 border-t-2 border-zinc-900'
                  : 'bg-[#0e0e11] text-white border-t-2 border-white'
                : isLight
                  ? 'text-zinc-500 hover:text-zinc-900'
                  : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <TerminalSquare className="w-3.5 h-3.5" />
            <span>Input (Stdin)</span>
          </button>
        </div>

        {/* Diagnostics & Controls */}
        <div className="flex items-center space-x-3">
          {getStatusBadge()}

          {(execution.output || execution.error) && (
            <button
              onClick={clearExecutionOutput}
              className={`p-1 rounded transition-colors ${
                isLight ? 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-200' : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
              }`}
              title="Clear Terminal Output"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            onClick={onClose}
            className={`p-1 rounded transition-colors ${
              isLight ? 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-200' : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
            }`}
            title="Close Terminal Panel"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Terminal Content Body */}
      <div ref={outputContainerRef} className="flex-1 p-3 overflow-y-auto font-mono text-xs select-text">
        {execution.activeTab === 'output' ? (
          <div>
            {execution.isExecuting ? (
              <div className="flex items-center space-x-2 text-zinc-500 dark:text-zinc-400 py-4">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Executing code...</span>
              </div>
            ) : execution.error ? (
              <div className="space-y-2">
                <div className="text-red-500 font-semibold uppercase tracking-wider text-[11px]">
                  Execution Error / Diagnostics:
                </div>
                <pre className="text-red-500 bg-red-500/10 p-3 rounded border border-red-500/20 whitespace-pre-wrap font-mono">
                  {execution.error}
                </pre>
                {execution.output && (
                  <div className="pt-2">
                    <div className="text-zinc-500 font-semibold uppercase tracking-wider text-[11px]">
                      Standard Output:
                    </div>
                    <pre className={`whitespace-pre-wrap font-mono pt-1 ${isLight ? 'text-zinc-800' : 'text-zinc-200'}`}>
                      {execution.output}
                    </pre>
                  </div>
                )}
              </div>
            ) : execution.output ? (
              <pre className={`whitespace-pre-wrap font-mono leading-relaxed ${isLight ? 'text-zinc-900' : 'text-zinc-100'}`}>
                {execution.output}
              </pre>
            ) : (
              <div className={`italic py-4 ${isLight ? 'text-zinc-500' : 'text-zinc-500'}`}>
                Click "Run Code" in the navbar to execute the active file. Output and compiler logs will be displayed here.
              </div>
            )}
          </div>
        ) : (
          <div className="h-full flex flex-col space-y-2">
            <label className={`text-xs font-semibold uppercase tracking-wider ${isLight ? 'text-zinc-600' : 'text-zinc-400'}`}>
              Standard Input (Stdin)
            </label>
            <textarea
              value={execution.stdin}
              onChange={(e) => setStdin(e.target.value)}
              placeholder="Provide test inputs here (e.g. 5\n10 20 30)..."
              className={`flex-1 w-full p-3 rounded font-mono text-xs resize-none border focus:outline-none ${
                isLight 
                  ? 'bg-zinc-50 border-zinc-300 text-zinc-900 focus:border-zinc-900' 
                  : 'bg-zinc-900 border-zinc-800 text-zinc-100 focus:border-zinc-600'
              }`}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default TerminalPanel;
