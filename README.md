# iSmile - Emotion Detection Web Application

iSmile is a web application that uses TensorFlow.js to detect emotions from images and webcam captures. Built with Next.js and modern web technologies, it provides a user-friendly interface for real-time emotion analysis.

## 🚀 Features

- Real-time emotion detection from webcam
- Image upload for emotion analysis
- Support for 7 basic emotions
- Responsive and modern UI
- Optimized model loading and inference
- Dark mode support
- Model information viewer

## 🧠 Model Details

### Training Approach
- **Architecture**: Convolutional Neural Network (CNN) with Transfer Learning
- **Base Model**: Pre-trained CNN for feature extraction
- **Accuracy**: 60% on test set
- **Training Time**: ~3 Quarter hour on GPU
- **Optimization**: Adam optimizer with learning rate scheduling

### Dataset
The model is trained on the [FER2013 (Facial Expression Recognition 2013)](https://www.kaggle.com/datasets/msambare/fer2013) dataset:
- **Total Images**: 35,887
- **Categories**: 7 emotions (Angry, Disgust, Fear, Happy, Sad, Surprise, Neutral)
- **Image Size**: 48x48 pixels (grayscale)
- **Split**:
  - Training: 28,709 images
  - Public Test: 3,589 images
  - Private Test: 3,589 images

### Model Performance
- **Training Accuracy**: 64%
- **Validation Accuracy**: 62%

## 🛠️ Tech Stack

- **Frontend Framework**: Next.js 14
- **AI/ML**: TensorFlow.js
- **Styling**: Tailwind CSS
- **Deployment**: Vercel
- **Language**: TypeScript
- **Package Manager**: npm

## 📁 Project Structure

```
iSmile/
├── app/
│   ├── detect/
│   │   └── page.tsx        # Main emotion detection page
│   ├── utils/
│   │   └── EmotionRecognizer.ts  # Emotion detection logic
│   ├── globals.css         # Global styles
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Home page
├── public/
│   └── tfjs_model/         # TensorFlow.js model files
│       ├── model.json
│       ├── group1-shard1of2.bin
│       ├── group1-shard2of2.bin
│       └── model_info.json
├── package.json
├── tsconfig.json
├── next.config.js
├── postcss.config.js
├── tailwind.config.js
├── types.d.ts
├── vercel.json
└── README.md
```

## 🚀 Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/Taahaa1881/iCry.git
   cd iCry
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🤖 AI Development Tools

This project was developed using:
- **Cursor AI**: For intelligent code completion and refactoring
- **Generative AI**: For architecture design and implementation assistance
- **GitHub Copilot**: For code suggestions and improvements

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

### Development Guidelines

- Follow the existing code style
- Add comments for complex logic
- Update documentation for new features
- Test thoroughly before submitting PRs
- Ensure all tests pass before submitting PRs

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🔗 Links

- [Live Demo](https://i-cry.vercel.app/)
- [GitHub Repository](https://github.com/Taahaa1881/iCry)
- [Issue Tracker](https://github.com/Taahaa1881/iCry/issues)
- [FER2013 Dataset](https://www.kaggle.com/datasets/msambare/fer2013)
