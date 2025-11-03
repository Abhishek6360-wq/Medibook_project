import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Admincontextprovider, { Admincontext } from './context/admincontext.jsx'
import Doctorcontextprovider, { Doctorcontext } from './context/doctorcontext.jsx'
import Appcontextprovider, { Appcontext } from './context/appcontext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Admincontextprovider>
      <Doctorcontextprovider>
        <Appcontextprovider>
          <App />
        </Appcontextprovider>
      </Doctorcontextprovider>
    </Admincontextprovider>    
  </StrictMode>,
)
