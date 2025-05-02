import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import './tailwind-fix.css'
import './styles.css'
import './index.css'
import './preline.css'
import App from './App.jsx'
import { HSStaticMethods } from 'preline/preline'

function AppWithPreline() {
  useEffect(() => {
    // Initialize Preline UI components
    HSStaticMethods.autoInit();
  }, []);

  return (
    <StrictMode>
      <App />
    </StrictMode>
  );
}

createRoot(document.getElementById('root')).render(<AppWithPreline />);
