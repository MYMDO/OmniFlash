import React, { useState, useCallback, useEffect } from 'react';
import { 
  Cpu, 
  Activity, 
  Zap, 
  Play, 
  Search, 
  Database, 
  Layout, 
  Download,
  Upload,
  Bot,
  Maximize2
} from 'lucide-react';
import { MOCK_CHIPS, SAMPLE_HEX_DATA } from './constants';
import { ChipDefinition, Protocol, LogEntry, ConnectionStatus, HexEditorState } from './types';
import HexEditor from './components/HexEditor';
import ProtocolSettings from './components/ProtocolSettings';
import LogConsole from './components/LogConsole';
import * as GeminiService from './services/geminiService';

const App = () => {
  // Application State
  const [selectedChip, setSelectedChip] = useState<ChipDefinition | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>(ConnectionStatus.DISCONNECTED);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [hexData, setHexData] = useState<HexEditorState>({ data: SAMPLE_HEX_DATA, addressOffset: 0 });
  const [activeTab, setActiveTab] = useState<'editor' | 'config' | 'ai'>('editor');
  const [searchQuery, setSearchQuery] = useState('');
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isAiThinking, setIsAiThinking] = useState(false);

  // Helper to add logs
  const addLog = useCallback((level: LogEntry['level'], message: string, source: string = 'System') => {
    const newLog: LogEntry = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
      level,
      message,
      source
    };
    setLogs(prev => [...prev, newLog]);
  }, []);

  // Filter chips based on search
  const filteredChips = MOCK_CHIPS.filter(chip => 
    chip.partNumber.toLowerCase().includes(searchQuery.toLowerCase()) || 
    chip.manufacturer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handlers
  const handleConnect = () => {
    if (connectionStatus === ConnectionStatus.CONNECTED) {
      setConnectionStatus(ConnectionStatus.DISCONNECTED);
      addLog('info', 'Disconnected from target.');
      return;
    }

    if (!selectedChip) {
      addLog('warn', 'Please select a target device first.');
      return;
    }

    setConnectionStatus(ConnectionStatus.CONNECTING);
    addLog('info', `Attempting connection to ${selectedChip.partNumber} via ${selectedChip.protocols[0]}...`);
    
    // Simulate connection delay
    setTimeout(() => {
      setConnectionStatus(ConnectionStatus.CONNECTED);
      addLog('success', `Target identified: IDCODE 0x4BA00477`, 'HW-Bridge');
      addLog('success', `Connected successfully. Voltage: 3.28V`);
    }, 1500);
  };

  const handleRead = () => {
    if (connectionStatus !== ConnectionStatus.CONNECTED) {
      addLog('error', 'Target not connected.');
      return;
    }
    addLog('info', 'Starting read operation (1MB)...', 'Flash');
    // Simulate read
    setTimeout(() => {
        addLog('success', 'Read complete. Checksum matches.', 'Flash');
        // Analyze with AI automatically just for demo
        GeminiService.analyzeHexDump("48 65 6C 6C 6F 20 57 6F 72 6C 64").then(analysis => {
            addLog('info', `AI Analysis: ${analysis}`, 'Gemini');
        });
    }, 2000);
  };

  const handleAiAsk = async () => {
    if (!aiPrompt.trim()) return;
    setIsAiThinking(true);
    addLog('info', 'Asking AI Assistant...', 'AI');
    
    const context = selectedChip 
      ? `${selectedChip.manufacturer} ${selectedChip.partNumber} (${selectedChip.type})`
      : "No device selected";

    const response = await GeminiService.askAssistant(aiPrompt, context);
    setAiResponse(response);
    setIsAiThinking(false);
  };

  const handleLoadFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      addLog('info', `Loading file: ${file.name} (${file.size} bytes)`);
      const reader = new FileReader();
      reader.onload = (evt) => {
        if (evt.target?.result) {
           const buffer = evt.target.result as ArrayBuffer;
           setHexData({
             data: new Uint8Array(buffer),
             addressOffset: 0
           });
           addLog('success', 'File loaded into buffer.');
        }
      };
      reader.readAsArrayBuffer(file);
    }
  };

  return (
    <div className="flex h-screen w-full bg-gray-950 text-gray-200 overflow-hidden">
      
      {/* Sidebar - Device Selection */}
      <div className="w-80 border-r border-gray-800 bg-gray-900 flex flex-col z-20 shadow-xl">
        <div className="p-4 border-b border-gray-800">
          <h1 className="text-xl font-bold text-brand-400 flex items-center gap-2">
            <Cpu className="w-6 h-6" />
            OmniFlash
          </h1>
          <p className="text-xs text-gray-500 mt-1">Universal Programmer v2.0</p>
        </div>

        <div className="p-4 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" />
            <input 
              type="text" 
              placeholder="Search chip (e.g., STM32...)" 
              className="w-full bg-gray-950 border border-gray-700 rounded-md py-2 pl-9 pr-4 text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="space-y-2 h-[calc(100vh-250px)] overflow-y-auto custom-scrollbar pr-1">
             {filteredChips.map(chip => (
               <div 
                 key={chip.id}
                 onClick={() => setSelectedChip(chip)}
                 className={`p-3 rounded-md border cursor-pointer transition-all ${selectedChip?.id === chip.id ? 'bg-brand-900/20 border-brand-500/50' : 'bg-gray-800/50 border-gray-700 hover:border-gray-500'}`}
               >
                 <div className="flex justify-between items-start">
                   <h3 className="font-bold text-sm text-gray-100">{chip.partNumber}</h3>
                   <span className="text-[10px] bg-gray-700 px-1.5 py-0.5 rounded text-gray-300">{chip.type}</span>
                 </div>
                 <p className="text-xs text-brand-400 mt-1">{chip.manufacturer}</p>
                 <div className="flex flex-wrap gap-1 mt-2">
                   {chip.protocols.map(p => (
                     <span key={p} className="text-[10px] text-gray-500 border border-gray-700 px-1 rounded">{p}</span>
                   ))}
                 </div>
               </div>
             ))}
             {filteredChips.length === 0 && (
               <div className="text-center text-gray-600 text-sm mt-8">No devices found.</div>
             )}
          </div>
        </div>

        <div className="mt-auto p-4 border-t border-gray-800 bg-gray-900/50">
           <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
              <span>Hardware Interface</span>
              <span className={`flex items-center gap-1 ${connectionStatus === ConnectionStatus.CONNECTED ? 'text-green-500' : 'text-gray-500'}`}>
                <div className={`w-2 h-2 rounded-full ${connectionStatus === ConnectionStatus.CONNECTED ? 'bg-green-500 animate-pulse' : 'bg-gray-600'}`}></div>
                {connectionStatus}
              </span>
           </div>
           <button 
             onClick={handleConnect}
             className={`w-full py-2 rounded-md font-medium text-sm transition-colors flex items-center justify-center gap-2 ${
               connectionStatus === ConnectionStatus.CONNECTED 
                 ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/50' 
                 : 'bg-brand-600 text-white hover:bg-brand-500'
             }`}
           >
             <Zap className="w-4 h-4" />
             {connectionStatus === ConnectionStatus.CONNECTED ? 'Disconnect' : 'Connect Programmer'}
           </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col bg-gray-950">
        
        {/* Top Toolbar */}
        <header className="h-16 border-b border-gray-800 bg-gray-900/50 px-6 flex items-center justify-between">
           <div className="flex items-center gap-4">
             {selectedChip ? (
               <div className="flex items-center gap-3">
                 <div className="bg-gray-800 p-2 rounded text-brand-400">
                    <Activity className="w-5 h-5" />
                 </div>
                 <div>
                   <h2 className="text-sm font-bold text-white">{selectedChip.partNumber}</h2>
                   <p className="text-xs text-gray-500">{selectedChip.type} • {selectedChip.memorySize ? (selectedChip.memorySize / 1024) + 'KB' : 'Unknown Size'}</p>
                 </div>
               </div>
             ) : (
               <div className="text-gray-500 text-sm flex items-center gap-2">
                 <Layout className="w-4 h-4" />
                 Select a device to begin
               </div>
             )}
           </div>

           <div className="flex items-center gap-2">
              <label className="flex items-center gap-2 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded text-sm text-gray-300 cursor-pointer transition-colors">
                <Upload className="w-4 h-4" />
                <span>Load File</span>
                <input type="file" className="hidden" onChange={handleLoadFile} />
              </label>
              <div className="h-6 w-px bg-gray-700 mx-2"></div>
              <button onClick={handleRead} disabled={connectionStatus !== ConnectionStatus.CONNECTED} className="flex items-center gap-2 px-4 py-1.5 bg-green-600/10 text-green-400 border border-green-600/50 hover:bg-green-600/20 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all">
                <Download className="w-4 h-4" /> Read
              </button>
              <button disabled={connectionStatus !== ConnectionStatus.CONNECTED} className="flex items-center gap-2 px-4 py-1.5 bg-red-600/10 text-red-400 border border-red-600/50 hover:bg-red-600/20 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all">
                <Play className="w-4 h-4" /> Write
              </button>
           </div>
        </header>

        {/* Workspace */}
        <div className="flex-1 flex overflow-hidden">
          
          {/* Main Panel */}
          <div className="flex-1 flex flex-col p-4 gap-4 overflow-hidden">
            {/* Tabs */}
            <div className="flex gap-1 bg-gray-900/50 p-1 rounded-lg w-fit border border-gray-800">
               <button 
                onClick={() => setActiveTab('editor')}
                className={`px-4 py-1.5 text-xs font-medium rounded-md transition-all ${activeTab === 'editor' ? 'bg-brand-600 text-white shadow-lg' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}
               >
                 Hex Editor
               </button>
               <button 
                onClick={() => setActiveTab('config')}
                className={`px-4 py-1.5 text-xs font-medium rounded-md transition-all ${activeTab === 'config' ? 'bg-brand-600 text-white shadow-lg' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}
               >
                 Configuration
               </button>
               <button 
                onClick={() => setActiveTab('ai')}
                className={`px-4 py-1.5 text-xs font-medium rounded-md transition-all flex items-center gap-2 ${activeTab === 'ai' ? 'bg-brand-600 text-white shadow-lg' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}
               >
                 <Bot className="w-3 h-3" />
                 AI Assistant
               </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-hidden relative">
              {activeTab === 'editor' && (
                <HexEditor data={hexData.data} startAddress={hexData.addressOffset} />
              )}
              
              {activeTab === 'config' && selectedChip && (
                <div className="space-y-6 overflow-y-auto h-full pr-2">
                   {selectedChip.protocols.map(p => (
                     <ProtocolSettings key={p} protocol={p} onChange={(v) => console.log(v)} />
                   ))}
                   <div className="bg-gray-900 p-4 rounded-lg border border-gray-800">
                      <h3 className="text-gray-300 font-semibold mb-2">Device Info</h3>
                      <p className="text-gray-500 text-sm">{selectedChip.description}</p>
                   </div>
                </div>
              )}

              {activeTab === 'config' && !selectedChip && (
                <div className="flex items-center justify-center h-full text-gray-500 text-sm">Select a chip to configure protocols.</div>
              )}

              {activeTab === 'ai' && (
                 <div className="flex flex-col h-full bg-gray-900 border border-gray-800 rounded-lg">
                    <div className="flex-1 p-4 overflow-y-auto space-y-4">
                       <div className="flex gap-3">
                          <div className="w-8 h-8 bg-brand-600 rounded-full flex items-center justify-center shrink-0">
                            <Bot className="w-5 h-5 text-white" />
                          </div>
                          <div className="bg-gray-800 p-3 rounded-r-lg rounded-bl-lg text-sm text-gray-200">
                             Hello! I am your Hardware Assistant. I can help you with:
                             <ul className="list-disc ml-4 mt-2 text-gray-400 space-y-1">
                               <li>Pinout diagrams for {selectedChip?.partNumber || 'any chip'}</li>
                               <li>Generating OpenOCD/J-Link scripts</li>
                               <li>Analyzing hex dumps and error codes</li>
                               <li>Suggesting connection wiring</li>
                             </ul>
                          </div>
                       </div>
                       
                       {aiResponse && (
                         <div className="flex gap-3">
                            <div className="w-8 h-8 bg-brand-600 rounded-full flex items-center justify-center shrink-0">
                              <Bot className="w-5 h-5 text-white" />
                            </div>
                            <div className="bg-gray-800 p-3 rounded-r-lg rounded-bl-lg text-sm text-gray-200 whitespace-pre-wrap">
                               {aiResponse}
                            </div>
                         </div>
                       )}
                    </div>
                    <div className="p-4 border-t border-gray-800">
                       <div className="flex gap-2">
                          <input 
                            type="text" 
                            className="flex-1 bg-gray-950 border border-gray-700 rounded px-3 py-2 text-sm text-white focus:border-brand-500 outline-none"
                            placeholder="Ask about wiring, protocols, or pinouts..."
                            value={aiPrompt}
                            onChange={(e) => setAiPrompt(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleAiAsk()}
                          />
                          <button 
                            onClick={handleAiAsk} 
                            disabled={isAiThinking}
                            className="bg-brand-600 hover:bg-brand-500 text-white px-4 py-2 rounded text-sm font-medium disabled:opacity-50"
                          >
                            {isAiThinking ? '...' : 'Send'}
                          </button>
                       </div>
                    </div>
                 </div>
              )}
            </div>

            {/* Bottom Panel: Logs */}
            <div className="h-48 shrink-0">
              <LogConsole logs={logs} onClear={() => setLogs([])} />
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default App;