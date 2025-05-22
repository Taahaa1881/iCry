// components/EmotionDetector.js
import { useState, useEffect, useRef } from 'react';
import { EmotionRecognizer } from '../utils/emotionRecognition';

export default function EmotionDetector() {
  const [recognizer, setRecognizer] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [modelLoaded, setModelLoaded] = useState(false);
  const fileInputRef = useRef(null);
  const canvasRef = useRef(null);

  // Initialize model on component mount
  useEffect(() => {
    const initModel = async () => {
      setLoading(true);
      const er = new EmotionRecognizer();
      const loaded = await er.loadModel();
      
      if (loaded) {
        setRecognizer(er);
        setModelLoaded(true);
      }
      setLoading(false);
    };
    
    initModel();
    
    // Cleanup on unmount
    return () => {
      if (recognizer) {
        recognizer.dispose();
      }
    };
  }, []);

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    
    if (!file || !recognizer || !modelLoaded) return;
    
    setLoading(true);
    setResult(null);
    
    try {
      // Create image element
      const img = new Image();
      
      img.onload = async () => {
        try {
          // Draw image on canvas for preprocessing
          const canvas = canvasRef.current;
          const ctx = canvas.getContext('2d');
          
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);
          
          // Make prediction
          const prediction = await recognizer.predictEmotion(img);
          setResult(prediction);
          
        } catch (error) {
          console.error('Prediction error:', error);
          alert('Error analyzing emotion: ' + error.message);
        } finally {
          setLoading(false);
          // Clean up object URL
          URL.revokeObjectURL(img.src);
        }
      };
      
      img.onerror = () => {
        setLoading(false);
        alert('Error loading image');
      };
      
      img.src = URL.createObjectURL(file);
      
    } catch (error) {
      setLoading(false);
      console.error('Upload error:', error);
      alert('Error processing image');
    }
  };

  const resetDetection = () => {
    setResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-center mb-6">Emotion Detection</h2>
      
      {/* Model Status */}
      <div className="mb-4">
        {loading && <p className="text-blue-600">Loading...</p>}
        {modelLoaded && !loading && <p className="text-green-600">✅ Model Ready</p>}
        {!modelLoaded && !loading && <p className="text-red-600">❌ Model Failed to Load</p>}
      </div>

      {/* File Input */}
      <div className="mb-6">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          disabled={!modelLoaded || loading}
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>

      {/* Hidden Canvas for Image Processing */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />

      {/* Results */}
      {result && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-bold text-lg mb-2">Results:</h3>
          <p className="text-xl mb-2">
            <span className="font-semibold">Emotion:</span> {result.emotion}
          </p>
          <p className="text-lg mb-3">
            <span className="font-semibold">Confidence:</span> {result.confidence}%
          </p>
          
          <h4 className="font-semibold mb-2">All Probabilities:</h4>
          <div className="space-y-1">
            {Object.entries(result.probabilities)
              .sort(([,a], [,b]) => b - a)
              .map(([emotion, prob]) => (
                <div key={emotion} className="flex justify-between">
                  <span className="capitalize">{emotion}:</span>
                  <span>{prob}%</span>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Reset Button */}
      {result && (
        <button
          onClick={resetDetection}
          className="w-full mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Detect Another Emotion
        </button>
      )}
    </div>
  );
}
