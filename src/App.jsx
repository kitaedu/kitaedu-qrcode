import React, { useState, useEffect } from 'react';
import { Sparkles, QrCode } from 'lucide-react';
import Controls from './components/Controls';
import QRCodeGenerator from './components/QRCodeGenerator';
import RedirectHandler from './components/RedirectHandler';
import './styles/index.css';
import './styles/btn-shine.css';

function App() {
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    // Check if current URL is a redirect link (e.g., #/r?id=...)
    const checkRedirect = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#/r')) {
        setIsRedirecting(true);
      } else {
        setIsRedirecting(false);
      }
    };

    checkRedirect();
    window.addEventListener('hashchange', checkRedirect);
    return () => window.removeEventListener('hashchange', checkRedirect);
  }, []);

  const [text, setText] = useState('https://example.com');
  const [fgColor, setFgColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [frame, setFrame] = useState('simple');
  const [qrType, setQrType] = useState('static'); // 'static' or 'dynamic'

  if (isRedirecting) {
    return <RedirectHandler />;
  }

  return (
    <>
      <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 -z-50"></div>
      <div className="background-blobs">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="blob blob-3"></div>
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-screen flex flex-col py-8 sm:py-12">

        <header className="mb-12 flex items-center justify-between animate-fade-in">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-12 h-12 bg-white rounded-xl shadow-lg shadow-indigo-500/20 overflow-hidden p-1">
              <img src="/logo.png" alt="KITA Edu Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight leading-none text-slate-50">
                KITA QR
              </h1>
              <p className="text-slate-400 text-sm font-medium">Generator</p>
            </div>
          </div>


        </header>

        <main className="glass-card w-full grid grid-cols-1 md:grid-cols-12 min-h-[600px] animate-fade-in animation-delay-100">

          {/* Left Column: Controls */}
          <div className="md:col-span-5 lg:col-span-4 p-8 border-b md:border-b-0 md:border-r border-white/5 bg-slate-900/30">
            <div className="flex items-center gap-2 mb-8">
              <Sparkles size={18} className="text-indigo-400" />
              <h2 className="text-lg font-semibold text-slate-200">Customization</h2>
            </div>

            <Controls
              text={text}
              setText={setText}
              fgColor={fgColor}
              setFgColor={setFgColor}
              bgColor={bgColor}
              setBgColor={setBgColor}
              frame={frame}
              setFrame={setFrame}
              qrType={qrType}
              setQrType={setQrType}
            />
          </div>

          {/* Right Column: Preview */}
          <div className="md:col-span-7 lg:col-span-8 relative flex items-center justify-center p-8 sm:p-12 overflow-hidden bg-black/20">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(99,102,241,0.15)_0%,_transparent_70%)] pointer-events-none"></div>

            <QRCodeGenerator
              text={text}
              fgColor={fgColor}
              bgColor={bgColor}
              frame={frame}
              qrType={qrType}
            />
          </div>
        </main>

        <footer className="mt-auto pt-12 text-center pb-6">
          <p className="text-slate-500 text-sm">
            © {new Date().getFullYear()} QR Master by KITA Edu.
            <span className="mx-2 opacity-50">|</span>
            Crafted with <span className="text-rose-500">♥</span>
          </p>
        </footer>
      </div>
    </>
  );
}

export default App;
