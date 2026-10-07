import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import './index.css';
import './i18n';
import { LanguageProvider } from './LanguageContext.tsx';
import { CurrencyProvider } from './CurrencyContext.tsx';
import { CMSProvider } from './CMSContext.tsx';
import GlobalErrorBoundary from './components/GlobalErrorBoundary.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GlobalErrorBoundary>
      <BrowserRouter>
        <LanguageProvider>
          <CurrencyProvider>
            <CMSProvider>
              <App />
            </CMSProvider>
          </CurrencyProvider>
        </LanguageProvider>
      </BrowserRouter>
    </GlobalErrorBoundary>
  </StrictMode>,
);

