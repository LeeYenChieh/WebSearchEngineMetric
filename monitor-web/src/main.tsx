import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './Containers/App.tsx'
import { ServerStatusProvider } from './Containers/hook/useServerStatus.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ServerStatusProvider>
      <App />
    </ServerStatusProvider>
  </StrictMode>,
)
