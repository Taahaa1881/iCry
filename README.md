# iSmile - Emotion Recognition Web App

A lightweight, Vercel-optimized web application that performs real-time emotion recognition using TensorFlow.js. The app can analyze emotions from both webcam input and uploaded images.

## Features

- Real-time emotion detection using TensorFlow.js
- Support for both webcam and image upload
- Clean, modern UI with Tailwind CSS
- Mobile-responsive design
- Dark mode support
- Model information viewer

## Prerequisites

- Node.js 18.x or later
- npm or yarn

## Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd ismile
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Place your model files in the `public/model` directory:
- `model.json`
- `group1-shard1of2.bin`
- `group1-shard2of2.bin`
- `model_info.json`

4. Start the development server:
```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment

The app is optimized for deployment on Vercel. Simply connect your repository to Vercel and deploy.

## Project Structure

```
ismile/
├── app/
│   ├── detect/
│   │   └── page.tsx
│   ├── utils/
│   │   └── EmotionRecognizer.ts
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── public/
│   └── model/
│       ├── model.json
│       ├── group1-shard1of2.bin
│       ├── group1-shard2of2.bin
│       └── model_info.json
├── package.json
├── tsconfig.json
└── README.md
```

## Technologies Used

- Next.js 14
- TensorFlow.js
- React Webcam
- Tailwind CSS
- TypeScript

## License

MIT 