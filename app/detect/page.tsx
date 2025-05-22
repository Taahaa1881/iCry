'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { EmotionRecognizer } from '../utils/EmotionRecognizer';

export default function Detect() {
    const [capturedImage, setCapturedImage] = useState<string | null>(null);
    const [emotion, setEmotion] = useState<string | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isCameraReady, setIsCameraReady] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const emotionRecognizer = useRef<EmotionRecognizer>(new EmotionRecognizer());
    const streamRef = useRef<MediaStream | null>(null);

    const startCamera = async () => {
        setError(null);
        setIsCameraReady(false);

        try {
            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                throw new Error('Camera API not supported in this browser.');
            }

            if (!videoRef.current) {
                throw new Error('Video element not found. Please try again.');
            }

            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    width: { ideal: 640 },
                    height: { ideal: 480 },
                    facingMode: 'user',
                },
            });

            if (!videoRef.current) {
                stream.getTracks().forEach(track => track.stop());
                throw new Error('Video element not found. Please try again.');
            }

            videoRef.current.srcObject = stream;
            streamRef.current = stream;

            await new Promise<void>((resolve, reject) => {
                if (!videoRef.current) {
                    reject(new Error('Video element not found'));
                    return;
                }

                videoRef.current.onloadedmetadata = () => {
                    videoRef.current?.play()
                        .then(() => {
                            setIsCameraReady(true);
                            resolve();
                        })
                        .catch(reject);
                };

                videoRef.current.onerror = () => {
                    reject(new Error('Failed to load video stream'));
                };
            });

        } catch (err: any) {
            console.error('Error starting camera:', err);
            setError(err.message || 'Could not access the camera. Please allow permissions or check device settings.');
            setIsCameraReady(false);

            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
                streamRef.current = null;
            }
        }
    };

    const stopCamera = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach((track) => track.stop());
            streamRef.current = null;
        }

        if (videoRef.current) {
            videoRef.current.srcObject = null;
            videoRef.current.onloadedmetadata = null;
            videoRef.current.onerror = null;
        }

        setIsCameraReady(false);
    };

    const captureImage = useCallback(async () => {
        if (!videoRef.current || !canvasRef.current || !isCameraReady) {
            setError('Camera not ready. Please wait for camera to initialize.');
            return;
        }

        try {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            const context = canvas.getContext('2d');

            if (!context) {
                throw new Error('Could not get canvas context');
            }

            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            context.drawImage(video, 0, 0, canvas.width, canvas.height);

            const imageSrc = canvas.toDataURL('image/jpeg');
            setCapturedImage(imageSrc);
            stopCamera();
            await analyzeEmotion(imageSrc);
        } catch (error) {
            console.error('Error capturing image:', error);
            setError('Failed to capture image');
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
        stopCamera();
    };

    useEffect(() => {
        return () => {
            stopCamera();
        };
    }, []);

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
                                    onClick={startCamera}
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
                                <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                                    <video
                                        ref={videoRef}
                                        autoPlay
                                        playsInline
                                        muted
                                        className="w-full h-full object-cover"
                                        style={{ display: isCameraReady ? 'block' : 'none' }}
                                    />
                                </div>
                                <canvas ref={canvasRef} className="hidden" />
                                {!isCameraReady && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
                                        <div className="text-center">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                                            <p className="mt-2 text-gray-600">Initializing camera...</p>
                                        </div>
                                    </div>
                                )}
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
                                        onClick={startCamera}
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