# Vercel Deployment Instructions

## 1. Setup Your Next.js Project
```bash
npx create-next-app@latest emotion-detector
cd emotion-detector
npm install @tensorflow/tfjs
```

## 2. Project Structure
```
your-nextjs-app/
├── public/
│   └── model/                 # ← Put your converted model files here
│       ├── model.json
│       ├── group1-shard1of*.bin
│       └── model_info.json
├── components/
│   └── EmotionDetector.js     # ← Main component
├── utils/
│   └── emotionRecognition.js  # ← Model utilities
└── pages/
    └── index.js               # ← Your main page
```

## 3. Copy Model Files
1. Download the converted model files from this Colab
2. Create a `model` folder in your `public` directory
3. Copy all `.json` and `.bin` files into `public/model/`

## 4. Add Components
1. Copy the provided `emotionRecognition.js` to `utils/`
2. Copy the provided `EmotionDetector.js` to `components/`
3. Import and use in your pages

## 5. Deploy to Vercel
```bash
npm install -g vercel
vercel --prod
```

## 6. Important Notes
- Model files must be in `public/model/` directory
- Total deployment size should be under 100MB for Vercel
- Test locally first: `npm run dev`

## 7. Troubleshooting
- If model is too large, use quantization
- Check browser console for loading errors
- Ensure all file paths are correct
