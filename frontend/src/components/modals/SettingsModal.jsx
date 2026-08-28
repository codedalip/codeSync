import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { useWorkspaceStore } from '../../stores/useWorkspaceStore';
import { useThemeStore } from '../../stores/useThemeStore';
import { Settings, X, Sliders, Code2, Copy, Check, CheckCircle2, Sun, Moon } from 'lucide-react';

const SettingsModal = ({ isOpen, onClose }) => {
  const { activeWorkspace, editorSettings, updateEditorSettings } = useWorkspaceStore();
  const { theme, toggleTheme } = useThemeStore();
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const isLight = theme === 'light';

  const handleCopyCode = () => {
    if (activeWorkspace?.code) {
      navigator.clipboard.writeText(activeWorkspace.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in select-none">
      <div className={`w-full max-w-lg border rounded-2xl shadow-2xl overflow-hidden flex flex-col transition-colors ${
        isLight ? 'bg-white border-zinc-200 text-zinc-900' : 'bg-[#121215] border-zinc-800 text-zinc-100'
      }`}>
        {/* Modal Header */}
        <div className={`px-6 py-4 border-b flex items-center justify-between transition-colors ${
          isLight ? 'bg-zinc-100 border-zinc-200 text-zinc-800' : 'bg-[#18181c] border-zinc-800 text-zinc-200'
        }`}>
          <div className="flex items-center space-x-2.5">
            <Settings className="w-5 h-5" />
            <h2 className={`text-base font-bold ${isLight ? 'text-zinc-900' : 'text-white'}`}>
              Workspace & Editor Settings
            </h2>
          </div>
          <button
            onClick={onClose}
            className={`p-1 rounded-lg transition-colors ${
              isLight ? 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-200' : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Workspace Info Card */}
          {activeWorkspace && (
            <div className={`border rounded-xl p-4 space-y-3 ${
              isLight ? 'bg-zinc-50 border-zinc-200' : 'bg-zinc-900 border-zinc-800'
            }`}>
              <div className={`text-xs font-semibold uppercase tracking-wider flex items-center space-x-1.5 ${
                isLight ? 'text-zinc-600' : 'text-zinc-400'
              }`}>
                <Code2 className="w-4 h-4" />
                <span>Active Workspace Information</span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className={`text-sm font-bold ${isLight ? 'text-zinc-900' : 'text-white'}`}>
                    {activeWorkspace.name}
                  </h3>
                  <p className={`text-xs mt-0.5 ${isLight ? 'text-zinc-500' : 'text-zinc-400'}`}>
                    {activeWorkspace.description || 'Collaborative development room'}
                  </p>
                </div>
                <button
                  onClick={handleCopyCode}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-mono border transition-colors ${
                    isLight 
                      ? 'bg-white hover:bg-zinc-200 border-zinc-300 text-zinc-900 font-bold' 
                      : 'bg-[#0e0e11] hover:bg-zinc-800 border-zinc-700 text-white font-bold'
                  }`}
                >
                  <span>{activeWorkspace.code}</span>
                  {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          )}

          {/* Monaco Editor Options */}
          <div className="space-y-4">
            <div className={`text-xs font-semibold uppercase tracking-wider flex items-center space-x-1.5 ${
              isLight ? 'text-zinc-600' : 'text-zinc-400'
            }`}>
              <Sliders className="w-4 h-4" />
              <span>Editor Preferences</span>
            </div>

            {/* Theme Mode Option (Dark / Light) */}
            <div className={`flex items-center justify-between p-3 rounded-lg border ${
              isLight ? 'bg-zinc-50 border-zinc-200' : 'bg-zinc-900 border-zinc-800'
            }`}>
              <div>
                <label className={`text-xs font-bold ${isLight ? 'text-zinc-900' : 'text-white'}`}>IDE Theme Mode</label>
                <p className={`text-[11px] ${isLight ? 'text-zinc-500' : 'text-zinc-400'}`}>Switch between Dark and Light aesthetics</p>
              </div>

              {/* Professional Theme Switcher Toggle Pill */}
              <button
                onClick={toggleTheme}
                className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-full border text-xs font-semibold transition-all shadow-sm ${
                  isLight
                    ? 'bg-zinc-100 hover:bg-zinc-200/80 border-zinc-300 text-zinc-800'
                    : 'bg-zinc-900 hover:bg-zinc-800 border-zinc-700/80 text-zinc-200'
                }`}
                title={`Switch to ${isLight ? 'Dark' : 'Light'} Mode`}
              >
                {isLight ? (
                  <>
                    <Sun className="w-3.5 h-3.5 text-zinc-700" />
                    <span>Light Mode</span>
                  </>
                ) : (
                  <>
                    <Moon className="w-3.5 h-3.5 text-zinc-300" />
                    <span>Dark Mode</span>
                  </>
                )}
              </button>
            </div>

            {/* Font Size Option */}
            <div className={`flex items-center justify-between p-3 rounded-lg border ${
              isLight ? 'bg-zinc-50 border-zinc-200' : 'bg-zinc-900 border-zinc-800'
            }`}>
              <div>
                <label className={`text-xs font-bold ${isLight ? 'text-zinc-900' : 'text-white'}`}>Font Size</label>
                <p className={`text-[11px] ${isLight ? 'text-zinc-500' : 'text-zinc-400'}`}>Adjust code editor font size</p>
              </div>
              <select
                value={editorSettings.fontSize}
                onChange={(e) => updateEditorSettings({ fontSize: Number(e.target.value) })}
                className={`text-xs px-3 py-1.5 rounded-md border focus:outline-none ${
                  isLight 
                    ? 'bg-white border-zinc-300 text-zinc-900 focus:border-zinc-900' 
                    : 'bg-[#0e0e11] border-zinc-700 text-zinc-100 focus:border-zinc-500'
                }`}
              >
                <option value={12}>12 px</option>
                <option value={14}>14 px (Default)</option>
                <option value={16}>16 px</option>
                <option value={18}>18 px</option>
                <option value={20}>20 px</option>
              </select>
            </div>

            {/* Tab Size Option */}
            <div className={`flex items-center justify-between p-3 rounded-lg border ${
              isLight ? 'bg-zinc-50 border-zinc-200' : 'bg-zinc-900 border-zinc-800'
            }`}>
              <div>
                <label className={`text-xs font-bold ${isLight ? 'text-zinc-900' : 'text-white'}`}>Tab Indentation Size</label>
                <p className={`text-[11px] ${isLight ? 'text-zinc-500' : 'text-zinc-400'}`}>Spaces inserted per Tab key press</p>
              </div>
              <select
                value={editorSettings.tabSize || 2}
                onChange={(e) => updateEditorSettings({ tabSize: Number(e.target.value) })}
                className={`text-xs px-3 py-1.5 rounded-md border focus:outline-none font-semibold ${
                  isLight 
                    ? 'bg-white border-zinc-300 text-zinc-900 focus:border-zinc-900' 
                    : 'bg-[#0e0e11] border-zinc-700 text-zinc-100 focus:border-zinc-500'
                }`}
              >
                <option value={2}>2 Spaces</option>
                <option value={4}>4 Spaces</option>
                <option value={8}>8 Spaces</option>
              </select>
            </div>

            {/* Minimap Option */}
            <div className={`flex items-center justify-between p-3 rounded-lg border ${
              isLight ? 'bg-zinc-50 border-zinc-200' : 'bg-zinc-900 border-zinc-800'
            }`}>
              <div>
                <label className={`text-xs font-bold ${isLight ? 'text-zinc-900' : 'text-white'}`}>Minimap Preview</label>
                <p className={`text-[11px] ${isLight ? 'text-zinc-500' : 'text-zinc-400'}`}>Toggle right-side code overview minimap</p>
              </div>
              <button
                onClick={() => updateEditorSettings({ minimap: !editorSettings.minimap })}
                className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                  editorSettings.minimap 
                    ? isLight ? 'bg-zinc-900 justify-end' : 'bg-white justify-end'
                    : isLight ? 'bg-zinc-300 justify-start' : 'bg-zinc-700 justify-start'
                }`}
              >
                <div className={`w-4 h-4 rounded-full shadow-md ${
                  editorSettings.minimap
                    ? isLight ? 'bg-white' : 'bg-zinc-900'
                    : 'bg-white'
                }`}></div>
              </button>
            </div>

            {/* Word Wrap Option */}
            <div className={`flex items-center justify-between p-3 rounded-lg border ${
              isLight ? 'bg-zinc-50 border-zinc-200' : 'bg-zinc-900 border-zinc-800'
            }`}>
              <div>
                <label className={`text-xs font-bold ${isLight ? 'text-zinc-900' : 'text-white'}`}>Word Wrap</label>
                <p className={`text-[11px] ${isLight ? 'text-zinc-500' : 'text-zinc-400'}`}>Wrap long lines to fit editor width</p>
              </div>
              <button
                onClick={() => updateEditorSettings({ wordWrap: editorSettings.wordWrap === 'on' ? 'off' : 'on' })}
                className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                  editorSettings.wordWrap === 'on' 
                    ? isLight ? 'bg-zinc-900 justify-end' : 'bg-white justify-end'
                    : isLight ? 'bg-zinc-300 justify-start' : 'bg-zinc-700 justify-start'
                }`}
              >
                <div className={`w-4 h-4 rounded-full shadow-md ${
                  editorSettings.wordWrap === 'on'
                    ? isLight ? 'bg-white' : 'bg-zinc-900'
                    : 'bg-white'
                }`}></div>
              </button>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className={`px-6 py-3.5 border-t flex justify-end transition-colors ${
          isLight ? 'bg-zinc-100 border-zinc-200' : 'bg-[#18181c] border-zinc-800'
        }`}>
          <button
            onClick={onClose}
            className={`text-xs font-bold px-4 py-2 rounded-lg transition-all flex items-center space-x-1.5 shadow ${
              isLight 
                ? 'bg-zinc-900 hover:bg-zinc-800 text-white' 
                : 'bg-white hover:bg-zinc-200 text-zinc-900'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Done</span>
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default SettingsModal;
