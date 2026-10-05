import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import './index.css'
import './lib/i18n'

import App from './App.jsx'
// import Providers from './providers/index.jsx'
import LenisScroll from './components/LenisScroll'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* <Providers> */}
      <LenisScroll>
        <App />
      </LenisScroll>
    {/* </Providers> */}
  </StrictMode>,
)
