import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {CssBaseline, CssVarsProvider} from '@mui/joy';
import { VideoProvider } from './VideoProvider.jsx';
import Root from './Root.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CssVarsProvider>
      <CssBaseline>
        <VideoProvider>
          <Root/>
        </VideoProvider>
      </CssBaseline>
    </CssVarsProvider>
  </StrictMode>,
)
