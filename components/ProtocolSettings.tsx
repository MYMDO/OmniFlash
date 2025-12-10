import React from 'react';
import { Protocol } from '../types';
import { Settings, RefreshCw, Zap } from 'lucide-react';

interface ProtocolSettingsProps {
  protocol: Protocol;
  onChange: (settings: any) => void;
}

const ProtocolSettings: React.FC<ProtocolSettingsProps> = ({ protocol, onChange }) => {
  return (
    <div className="bg-gray-900 p-4 rounded-lg border border-gray-800 space-y-4">
      <div className="flex items-center gap-2 mb-4 border-b border-gray-800 pb-2">
        <Settings className="w-4 h-4 text-brand-400" />
        <h3 className="font-semibold text-gray-200">{protocol} Configuration</h3>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Voltage VCC */}
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">VCC Voltage</label>
          <select className="w-full bg-gray-950 border border-gray-700 rounded px-2 py-1.5 text-sm text-gray-200 focus:ring-1 focus:ring-brand-500 outline-none">
            <option>5.0V</option>
            <option>3.3V</option>
            <option>2.5V</option>
            <option>1.8V</option>
            <option>OFF</option>
          </select>
        </div>

        {/* Clock Speed */}
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Clock Speed</label>
          <select className="w-full bg-gray-950 border border-gray-700 rounded px-2 py-1.5 text-sm text-gray-200 focus:ring-1 focus:ring-brand-500 outline-none">
            <option>100 kHz</option>
            <option>400 kHz</option>
            <option>1 MHz</option>
            <option>4 MHz</option>
            <option>10 MHz</option>
            <option>Max (Adaptive)</option>
          </select>
        </div>

        {/* Protocol Specifics */}
        {protocol === Protocol.UART && (
          <>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Baud Rate</label>
              <select className="w-full bg-gray-950 border border-gray-700 rounded px-2 py-1.5 text-sm text-gray-200 focus:ring-1 focus:ring-brand-500 outline-none">
                <option>9600</option>
                <option>115200</option>
                <option>921600</option>
              </select>
            </div>
             <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Parity</label>
              <select className="w-full bg-gray-950 border border-gray-700 rounded px-2 py-1.5 text-sm text-gray-200 focus:ring-1 focus:ring-brand-500 outline-none">
                <option>None</option>
                <option>Even</option>
                <option>Odd</option>
              </select>
            </div>
          </>
        )}

        {protocol === Protocol.SPI && (
          <>
             <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Mode</label>
              <select className="w-full bg-gray-950 border border-gray-700 rounded px-2 py-1.5 text-sm text-gray-200 focus:ring-1 focus:ring-brand-500 outline-none">
                <option>Mode 0 (CPOL=0, CPHA=0)</option>
                <option>Mode 1 (CPOL=0, CPHA=1)</option>
                <option>Mode 2 (CPOL=1, CPHA=0)</option>
                <option>Mode 3 (CPOL=1, CPHA=1)</option>
              </select>
            </div>
             <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">IO Width</label>
              <select className="w-full bg-gray-950 border border-gray-700 rounded px-2 py-1.5 text-sm text-gray-200 focus:ring-1 focus:ring-brand-500 outline-none">
                <option>Standard SPI</option>
                <option>Dual SPI</option>
                <option>Quad SPI</option>
              </select>
            </div>
          </>
        )}
      </div>
      
      <div className="flex gap-2 mt-4 pt-4 border-t border-gray-800">
         <button className="flex-1 flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs py-2 rounded transition-colors">
            <RefreshCw className="w-3 h-3" /> Auto-Tune
         </button>
         <button className="flex-1 flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs py-2 rounded transition-colors">
            <Zap className="w-3 h-3" /> Power Cycle
         </button>
      </div>
    </div>
  );
};

export default ProtocolSettings;