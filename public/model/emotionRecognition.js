// utils/emotionRecognition.js
import * as tf from '@tensorflow/tfjs';

export class EmotionRecognizer {
  constructor() {
    this.model = null;
    this.isLoaded = false;
    this.emotionLabels = ["angry", "disgust", "fear", "happy", "neutral", "sad", "surprise"];
  }

  async loadModel(modelPath = '/model/model.json') {
    try {
      console.log('Loading emotion recognition model...');
      this.model = await tf.loadLayersModel(modelPath);
      this.isLoaded = true;
      console.log('✅ Model loaded successfully');
      console.log('Model input shape:', this.model.inputs[0].shape);
      return true;
    } catch (error) {
      console.error('❌ Error loading model:', error);
      this.isLoaded = false;
      return false;
    }
  }

  preprocessImage(imageElement) {
    return tf.tidy(() => {
      // Convert image to tensor (grayscale)
      let tensor = tf.browser.fromPixels(imageElement, 1);
      
      // Resize to 48x48 (model input size)
      tensor = tf.image.resizeBilinear(tensor, [48, 48]);
      
      // Normalize to [0, 1] range
      tensor = tensor.div(255.0);
      
      // Add batch dimension [1, 48, 48, 1]
      tensor = tensor.expandDims(0);
      
      return tensor;
    });
  }

  async predictEmotion(imageElement) {
    if (!this.isLoaded || !this.model) {
      throw new Error('Model not loaded. Call loadModel() first.');
    }

    const preprocessed = this.preprocessImage(imageElement);
    
    try {
      // Make prediction
      const predictions = await this.model.predict(preprocessed).data();
      
      // Find emotion with highest probability
      const maxIndex = predictions.indexOf(Math.max(...predictions));
      const confidence = predictions[maxIndex];
      
      // Create results object
      const result = {
        emotion: this.emotionLabels[maxIndex],
        confidence: parseFloat((confidence * 100).toFixed(2)),
        probabilities: {}
      };
      
      // Add all probabilities
      this.emotionLabels.forEach((label, i) => {
        result.probabilities[label] = parseFloat((predictions[i] * 100).toFixed(2));
      });
      
      // Clean up tensors
      preprocessed.dispose();
      
      return result;
    } catch (error) {
      preprocessed.dispose();
      throw new Error(`Prediction failed: ${error.message}`);
    }
  }

  dispose() {
    if (this.model) {
      this.model.dispose();
      this.isLoaded = false;
    }
  }
}
