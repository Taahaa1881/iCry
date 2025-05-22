'use client';

import { useRouter } from 'next/navigation';

export default function Home() {
    const router = useRouter();

    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh]">
            <h1 className="text-4xl md:text-6xl font-bold mb-8 text-center bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                iSmile
            </h1>
            <p className="text-lg md:text-xl mb-12 text-center max-w-2xl">
                Real-time emotion recognition using TensorFlow.js
            </p>
            <button
                onClick={() => router.push('/detect')}
                className="glow-button"
            >
                Start Detection
            </button>
        </div>
    );
} 