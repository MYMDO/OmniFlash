import React, { useEffect, useRef } from 'react';
import { LogEntry } from '../types';
import { Terminal, XCircle, Info, CheckCircle, AlertTriangle } from 'lucide-react';

interface LogConsoleProps {
  logs: LogEntry[];
  onClear: () => void;
}

const LogConsole: React.FC<LogConsoleProps> = ({ logs, onClear }) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const getIcon = (level: LogEntry['level']) => {
    switch (level) {
      case 'error': return <XCircle className="w-3 h-3 text-red-500" />;
      case 'warn': return <AlertTriangle className="w-3 h-3 text-yellow-500" />;
      case 'success': return <CheckCircle className="w-3 h-3 text-green-500" />;
      default: return <Info className="w-3 h-3 text-blue-500" />;
    }
  };

  const getColor = (level: LogEntry['level']) => {
    switch (level) {
      case 'error': return 'text-red-400';
      case 'warn': return 'text-yellow-400';
      case 'success': return 'text-green-400';
      case 'debug': return 'text-gray-500';
      default: return 'text-gray-300';
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-950 border border-gray-800 rounded-lg overflow-hidden font-mono text-sm">
      <div className="flex items-center justify-between px-3 py-1.5 bg-gray-900 border-b border-gray-800">
        <div className="flex items-center gap-2">
            <Terminal className="w-3 h-3 text-gray-400" />
            <span className="text-xs font-semibold text-gray-400">System Output</span>
        </div>
        <button onClick={onClear} className="text-xs text-gray-500 hover:text-white transition-colors">
            Clear
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {logs.length === 0 && (
            <div className="text-gray-600 text-center mt-4 italic text-xs">No logs available. Ready...</div>
        )}
        {logs.map((log) => (
          <div key={log.id} className="flex items-start gap-2 hover:bg-gray-900/50 p-1 rounded">
            <span className="text-gray-600 text-[10px] mt-0.5 whitespace-nowrap">
              {log.timestamp.toLocaleTimeString()}
            </span>
            <div className="mt-0.5 shrink-0">{getIcon(log.level)}</div>
            <span className={`${getColor(log.level)} text-xs break-all`}>
               {log.source && <span className="text-gray-500 font-bold mr-1">[{log.source}]</span>}
               {log.message}
            </span>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
    </div>
  );
};

export default LogConsole;