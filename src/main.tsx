
console.log('🚀 MAIN.TSX: Application starting...');
console.time('⏱️ App Initialization');

import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

console.log('📦 Imports loaded successfully');

const rootElement = document.getElementById("root");
console.log('🎯 Root element found:', !!rootElement);

if (!rootElement) {
  console.error('❌ Root element not found!');
  throw new Error('Root element not found');
}

console.log('🏗️ Creating React root...');
const root = createRoot(rootElement);

console.log('🎨 Rendering App component...');
root.render(<App />);

console.timeEnd('⏱️ App Initialization');
console.log('✅ MAIN.TSX: Application initialization completed');
