import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { ArticleProvider } from './context/ArticleContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ArticleProvider>
      <App />
    </ArticleProvider>
  </StrictMode>,
)
