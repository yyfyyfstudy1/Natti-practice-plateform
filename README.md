## Environment setup

Create a `.env.local` file in the project root (this file is git-ignored) and provide your Firebase values:

```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
VITE_FIREBASE_MEASUREMENT_ID=...
```

Alternatively, you can create `.env.development`/`.env.production` using the same keys. Vite exposes them as `import.meta.env.VITE_*`.

## Serverless audio generation (Firebase Functions + OpenAI TTS)

1) Install Firebase CLI and login
```
npm i -g firebase-tools
firebase login
```

2) Configure secrets (recommended)
```
firebase functions:secrets:set OPENAI_API_KEY
# Optional voice settings
firebase functions:secrets:set OPENAI_TTS_MODEL --data="gpt-4o-mini-tts"
firebase functions:secrets:set OPENAI_TTS_VOICE --data="alloy"
```

3) Deploy functions
```
cd functions
npm run deploy
```

Local emulation (optional)
```
cd functions
cp .env.example .env
# fill in OPENAI_API_KEY, then
npm run serve
```

The function `onQuestionDetailWrite` listens to Firestore `questionDetails/{docId}` and will auto-generate audio for introduction and dialogs if missing, uploading files to Storage at `auto_audio/{docId}/...` and patching URLs back onto the document.

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
