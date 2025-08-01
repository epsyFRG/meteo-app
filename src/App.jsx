import React from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import HomePage from "./components/HomePage"
import WeatherDetail from "./components/WeatherDetail"
import "./App.css"

function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/weather/:city" element={<WeatherDetail />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
