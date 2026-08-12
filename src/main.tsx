import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

// `!` — #root always exists in index.html; without it nothing can render anyway.
ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
)
