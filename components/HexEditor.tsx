import React, { useMemo } from 'react';

interface HexEditorProps {
  data: Uint8Array;
  startAddress?: number;
}

const HexEditor: React.FC<HexEditorProps> = ({ data, startAddress = 0x00000000 }) => {
  // Only render a subset for performance in this demo
  const pageSize = 512;
  const displayData = data.slice(0, pageSize);

  const rows = useMemo(() => {
    const result: { offset: number; bytes: Uint8Array; ascii: string }[] = [];
    for (let i = 0; i < displayData.length; i += 16) {
      const chunk = displayData.slice(i, i + 16);
      result.push({
        offset: startAddress + i,
        bytes: chunk,
        ascii: Array.from(chunk).map((b: number) => (b >= 32 && b <= 126 ? String.fromCharCode(b) : '.')).join('')
      });
    }
    return result;
  }, [displayData, startAddress]);

  return (
    <div className="flex flex-col h-full bg-gray-950 font-mono text-sm border border-gray-800 rounded-lg overflow-hidden shadow-inner">
      <div className="bg-gray-900 border-b border-gray-800 px-4 py-2 flex justify-between items-center">
        <span className="text-gray-400 font-bold text-xs uppercase tracking-wider">Memory Viewer</span>
        <span className="text-gray-500 text-xs">Viewing 0x{startAddress.toString(16).padStart(8, '0')} - 0x{(startAddress + pageSize).toString(16).padStart(8, '0')}</span>
      </div>
      
      <div className="flex-1 overflow-auto p-4 custom-scrollbar">
        {/* Added min-w-max to ensure grid doesn't squash on small screens */}
        <div className="grid grid-cols-[auto_1fr_auto] gap-x-4 min-w-[700px]">
          {/* Header */}
          <div className="text-brand-500 font-bold mb-2 text-xs">Offset</div>
          <div className="text-brand-500 font-bold mb-2 text-xs grid grid-cols-16 gap-x-1">
            {Array.from({ length: 16 }).map((_, i) => <span key={i} className="text-center">{i.toString(16).toUpperCase().padStart(2, '0')}</span>)}
          </div>
          <div className="text-brand-500 font-bold mb-2 text-xs pl-2 border-l border-transparent">ASCII</div>

          {/* Rows */}
          {rows.map((row) => (
            <React.Fragment key={row.offset}>
              {/* Address Offset */}
              <div className="text-gray-500 hover:text-gray-300 cursor-pointer select-none">
                0x{row.offset.toString(16).toUpperCase().padStart(8, '0')}
              </div>

              {/* Hex Bytes */}
              <div className="grid grid-cols-16 gap-x-1 group">
                {Array.from(row.bytes).map((byte: number, idx) => (
                  <span 
                    key={idx} 
                    className={`text-center transition-colors cursor-pointer hover:bg-brand-900 hover:text-brand-200 rounded ${byte === 0 ? 'text-gray-700' : 'text-gray-300'}`}
                  >
                    {byte.toString(16).toUpperCase().padStart(2, '0')}
                  </span>
                ))}
                {/* Fill empty spaces if last row is incomplete */}
                {row.bytes.length < 16 && Array.from({ length: 16 - row.bytes.length }).map((_, i) => <span key={i} className="opacity-0">00</span>)}
              </div>

              {/* ASCII */}
              <div className="text-green-600/80 tracking-widest whitespace-pre border-l border-gray-800 pl-4 h-6">
                {row.ascii}
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HexEditor;