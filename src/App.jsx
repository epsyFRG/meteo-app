import React from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import HomePage from "./components/HomePage"
import WeatherDetail from "./components/WeatherDetail"
import Aurora from "./components/Aurora"
import "./App.css"

function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <Aurora
          colorStops={["#0047AB", "#A2CADF", "#0047AB"]}
          blend={0.5}
          amplitude={1.0}
          speed={0.5}
        />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/weather/:city" element={<WeatherDetail />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
