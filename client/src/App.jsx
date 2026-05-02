import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Room from './pages/Room'
import EndPage from './pages/EndPage'

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/stop" element={<EndPage />} />
                <Route path="/:roomId" element={<Room />} />
            </Routes>
        </BrowserRouter>
    )
}

export default App
