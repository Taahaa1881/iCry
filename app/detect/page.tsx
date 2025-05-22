'use client';

import { useState, useRef, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { EmotionRecognizer } from '../utils/EmotionRecognizer';

const Webcam = dynamic(
    () => import('react-webcam'),
    {
        ssr: false,
        loading: () => <div>Loading camera...</div>
    }
);

export default function Detect() {
    const [capturedImage, setCapturedImage] = useState<string | null>(null);
    const [emotion, setEmotion] = useState<string | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isCameraReady, setIsCameraReady] = useState(false);
    const webcamRef = useRef<any>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const emotionRecognizer = useRef<EmotionRecognizer>(new EmotionRecognizer());

    const handleUserMedia = useCallback(() => {
        console.log('Camera access granted');
        setIsCameraReady(true);
    }, []);

    const handleUserMediaError = useCallback((error: string | DOMException) => {
        console.error('Camera error:', error);
        setError('Failed to access camera. Please check your camera permissions.');
        setIsCameraReady(false);
    }, []);

    const captureImage = useCallback(async () => {
        if (!webcamRef.current || !isCameraReady) {
            console.error('Camera not ready');
            setError('Camera not initialized. Please wait for camera to be ready.');
            return;
        }

        try {
            const imageSrc = webcamRef.current.getScreenshot();
            if (!imageSrc) {
                throw new Error('Failed to capture image');
            }

            setCapturedImage(imageSrc);
            await analyzeEmotion(imageSrc);
        } catch (error) {
            console.error('Error capturing image:', error);
            setError('Failed to capture image. Please try again.');
        }
    }, [isCameraReady]);

    const analyzeEmotion = async (imageSrc: string) => {
        try {
            setIsAnalyzing(true);
            setError(null);

            const img = new Image();
            img.src = imageSrc;
            await new Promise((resolve, reject) => {
                img.onload = resolve;
                img.onerror = reject;
            });

            const result = await emotionRecognizer.current.detectEmotion(img);
            setEmotion(result.emotion);
        } catch (error) {
            console.error('Error analyzing emotion:', error);
            setError('Failed to analyze emotion');
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            try {
                const reader = new FileReader();
                reader.onload = async (e) => {
                    const imageSrc = e.target?.result as string;
                    setCapturedImage(imageSrc);
                    await analyzeEmotion(imageSrc);
                };
                reader.readAsDataURL(file);
            } catch (error) {
                console.error('Error uploading image:', error);
                setError('Failed to upload image');
            }
        }
    };

    const resetState = () => {
        setCapturedImage(null);
        setEmotion(null);
        setError(null);
        setIsCameraReady(false);
    };

    return (
        <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="bg-white shadow rounded-lg p-6">
                    <h1 className="text-2xl font-bold text-gray-900 mb-6">Emotion Detection</h1>

                    {error && (
                        <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-md">
                            {error}
                        </div>
                    )}

                    <div className="space-y-4">
                        {!capturedImage && (
                            <div className="flex space-x-4">
                                <button
                                    onClick={() => setIsCameraReady(false)}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                >
                                    Use Camera
                                </button>
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                                >
                                    Upload Image
                                </button>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileUpload}
                                    accept="image/*"
                                    className="hidden"
                                />
                            </div>
                        )}

                        {!capturedImage && (
                            <div className="relative">
                                {!isCameraReady && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
                                        <div className="text-center">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                                            <p className="mt-2 text-gray-600">Initializing camera...</p>
                                        </div>
                                    </div>
                                )}
                                <Webcam
                                    audio={false}
                                    screenshotFormat="image/jpeg"
                                    videoConstraints={{
                                        width: 640,
                                        height: 480,
                                        facingMode: "user"
                                    }}
                                    onUserMedia={handleUserMedia}
                                    onUserMediaError={handleUserMediaError}
                                    className="w-full rounded-lg"
                                    ref={webcamRef}
                                    mirrored={true}
                                />
                                <div className="mt-4 flex space-x-4">
                                    <button
                                        onClick={captureImage}
                                        disabled={!isCameraReady}
                                        className={`px-4 py-2 rounded-md ${isCameraReady
                                                ? 'bg-blue-600 text-white hover:bg-blue-700'
                                                : 'bg-gray-400 text-white cursor-not-allowed'
                                            }`}
                                    >
                                        {isCameraReady ? 'Capture' : 'Initializing...'}
                                    </button>
                                    <button
                                        onClick={resetState}
                                        className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        )}

                        {capturedImage && (
                            <div className="space-y-4">
                                <img
                                    src={capturedImage}
                                    alt="Captured"
                                    className="w-full rounded-lg"
                                />
                                <div className="flex space-x-4">
                                    <button
                                        onClick={resetState}
                                        className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                                    >
                                        Clear
                                    </button>
                                    <button
                                        onClick={() => setIsCameraReady(false)}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                    >
                                        Use Camera
                                    </button>
                                    <button
                                        onClick={() => fileInputRef.current?.click()}
                                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                                    >
                                        Upload Another
                                    </button>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleFileUpload}
                                        accept="image/*"
                                        className="hidden"
                                    />
                                </div>
                            </div>
                        )}

                        {isAnalyzing && (
                            <div className="text-center py-4">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                                <p className="mt-2 text-gray-600">Analyzing emotion...</p>
                            </div>
                        )}

                        {emotion && !isAnalyzing && (
                            <div className="mt-4 p-4 bg-green-50 text-green-700 rounded-md">
                                Detected Emotion: {emotion}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
} 