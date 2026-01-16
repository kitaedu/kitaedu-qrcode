import React, { useRef, useState, useEffect } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { Download, Loader2 } from 'lucide-react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';

const QRCodeGenerator = ({ text, fgColor, bgColor, frame, qrType }) => {
    const qrRef = useRef(null);
    const [copied, setCopied] = useState(false);
    const [loading, setLoading] = useState(false);
    const [dynamicUrl, setDynamicUrl] = useState('');
    const [lastGeneratedText, setLastGeneratedText] = useState('');

    const handleDownload = () => {
        const canvas = qrRef.current.querySelector('canvas');
        if (canvas) {
            const pngUrl = canvas.toDataURL('image/png');
            const downloadLink = document.createElement('a');
            downloadLink.href = pngUrl;
            downloadLink.download = `kita-qr-${Date.now()}.png`;
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
        }
    };

    const handleCopy = async () => {
        const canvas = qrRef.current.querySelector('canvas');
        if (canvas) {
            try {
                canvas.toBlob(async (blob) => {
                    const item = new ClipboardItem({ 'image/png': blob });
                    await navigator.clipboard.write([item]);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                });
            } catch (err) {
                console.error('Failed to copy:', err);
            }
        }
    };

    const generateDynamicQR = async () => {
        if (!text) return;
        setLoading(true);
        console.log("Starting Dynamic QR Generation...");

        try {
            if (!db) {
                alert("Firebase is not configured! Check src/firebase.js");
                setLoading(false);
                return;
            }

            // Create a promise that rejects after 15 seconds
            const timeoutPromise = new Promise((_, reject) => {
                setTimeout(() => reject(new Error("Request timed out")), 15000);
            });

            const addDocPromise = addDoc(collection(db, "qr-codes"), {
                url: text,
                createdAt: new Date(),
                type: 'dynamic'
            });

            // Race the addDoc against the timeout
            const docRef = await Promise.race([addDocPromise, timeoutPromise]);
            console.log("Document written with ID: ", docRef.id);

            // Construct the Short URL (pointing to our own app's redirect handler)
            const shortUrl = `${window.location.origin}${window.location.pathname}#/r?id=${docRef.id}`;

            setDynamicUrl(shortUrl);
            setLastGeneratedText(text);
        } catch (error) {
            console.error("Error creating dynamic QR:", error);
            if (error.message === "Request timed out") {
                alert("Connection timed out. Please check your internet or Firebase console settings (ensure Database is created).");
            } else {
                alert(`Error: ${error.message}. Check console for details.`);
            }
        } finally {
            setLoading(false);
        }
    };

    // Reset dynamic ID if user switches back to static or changes text significantly
    useEffect(() => {
        if (qrType === 'static') {
            setDynamicUrl('');
        }
    }, [qrType, text]);

    const qrValue = qrType === 'dynamic' ? (dynamicUrl || text) : text;

    // Frame Renderer Wrapper
    const FrameWrapper = ({ children, frameStyle }) => {
        switch (frameStyle) {
            case 'none':
                return <div className="p-0 bg-transparent rounded-none">{children}</div>;
            case 'neon':
                return (
                    <div className="relative p-6 bg-slate-900 rounded-2xl border-2 border-indigo-500 shadow-[0_0_30px_rgba(99,102,241,0.5)]">
                        <div className="absolute inset-0 rounded-2xl border-2 border-indigo-500 blur-sm"></div>
                        <div className="relative bg-white p-2 rounded-xl">{children}</div>
                    </div>
                );
            case 'polaroid':
                return (
                    <div className="p-4 pb-12 bg-white rounded shadow-xl rotate-1 transform transition-all hover:rotate-0">
                        <div className="border border-slate-100 bg-white">{children}</div>
                        <div className="absolute bottom-4 left-0 right-0 text-center font-handwriting text-slate-800 font-semibold opacity-70">
                            Scan Me
                        </div>
                    </div>
                );
            case 'phone':
                return (
                    <div className="relative px-3 py-12 bg-slate-900 rounded-[3rem] border-4 border-slate-800 shadow-2xl">
                        {/* Notch */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 h-6 w-1/3 bg-slate-800 rounded-b-xl z-20"></div>
                        <div className="relative bg-white rounded-2xl overflow-hidden">{children}</div>
                    </div>
                );
            case 'simple':
            default:
                return (
                    <div className="p-6 bg-white rounded-[32px] shadow-2xl transform transition-all hover:scale-[1.02]">
                        <div className="rounded-xl overflow-hidden">{children}</div>
                    </div>
                );
        }
    };

    return (
        <div className="flex flex-col items-center gap-8 w-full max-w-sm relative">
            {/* Glowing Backdrop */}
            <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full blur-3xl -z-10 pointer-events-none ${qrType === 'dynamic' ? 'bg-rose-500/20' : 'bg-indigo-500/30'}`}></div>

            <div ref={qrRef} className="relative z-10 p-4 transition-all duration-300">
                <FrameWrapper frameStyle={frame}>
                    <QRCodeCanvas
                        value={qrValue || "https://example.com"}
                        size={280}
                        fgColor={fgColor}
                        bgColor={bgColor}
                        level={"H"}
                        includeMargin={false}
                        style={{ display: 'block', width: '100%', height: 'auto' }}
                    />
                </FrameWrapper>

                {/* Dynamic Badge */}
                {qrType === 'dynamic' && (
                    <div className="absolute -top-2 -right-2 bg-rose-500 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-lg border-2 border-slate-900 animate-bounce">
                        Dynamic
                    </div>
                )}
            </div>

            {/* Dynamic Generation Controls */}
            {qrType === 'dynamic' && !dynamicUrl && (
                <button
                    onClick={generateDynamicQR}
                    disabled={loading}
                    className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-rose-500 to-orange-500 text-white font-bold rounded-xl shadow-lg hover:shadow-orange-500/20 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? <Loader2 className="animate-spin" /> : 'Generate Short Link'}
                </button>
            )}

            {qrType === 'dynamic' && dynamicUrl && (
                <div className="text-center animate-fade-in">
                    <p className="text-slate-400 text-xs mb-1">Redirects to: {lastGeneratedText}</p>
                    <button
                        onClick={() => { setDynamicUrl(''); setLastGeneratedText(''); }}
                        className="text-indigo-400 text-xs hover:underline decoration-indigo-400/30"
                    >
                        Create New Link
                    </button>
                </div>
            )}

            {/* Action Buttons */}
            {(qrType === 'static' || dynamicUrl) && (
                <div className="flex items-center gap-4 relative z-10">
                    <button
                        onClick={handleCopy}
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-800 text-white font-medium rounded-xl border border-slate-700 shadow-lg transition-all hover:bg-slate-700 hover:-translate-y-px active:translate-y-0"
                    >
                        {copied ? (
                            <>
                                <span className="text-emerald-400">Copied!</span>
                            </>
                        ) : (
                            <>
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2" /><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" /></svg>
                                <span>Copy</span>
                            </>
                        )}
                    </button>

                    <button
                        onClick={handleDownload}
                        className="btn-primary group"
                    >
                        <Download size={20} className="group-hover:animate-bounce" />
                        <span>Download PNG</span>
                    </button>
                </div>
            )}
        </div>
    );
};

export default QRCodeGenerator;
