import * as tf from '@tensorflow/tfjs';

export class EmotionRecognizer {
    private model: tf.LayersModel | null = null;
    private isModelLoading: boolean = false;
    private modelLoadPromise: Promise<void> | null = null;
    private modelInfo: any = null;

    constructor() {
        this.initialize();
    }

    private async initialize() {
        try {
            // Load model info first
            const modelInfoResponse = await fetch('/tfjs_model/model_info.json');
            if (!modelInfoResponse.ok) {
                throw new Error('Failed to load model info');
            }
            this.modelInfo = await modelInfoResponse.json();
            console.log('Model info loaded:', this.modelInfo);

            // Load emotion model
            await this.loadModel();
        } catch (error) {
            console.error('Error initializing EmotionRecognizer:', error);
            throw error;
        }
    }

    private async loadModel() {
        if (this.isModelLoading) {
            return this.modelLoadPromise;
        }

        this.isModelLoading = true;
        this.modelLoadPromise = (async () => {
            try {
                console.log('Loading model from:', '/tfjs_model/model.json');
                this.model = await tf.loadLayersModel('/tfjs_model/model.json');
                console.log('Model loaded successfully');

                // Verify model structure
                if (!this.model) {
                    throw new Error('Model failed to load');
                }

                // Test model with a dummy input
                const dummyInput = tf.zeros([1, 48, 48, 1]);
                const output = this.model.predict(dummyInput) as tf.Tensor;
                console.log('Model test output shape:', output.shape);
                output.dispose();
                dummyInput.dispose();

            } catch (error) {
                console.error('Error loading model:', error);
                throw error;
            } finally {
                this.isModelLoading = false;
            }
        })();

        return this.modelLoadPromise;
    }

    public async waitForReady(): Promise<void> {
        if (!this.model) {
            await this.loadModel();
        }

    }

    public async detectEmotion(imageElement: HTMLImageElement): Promise<{ emotion: string; confidence: number }> {
        try {
            await this.waitForReady();

            if (!this.model) {
                throw new Error('Model not loaded');
            }

            // Create a canvas to resize the image
            const canvas = document.createElement('canvas');
            canvas.width = 48;
            canvas.height = 48;
            const ctx = canvas.getContext('2d');
            if (!ctx) {
                throw new Error('Failed to get canvas context');
            }

            // Draw and resize the image
            ctx.drawImage(imageElement, 0, 0, 48, 48);

            // Convert to tensor
            const imageData = ctx.getImageData(0, 0, 48, 48);
            const tensor = tf.browser.fromPixels(imageData, 1)
                .toFloat()
                .div(255.0)
                .expandDims(0);

            // Get prediction
            const prediction = await this.model.predict(tensor) as tf.Tensor;
            const scores = await prediction.data();
            const maxScore = Math.max(...scores);
            const emotionIndex = scores.indexOf(maxScore);

            // Cleanup
            tensor.dispose();
            prediction.dispose();

            return {
                emotion: this.modelInfo.labels[emotionIndex],
                confidence: maxScore
            };

        } catch (error) {
            console.error('Error detecting emotion:', error);
            throw error;
        }
    }

    public isReady(): boolean {
        return this.model !== null && this.modelInfo !== null;
    }

    public getModelInfo(): any {
        return this.modelInfo;
    }
} 