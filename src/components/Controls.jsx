import React from 'react';
import { Link, Layers, Sparkles } from 'lucide-react';

const Controls = ({ text, setText, fgColor, setFgColor, bgColor, setBgColor, frame, setFrame, qrType, setQrType }) => {
  const frames = [
    { id: 'none', label: 'None', icon: '⊘' },
    { id: 'simple', label: 'Simple', icon: '◻' },
    { id: 'neon', label: 'Neon', icon: '◈' },
    { id: 'polaroid', label: 'Polaroid', icon: '▣' },
    { id: 'phone', label: 'Phone', icon: '📱' },
  ];

  return (
    <div className="flex flex-col gap-8">
      {/* QR Type Toggle */}
      <div className="bg-slate-800/50 p-1 rounded-xl border border-slate-700/50 flex relative">
        <div
          className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-indigo-500 rounded-lg shadow-lg shadow-indigo-500/20 transition-all duration-300 ease-out ${qrType === 'static' ? 'left-1' : 'left-[calc(50%+2px)]'
            }`}
        ></div>
        <button
          onClick={() => setQrType('static')}
          className={`relative z-10 flex-1 py-2 text-sm font-medium transition-colors text-center ${qrType === 'static' ? 'text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
        >
          Static
        </button>
        <button
          onClick={() => setQrType('dynamic')}
          className={`relative z-10 flex-1 py-2 text-sm font-medium transition-colors text-center ${qrType === 'dynamic' ? 'text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
        >
          Dynamic
        </button>
      </div>

      {/* Dynamic Mode Info */}
      {qrType === 'dynamic' && (
        <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-4 animate-fade-in">
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles size={14} />
            <span>Short URL Preview</span>
          </div>
          <div className="flex items-center gap-2 text-slate-300 font-mono text-sm bg-slate-900/50 px-3 py-2 rounded-lg border border-indigo-500/10 mb-2">
            <span className="opacity-50">https://kita.qr/</span>
            <span className="text-white font-bold">ak82f</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Dynamic codes redirect to your destination. You can change the destination URL anytime without reprinting.
          </p>
        </div>
      )}

      {/* URL Input */}
      <div className="space-y-3">
        <label htmlFor="qr-text" className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
          <Link size={14} className="text-indigo-400" />
          <span>Content URL or Text</span>
        </label>
        <div className="relative group">
          <input
            id="qr-text"
            type="text"
            placeholder="https://example.com"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full bg-slate-800/50 border border-slate-700 text-slate-200 px-4 py-3 rounded-xl focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-600"
            autoFocus
          />
        </div>
      </div>

      {/* Frames Selection */}
      <div className="space-y-3">
        <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
          <Layers size={14} className="text-secondary" />
          <span>Frame Style</span>
        </label>
        <div className="grid grid-cols-3 gap-2">
          {frames.map((f) => (
            <button
              key={f.id}
              onClick={() => setFrame(f.id)}
              className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${frame === f.id
                ? 'bg-indigo-600/20 border-indigo-500 text-indigo-400 shadow-sm'
                : 'bg-slate-800/30 border-slate-700/50 text-slate-500 hover:bg-slate-800/50 hover:border-slate-600'
                }`}
            >
              <span className="text-xl mb-1">{f.icon}</span>
              <span className="text-[10px] uppercase font-bold tracking-wide">{f.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Colors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Foreground Color */}
        <div className="space-y-3">
          <label htmlFor="fg-color" className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
            <Layers size={14} className="text-slate-500" />
            <span>Foreground</span>
          </label>
          <div className="flex items-center gap-3 bg-slate-800/50 border border-slate-700 p-2 rounded-xl hover:border-slate-600 transition-colors focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 cursor-pointer group">
            <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-white/10 shadow-sm shrink-0">
              <input
                id="fg-color"
                type="color"
                value={fgColor}
                onChange={(e) => setFgColor(e.target.value)}
                className="absolute inset-0 w-[150%] h-[150%] -top-1/4 -left-1/4 cursor-pointer p-0 border-0"
                title="Choose foreground color"
              />
            </div>
            <input
              type="text"
              value={fgColor}
              onChange={(e) => setFgColor(e.target.value)}
              className="bg-transparent border-none text-slate-200 font-mono text-sm uppercase focus:ring-0 p-0 w-full ml-1"
              spellCheck="false"
            />
          </div>
        </div>

        {/* Background Color */}
        <div className="space-y-3">
          <label htmlFor="bg-color" className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
            <Layers size={14} className="text-slate-500" />
            <span>Background</span>
          </label>
          <div className="flex items-center gap-3 bg-slate-800/50 border border-slate-700 p-2 rounded-xl hover:border-slate-600 transition-colors focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 cursor-pointer group">
            <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-white/10 shadow-sm shrink-0">
              <input
                id="bg-color"
                type="color"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                className="absolute inset-0 w-[150%] h-[150%] -top-1/4 -left-1/4 cursor-pointer p-0 border-0"
                title="Choose background color"
              />
            </div>
            <input
              type="text"
              value={bgColor}
              onChange={(e) => setBgColor(e.target.value)}
              className="bg-transparent border-none text-slate-200 font-mono text-sm uppercase focus:ring-0 p-0 w-full ml-1"
              spellCheck="false"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Controls;
