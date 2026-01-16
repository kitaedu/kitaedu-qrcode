import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { Loader2 } from 'lucide-react';

const RedirectHandler = () => {
    const [status, setStatus] = useState('loading'); // loading, error
    const [targetUrl, setTargetUrl] = useState('');

    useEffect(() => {
        const handleRedirect = async () => {
            // Parse query parameter ?id=XYZ
            const params = new URLSearchParams(window.location.search); // For standard URL
            // OR if using hash router method manually: #/r?id=XYZ
            // Let's support the hash params format since that's likely for GitHub Pages
            let id = params.get('id');

            // Fallback: check hash if not in search
            if (!id && window.location.hash.includes('?id=')) {
                const hashParams = new URL(window.location.href).hash.split('?')[1];
                const p = new URLSearchParams(hashParams);
                id = p.get('id');
            }

            if (!id) {
                setStatus('error');
                return;
            }

            try {
                if (!db) throw new Error("Firebase not initialized");

                const docRef = doc(db, "qr-codes", id);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const data = docSnap.data();
                    if (data.url) {
                        setStatus('redirecting');
                        window.location.href = data.url;
                    } else {
                        setStatus('error');
                    }
                } else {
                    console.error("No such document!");
                    setStatus('error');
                }
            } catch (error) {
                console.error("Error fetching document:", error);
                setStatus('error');
            }
        };

        handleRedirect();
    }, []);

    if (status === 'error') {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 text-white p-4 text-center">
                <div className="text-rose-500 mb-4 text-5xl">⚠️</div>
                <h1 className="text-2xl font-bold mb-2">Link Not Found</h1>
                <p className="text-slate-400">The QR code you scanned is invalid or the destination has been removed.</p>
                <a href="/" className="mt-8 px-6 py-2 bg-indigo-600 rounded-lg font-medium hover:bg-indigo-500 transition-colors">
                    Go to Generator
                </a>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 text-white">
            <Loader2 className="w-12 h-12 text-indigo-500 animate-spin mb-4" />
            <p className="text-slate-400 font-medium animate-pulse">Redirecting...</p>
        </div>
    );
};

export default RedirectHandler;
