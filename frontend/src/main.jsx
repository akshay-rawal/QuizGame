
import { createRoot } from 'react-dom/client'
import './index.css'
import React from 'react';
import App from './App.jsx'
import { Provider } from 'react-redux'
import { HashRouter as Router } from 'react-router-dom'; 
import store from './store/store.js'
import SessionManager from '../utills/sessionInitializer.jsx'
import { ThemeProvider } from './components/ThemeContext.jsx'
createRoot(document.getElementById('root')).render(
 
 
    <Provider store={store}>
    <Router>
      <SessionManager>
        <ThemeProvider>
    <App />
    </ThemeProvider>
    </SessionManager>
    </Router>
    </Provider>
    
  
)
