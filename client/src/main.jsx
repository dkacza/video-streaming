import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {CssBaseline, CssVarsProvider} from '@mui/joy';
import { MovieProvider } from './MovieProvider.jsx';
import Root from './Root.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CssVarsProvider>
      <CssBaseline>
        <MovieProvider>
          <Root/>
        </MovieProvider>
      </CssBaseline>
    </CssVarsProvider>
  </StrictMode>,
)
