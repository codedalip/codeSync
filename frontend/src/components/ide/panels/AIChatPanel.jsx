import React, { useState, useRef, useEffect } from 'react';
import { useWorkspaceStore } from '../../../stores/useWorkspaceStore';
import { useThemeStore } from '../../../stores/useThemeStore';
import api from '../../../services/api';
import { 
  Bot, 
  Sparkles, 
  Send, 
  Code2, 
  Bug, 
  Cpu, 
  Check, 
  Copy, 
  Loader2, 
  CornerDownLeft, 
  FileCode,
  ArrowRightLeft,
  X
} from 'lucide-react';

const FormattedAIMessage = ({ content, onApplyCode, isLight }) => {
  if (!content) return null;
  const parts = content.split(/(```[\s\S]*?```)/g);

  return (
    <div className={`space-y-2 text-xs leading-relaxed font-sans ${isLight ? 'text-zinc-800' : 'text-zinc-200'}`}>
      {parts.map((part, index) => {
        if (part.startsWith('```') && part.endsWith('```')) {
          const firstLineEnd = part.indexOf('\n');
          const language = part.slice(3, firstLineEnd).trim() || 'code';
          const code = part.slice(firstLineEnd + 1, -3).trim();

          return (
            <div key={index} className={`my-2 rounded-lg border overflow-hidden font-mono text-[11px] ${
              isLight ? 'bg-zinc-50 border-zinc-300' : 'bg-[#14151f] border-zinc-800'
            }`}>
              <div className={`px-3 py-1 border-b flex items-center justify-between text-[10px] ${
                isLight ? 'bg-zinc-200/70 border-zinc-300 text-zinc-700' : 'bg-[#1e1e1e] border-zinc-800 text-zinc-400'
              }`}>
                <span className="font-semibold uppercase">{language}</span>
                {onApplyCode && (
                  <button
                    onClick={() => onApplyCode(code)}
                    className={`flex items-center space-x-1 px-2 py-0.5 rounded transition-colors font-bold ${
                      isLight ? 'bg-zinc-900 text-white hover:bg-zinc-800' : 'bg-white text-zinc-900 hover:bg-zinc-200'
                    }`}
                  >
                    <ArrowRightLeft className="w-3 h-3" />
                    <span>Apply</span>
                  </button>
                )}
              </div>
              <pre className={`p-2.5 overflow-x-auto whitespace-pre leading-relaxed font-mono ${
                isLight ? 'text-zinc-900 bg-white' : 'text-zinc-200 bg-[#0e0e11]'
              }`}>
                {code}
              </pre>
            </div>
          );
        }

        const lines = part.split('\n');
        return (
          <div key={index} className="space-y-1">
            {lines.map((line, lIdx) => {
              if (!line.trim()) return null;

              if (line.startsWith('### ') || line.startsWith('## ') || line.startsWith('# ')) {
                const headerText = line.replace(/^#+\s*/, '').replace(/\*\*/g, '');
                return (
                  <h4 key={lIdx} className={`font-bold text-xs pt-1 ${isLight ? 'text-zinc-900' : 'text-white'}`}>
                    {headerText}
                  </h4>
                );
              }

              if (line.trim().startsWith('* ') || line.trim().startsWith('- ')) {
                const bulletContent = line.trim().substring(2);
                return (
                  <div key={lIdx} className="flex items-start space-x-1.5 pl-1">
                    <span className="text-zinc-500 font-bold">•</span>
                    <span>{renderFormattedInlineText(bulletContent, isLight)}</span>
                  </div>
                );
              }

              return <p key={lIdx}>{renderFormattedInlineText(line, isLight)}</p>;
            })}
          </div>
        );
      })}
    </div>
  );
};

const renderFormattedInlineText = (text, isLight) => {
  const parts = text.split(/(\*\*.*?\*\*|`.*?`)/g);

  return parts.map((segment, i) => {
    if (segment.startsWith('**') && segment.endsWith('**')) {
      return (
        <strong key={i} className={`font-bold ${isLight ? 'text-zinc-900' : 'text-white'}`}>
          {segment.slice(2, -2)}
        </strong>
      );
    }
    if (segment.startsWith('`') && segment.endsWith('`')) {
      return (
        <code key={i} className={`px-1 py-0.5 rounded font-mono text-[11px] border ${
          isLight ? 'bg-zinc-100 border-zinc-300 text-zinc-900' : 'bg-zinc-800 border-zinc-700 text-zinc-200'
        }`}>
          {segment.slice(1, -1)}
        </code>
      );
    }
    return segment;
  });
};

const AIChatPanel = ({ onClose }) => {
  const { files, activeFileId, updateFileContentLocally } = useWorkspaceStore();
  const { theme } = useThemeStore();
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: 'Hello! I am **Gemini AI**, your collaborative coding assistant. Ask me questions about your workspace code, ask for bug fixes, or request refactoring!',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputPrompt, setInputPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [includeContext, setIncludeContext] = useState(true);
  const [copiedIndex, setCopiedIndex] = useState(null);

  const messagesEndRef = useRef(null);
  const activeFile = files.find((f) => f._id === activeFileId);
  const isLight = theme === 'light';

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isGenerating]);

  const handleSendMessage = async (customPrompt = null) => {
    const text = customPrompt || inputPrompt;
    if (!text.trim() || isGenerating) return;

    const userMsg = {
      sender: 'user',
      text: text.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!customPrompt) setInputPrompt('');
    setIsGenerating(true);

    try {
      const res = await api.post('/ai/chat', {
        prompt: text.trim(),
        codeContext: includeContext && activeFile ? activeFile.content : '',
        activeFileName: activeFile?.name || '',
        activeFileLanguage: activeFile?.language || ''
      });

      const aiMsg = {
        sender: 'ai',
        text: res.data?.reply || 'Received response from Gemini AI.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error('[Gemini AI Chat Error]', err);
      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: '⚠️ **Error**: Failed to connect to Gemini AI assistant. Please check your internet connection or backend server.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyText = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleInsertIntoEditor = (text) => {
    if (!activeFileId) {
      alert('Please open a file in the editor first!');
      return;
    }
    let codeToInsert = text;
    const match = text.match(/```(?:\w+)?\n([\s\S]*?)```/);
    if (match && match[1]) {
      codeToInsert = match[1];
    }
    updateFileContentLocally(activeFileId, codeToInsert);
  };

  return (
    <div className={`w-full flex flex-col h-full select-none transition-colors ${
      isLight ? 'bg-white text-zinc-900' : 'bg-[#0e0e11] text-zinc-100'
    }`}>
      {/* Header Bar */}
      <div className={`h-10 px-3 border-b flex items-center justify-between text-xs font-semibold ${
        isLight ? 'bg-zinc-100 border-zinc-200 text-zinc-800' : 'bg-[#18181c] border-zinc-800 text-zinc-200'
      }`}>
        <div className="flex items-center space-x-2">
          <Sparkles className="w-4 h-4" />
          <span className="uppercase tracking-wider">Gemini AI Assistant</span>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className={`p-1 rounded transition-colors ${
              isLight ? 'hover:bg-zinc-200 text-zinc-600' : 'hover:bg-zinc-800 text-zinc-400'
            }`}
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Quick Prompt Action Pills */}
      <div className={`p-2 border-b flex items-center space-x-1.5 overflow-x-auto text-[11px] ${
        isLight ? 'bg-zinc-50 border-zinc-200' : 'bg-zinc-900/60 border-zinc-800'
      }`}>
        <button
          onClick={() => handleSendMessage(`Explain how the code in ${activeFile?.name || 'this file'} works.`)}
          disabled={!activeFile}
          className={`flex items-center space-x-1 px-2.5 py-1 rounded-full border transition-all flex-shrink-0 disabled:opacity-50 ${
            isLight 
              ? 'bg-white hover:bg-zinc-200 border-zinc-300 text-zinc-800' 
              : 'bg-zinc-900 hover:bg-zinc-800 border-zinc-700 text-zinc-200'
          }`}
        >
          <Code2 className="w-3 h-3" />
          <span>Explain Code</span>
        </button>

        <button
          onClick={() => handleSendMessage(`Analyze ${activeFile?.name || 'active code'} for bugs, logical flaws, or edge case errors.`)}
          disabled={!activeFile}
          className={`flex items-center space-x-1 px-2.5 py-1 rounded-full border transition-all flex-shrink-0 disabled:opacity-50 ${
            isLight 
              ? 'bg-white hover:bg-zinc-200 border-zinc-300 text-zinc-800' 
              : 'bg-zinc-900 hover:bg-zinc-800 border-zinc-700 text-zinc-200'
          }`}
        >
          <Bug className="w-3 h-3" />
          <span>Fix Bugs</span>
        </button>

        <button
          onClick={() => handleSendMessage(`Refactor and optimize performance for ${activeFile?.name || 'this file'}.`)}
          disabled={!activeFile}
          className={`flex items-center space-x-1 px-2.5 py-1 rounded-full border transition-all flex-shrink-0 disabled:opacity-50 ${
            isLight 
              ? 'bg-white hover:bg-zinc-200 border-zinc-300 text-zinc-800' 
              : 'bg-zinc-900 hover:bg-zinc-800 border-zinc-700 text-zinc-200'
          }`}
        >
          <Cpu className="w-3 h-3" />
          <span>Optimize</span>
        </button>
      </div>

      {/* Messages Stream */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex flex-col space-y-1 ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div className="flex items-center space-x-1.5 text-[10px] text-zinc-500 px-1">
              <span className="font-bold capitalize">{msg.sender === 'user' ? 'You' : 'Gemini AI'}</span>
              <span>•</span>
              <span>{msg.time}</span>
            </div>

            <div
              className={`p-3 rounded-xl max-w-[90%] text-xs shadow-sm relative group border ${
                msg.sender === 'user'
                  ? isLight
                    ? 'bg-zinc-900 text-white border-zinc-900'
                    : 'bg-white text-zinc-900 border-white font-medium'
                  : isLight
                    ? 'bg-zinc-100 border-zinc-200 text-zinc-900'
                    : 'bg-zinc-900 border-zinc-800 text-zinc-100'
              }`}
            >
              {msg.sender === 'ai' ? (
                <FormattedAIMessage content={msg.text} onApplyCode={handleInsertIntoEditor} isLight={isLight} />
              ) : (
                <p className="whitespace-pre-wrap">{msg.text}</p>
              )}

              {/* Message Quick Copy */}
              <button
                onClick={() => handleCopyText(msg.text, idx)}
                className={`absolute top-2 right-2 opacity-0 group-hover:opacity-100 p-1 rounded transition-opacity ${
                  isLight ? 'bg-zinc-200 text-zinc-800' : 'bg-zinc-800 text-zinc-200'
                }`}
                title="Copy response"
              >
                {copiedIndex === idx ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
              </button>
            </div>
          </div>
        ))}

        {isGenerating && (
          <div className="flex items-center space-x-2 text-zinc-500 text-xs py-2">
            <Loader2 className="w-4 h-4 animate-spin text-zinc-600" />
            <span>Gemini AI is generating code suggestions...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Box Area */}
      <div className={`p-3 border-t space-y-2 ${
        isLight ? 'bg-zinc-50 border-zinc-200' : 'bg-zinc-900/80 border-zinc-800'
      }`}>
        {/* Context Toggle */}
        <div className="flex items-center justify-between text-[11px]">
          <label className="flex items-center space-x-1.5 cursor-pointer">
            <input
              type="checkbox"
              checked={includeContext}
              onChange={(e) => setIncludeContext(e.target.checked)}
              className="rounded text-zinc-900 focus:ring-0"
            />
            <span className={isLight ? 'text-zinc-700' : 'text-zinc-300'}>
              Attach active file context ({activeFile?.name || 'No file selected'})
            </span>
          </label>
        </div>

        {/* Input Text Box */}
        <div className="relative flex items-center">
          <input
            type="text"
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Ask Gemini AI about code, bugs, or refactoring..."
            className={`w-full text-xs pl-3 pr-10 py-2.5 rounded-lg border focus:outline-none transition-colors ${
              isLight 
                ? 'bg-white border-zinc-300 text-zinc-900 focus:border-zinc-900 placeholder-zinc-400' 
                : 'bg-[#0e0e11] border-zinc-800 text-zinc-100 focus:border-zinc-600 placeholder-zinc-500'
            }`}
          />
          <button
            onClick={() => handleSendMessage()}
            disabled={!inputPrompt.trim() || isGenerating}
            className={`absolute right-1.5 p-1.5 rounded-md transition-colors disabled:opacity-40 ${
              isLight 
                ? 'bg-zinc-900 hover:bg-zinc-800 text-white' 
                : 'bg-white hover:bg-zinc-200 text-zinc-900'
            }`}
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIChatPanel;
