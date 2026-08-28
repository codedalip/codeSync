import React, { useRef, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { useWorkspaceStore } from '../../stores/useWorkspaceStore';
import { useCollaborationStore } from '../../stores/useCollaborationStore';
import { useAuthStore } from '../../stores/useAuthStore';
import { useThemeStore } from '../../stores/useThemeStore';
import { getSocket } from '../../services/socket';
import { Code2 } from 'lucide-react';

const CURSOR_COLORS = [
  '#10b981', // Emerald Green
  '#f59e0b', // Amber Gold
  '#6366f1', // Indigo
  '#ef4444', // Crimson Red
  '#06b6d4', // Cyan
  '#ec4899', // Pink
  '#84cc16'  // Lime
];

const getRemoteUserColor = (userId, customColor) => {
  if (customColor && customColor !== '#3b82f6') return customColor;
  let hash = 0;
  const str = String(userId || '');
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % CURSOR_COLORS.length;
  return CURSOR_COLORS[index];
};

const CodeEditor = ({ workspaceId }) => {
  const { user } = useAuthStore();
  const { files, activeFileId, updateFileContentLocally, editorSettings } = useWorkspaceStore();
  const { 
    remoteCursors, 
    remoteSelections, 
    typingUsers, 
    updateRemoteCursor, 
    updateRemoteSelection 
  } = useCollaborationStore();
  const { theme } = useThemeStore();

  const editorRef = useRef(null);
  const monacoRef = useRef(null);
  const isRemoteEdits = useRef(false);
  const decorationsRef = useRef([]);
  const typingTimerRef = useRef(null);
  const cursorThrottleRef = useRef(null);
  const selectionThrottleRef = useRef(null);

  const activeFile = files.find((f) => f._id === activeFileId);

  // Dynamic Theme & Editor Settings Listener
  useEffect(() => {
    if (editorRef.current) {
      const model = editorRef.current.getModel();
      if (model) {
        model.updateOptions({
          tabSize: editorSettings?.tabSize || 2,
          insertSpaces: true
        });
      }
      editorRef.current.updateOptions({
        fontSize: editorSettings?.fontSize || 14,
        tabSize: editorSettings?.tabSize || 2,
        detectIndentation: false,
        insertSpaces: true,
        minimap: { enabled: !!editorSettings?.minimap },
        wordWrap: editorSettings?.wordWrap || 'on'
      });
    }
    if (monacoRef.current) {
      monacoRef.current.editor.setTheme(theme === 'light' ? 'vs' : 'vs-dark');
    }
  }, [editorSettings, theme]);

  // Local Cursor & Selection Handlers
  const handleCursorChange = (e) => {
    const socket = getSocket();
    if (!socket || !workspaceId || !activeFileId || !e?.position) return;

    if (cursorThrottleRef.current) return;
    cursorThrottleRef.current = setTimeout(() => {
      cursorThrottleRef.current = null;
      socket.emit('cursor:change', {
        workspaceId,
        fileId: activeFileId,
        position: e.position
      });
    }, 40);
  };

  const handleSelectionChange = (e) => {
    const socket = getSocket();
    if (!socket || !workspaceId || !activeFileId || !e?.selection) return;

    if (selectionThrottleRef.current) return;
    selectionThrottleRef.current = setTimeout(() => {
      selectionThrottleRef.current = null;
      socket.emit('selection:change', {
        workspaceId,
        fileId: activeFileId,
        selection: {
          startLineNumber: e.selection.startLineNumber,
          startColumn: e.selection.startColumn,
          endLineNumber: e.selection.endLineNumber,
          endColumn: e.selection.endColumn
        }
      });
    }, 60);
  };

  // Handle Monaco Mount
  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;

    // Apply VS Code Theme Settings
    monaco.editor.setTheme(theme === 'light' ? 'vs' : 'vs-dark');

    // Register Cursor & Selection Change Listeners
    editor.onDidChangeCursorPosition((e) => handleCursorChange(e));
    editor.onDidChangeCursorSelection((e) => handleSelectionChange(e));

    // Apply active editor settings
    if (editorSettings) {
      const model = editor.getModel();
      if (model) {
        model.updateOptions({
          tabSize: editorSettings.tabSize || 2,
          insertSpaces: true
        });
      }
      editor.updateOptions({
        fontSize: editorSettings.fontSize || 14,
        tabSize: editorSettings.tabSize || 2,
        detectIndentation: false,
        insertSpaces: true,
        minimap: { enabled: !!editorSettings.minimap },
        wordWrap: editorSettings.wordWrap || 'on'
      });
    }

    // Notify backend that user opened file
    const socket = getSocket();
    if (socket && workspaceId && activeFileId) {
      socket.emit('editor:join', { workspaceId, fileId: activeFileId });
    }
  };

  // Setup Socket listeners for incoming editor & cursor updates
  useEffect(() => {
    const socket = getSocket();
    if (!socket || !workspaceId) return;

    // Receive code updates from remote users
    const handleRemoteUpdate = (data) => {
      const { fileId, changes, fullContent } = data;
      if (fileId !== activeFileId || !editorRef.current || !monacoRef.current) return;

      const editor = editorRef.current;
      const model = editor.getModel();
      if (!model) return;

      isRemoteEdits.current = true;

      // Calculate exact local cursor line shift for remote edits above current cursor
      const currentPos = editor.getPosition();
      let newLineNumber = currentPos ? currentPos.lineNumber : 1;
      let newColumn = currentPos ? currentPos.column : 1;

      if (currentPos && changes && Array.isArray(changes)) {
        for (const change of changes) {
          const startLine = change.range.startLineNumber;
          const endLine = change.range.endLineNumber;
          const addedLines = (change.text.match(/\n/g) || []).length;
          const removedLines = endLine - startLine;
          const netLineDelta = addedLines - removedLines;

          if (startLine < currentPos.lineNumber) {
            newLineNumber += netLineDelta;
          } else if (startLine === currentPos.lineNumber && addedLines > 0) {
            newLineNumber += netLineDelta;
          }
        }
        newLineNumber = Math.max(1, newLineNumber);
      }

      if (changes && Array.isArray(changes) && changes.length > 0) {
        const edits = changes.map((change) => ({
          range: new monacoRef.current.Range(
            change.range.startLineNumber,
            change.range.startColumn,
            change.range.endLineNumber,
            change.range.endColumn
          ),
          text: change.text,
          forceMoveMarkers: true
        }));

        editor.executeEdits('remote-sync', edits);
        if (currentPos && (newLineNumber !== currentPos.lineNumber)) {
          editor.setPosition({ lineNumber: newLineNumber, column: newColumn });
        }
      } else if (fullContent !== undefined && model.getValue() !== fullContent) {
        model.setValue(fullContent);
        if (currentPos) {
          editor.setPosition(currentPos);
        }
      }

      isRemoteEdits.current = false;

      // Update Zustand local file state
      const updatedValue = editor.getValue();
      updateFileContentLocally(fileId, updatedValue);
    };

    // Receive cursor movement from remote users
    const handleRemoteCursor = (data) => {
      if (data.userId !== user?._id && data.fileId === activeFileId) {
        updateRemoteCursor(data);
      }
    };

    // Receive text selection from remote users
    const handleRemoteSelection = (data) => {
      if (data.userId !== user?._id && data.fileId === activeFileId) {
        updateRemoteSelection(data);
      }
    };

    socket.on('editor:update', handleRemoteUpdate);
    socket.on('cursor:update', handleRemoteCursor);
    socket.on('selection:update', handleRemoteSelection);

    return () => {
      socket.off('editor:update', handleRemoteUpdate);
      socket.off('cursor:update', handleRemoteCursor);
      socket.off('selection:update', handleRemoteSelection);
    };
  }, [workspaceId, activeFileId, user?._id, updateFileContentLocally, updateRemoteCursor, updateRemoteSelection]);

  // Render Remote Cursors and Selections Decorations in Monaco
  useEffect(() => {
    if (!editorRef.current || !monacoRef.current || !activeFileId) return;

    const editor = editorRef.current;
    const monaco = monacoRef.current;

    const newDecorations = [];
    let dynamicStyles = '';

    // Filter cursors for the current file
    Object.values(remoteCursors).forEach((cursor) => {
      if (cursor.fileId === activeFileId && cursor.position) {
        const { lineNumber, column } = cursor.position;
        const color = getRemoteUserColor(cursor.userId, cursor.avatarColor);
        const userName = cursor.userName || 'User';
        const safeUserId = String(cursor.userId).replace(/[^a-zA-Z0-9_-]/g, '');

        dynamicStyles += `
          .remote-cursor-${safeUserId} {
            border-left: 2.5px solid ${color} !important;
            position: absolute !important;
            height: 1.2em !important;
            display: inline-block !important;
            z-index: 100 !important;
          }
          .remote-cursor-badge-${safeUserId}::after {
            content: "${userName.replace(/"/g, '')}";
            background-color: ${color};
            color: #ffffff;
            font-size: 10px;
            font-weight: 700;
            padding: 1px 6px;
            border-radius: 3px 3px 3px 0;
            position: absolute;
            top: -18px;
            left: 0;
            white-space: nowrap;
            pointer-events: none;
            box-shadow: 0 2px 5px rgba(0,0,0,0.4);
            z-index: 101 !important;
            font-family: system-ui, -apple-system, sans-serif;
          }
        `;

        newDecorations.push({
          range: new monaco.Range(lineNumber, column, lineNumber, column),
          options: {
            className: `remote-cursor-${safeUserId}`,
            beforeContentClassName: `remote-cursor-badge-${safeUserId}`,
            stickiness: monaco.editor.TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges,
            hoverMessage: { value: `**${userName}** is editing here` }
          }
        });
      }
    });

    // Filter selections for the current file
    Object.values(remoteSelections).forEach((selData) => {
      if (selData.fileId === activeFileId && selData.selection) {
        const { startLineNumber, startColumn, endLineNumber, endColumn } = selData.selection;
        if (
          startLineNumber !== endLineNumber ||
          startColumn !== endColumn
        ) {
          const color = getRemoteUserColor(selData.userId, selData.avatarColor);
          const safeUserId = String(selData.userId).replace(/[^a-zA-Z0-9_-]/g, '');

          dynamicStyles += `
            .remote-selection-${safeUserId} {
              background-color: ${color}35 !important;
            }
          `;

          newDecorations.push({
            range: new monaco.Range(startLineNumber, startColumn, endLineNumber, endColumn),
            options: {
              className: `remote-selection-${safeUserId}`,
              stickiness: monaco.editor.TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges,
              hoverMessage: { value: `Selected by ${selData.userName}` }
            }
          });
        }
      }
    });

    // Inject dynamic CSS stylesheet for remote user cursors
    let styleTag = document.getElementById('monaco-remote-cursor-styles');
    if (!styleTag) {
      styleTag = document.createElement('style');
      styleTag.id = 'monaco-remote-cursor-styles';
      document.head.appendChild(styleTag);
    }
    styleTag.innerHTML = dynamicStyles;

    // Apply decorations to Monaco editor instance
    decorationsRef.current = editor.deltaDecorations(decorationsRef.current, newDecorations);
  }, [remoteCursors, remoteSelections, activeFileId]);

  // Emit local changes to Socket.IO backend
  const handleEditorChange = (value, ev) => {
    if (isRemoteEdits.current || !activeFileId) return;

    // Update local Zustand state
    updateFileContentLocally(activeFileId, value);

    // Broadcast edit change to workspace socket room
    const socket = getSocket();
    if (socket && workspaceId) {
      socket.emit('editor:change', {
        workspaceId,
        fileId: activeFileId,
        changes: ev.changes,
        fullContent: value
      });
    }
  };

  if (!activeFile) {
    return (
      <div className={`flex-1 flex flex-col items-center justify-center space-y-3 transition-colors ${
        theme === 'light' ? 'bg-white text-zinc-500' : 'bg-[#0e0e11] text-zinc-400'
      }`}>
        <Code2 className="w-12 h-12 text-zinc-400" />
        <p className="text-sm">No file is open. Select a file from the explorer to begin editing.</p>
      </div>
    );
  }

  return (
    <div className={`flex-1 h-full w-full relative ${
      theme === 'light' ? 'bg-white' : 'bg-[#0e0e11]'
    }`}>
      <Editor
        height="100%"
        path={activeFile.name}
        language={activeFile.language || 'javascript'}
        theme={theme === 'light' ? 'vs' : 'vs-dark'}
        defaultValue={activeFile.content}
        value={activeFile.content}
        onChange={handleEditorChange}
        onMount={handleEditorDidMount}
        options={{
          fontSize: editorSettings?.fontSize || 14,
          fontFamily: "'Fira Code', 'Consolas', 'Courier New', monospace",
          minimap: { enabled: editorSettings?.minimap ?? true },
          scrollBeyondLastLine: false,
          smoothScrolling: true,
          cursorBlinking: 'smooth',
          cursorSmoothCaretAnimation: 'on',
          automaticLayout: true,
          renderLineHighlight: 'all',
          tabSize: editorSettings?.tabSize || 2,
          detectIndentation: false,
          insertSpaces: true,
          wordWrap: editorSettings?.wordWrap || 'on'
        }}
      />
    </div>
  );
};

export default CodeEditor;
