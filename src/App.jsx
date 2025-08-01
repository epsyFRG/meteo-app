import React from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import HomePage from "./components/HomePage"
import WeatherDetail from "./components/WeatherDetail"

import "./App.css"

function App() {
  return (
    <Router>
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/weather/:city" element={<WeatherDetail />} />
        </Routes>
      </main>
    </Router>
  )
}

export default App
