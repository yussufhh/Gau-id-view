import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Home from './pages/Home'
import About from './pages/About'
import Features from './pages/Features'
import HowItWorks from './pages/HowItWorks'
import Contact from './pages/Contact'
import ProblemsPage from './pages/ProblemsPage'

const App = () => {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/features" element={<Features />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/problems" element={<ProblemsPage />} />
        </Routes>
      </main>
    </div>
  )
}

export default App