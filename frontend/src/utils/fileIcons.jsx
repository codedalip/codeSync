import React from 'react';
import { 
  FileCode, 
  FileText, 
  FileJson, 
  Code2, 
  Terminal, 
  Layers
} from 'lucide-react';

export const getFileIcon = (filename) => {
  if (!filename) return <FileCode className="w-4 h-4 text-gray-400" />;

  const parts = filename.split('.');
  const ext = parts.length > 1 ? parts.pop().toLowerCase() : '';

  switch (ext) {
    case 'js':
    case 'jsx':
      return <Code2 className="w-4 h-4 text-yellow-400" />;
    case 'ts':
    case 'tsx':
      return <Code2 className="w-4 h-4 text-blue-400" />;
    case 'py':
      return <Terminal className="w-4 h-4 text-green-400" />;
    case 'cpp':
    case 'cxx':
    case 'cc':
    case 'c':
      return <FileCode className="w-4 h-4 text-cyan-400" />;
    case 'java':
      return <Layers className="w-4 h-4 text-red-400" />;
    case 'html':
      return <Code2 className="w-4 h-4 text-orange-500" />;
    case 'css':
      return <FileCode className="w-4 h-4 text-sky-400" />;
    case 'json':
      return <FileJson className="w-4 h-4 text-amber-300" />;
    case 'md':
      return <FileText className="w-4 h-4 text-purple-400" />;
    default:
      return <FileCode className="w-4 h-4 text-gray-400" />;
  }
};
