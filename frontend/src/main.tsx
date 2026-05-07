import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import './index.css'

import Chat from './Components/Chat'
import Login from './Components/login'

createRoot(document.getElementById('root')!).render(

    <BrowserRouter>

        <Routes>

            <Route path="/" element={<Login />} />

            <Route path="/chat" element={<Chat />} />

        </Routes>

    </BrowserRouter>
)