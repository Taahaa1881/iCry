declare module 'react-webcam' {
    import { Component } from 'react';

    export interface WebcamProps {
        audio?: boolean;
        audioConstraints?: MediaTrackConstraints;
        screenshotFormat?: 'image/webp' | 'image/png' | 'image/jpeg';
        videoConstraints?: MediaTrackConstraints;
        onUserMedia?: () => void;
        onUserMediaError?: (error: string | DOMException) => void;
        className?: string;
        mirrored?: boolean;
        ref?: any;
    }

    export default class Webcam extends Component<WebcamProps> {
        getScreenshot(): string | null;
    }
} 