import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './tailwind-fix.css'
import './styles.css'
import './index.css'
import './preline.css'
import App from './App.jsx'
import 'preline/preline'
import { initUserData } from './utils/userStorage'
import { initMetricsData } from './utils/metricStorage'
import { initBotData } from './utils/botStorage'

// Initialize all local storage data
initUserData();
initMetricsData();
initBotData();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
