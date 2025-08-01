import { useState } from "react"
import { useNavigate } from "react-router-dom"

const HomePage = () => {
  const [city, setCity] = useState("")
  const navigate = useNavigate()

  const popularCities = ["Roma", "Milano", "Napoli", "Torino", "Firenze"]

  const handleSearch = (e) => {
    e.preventDefault()
    if (city.trim()) {
      navigate(`/weather/${city}`)
    }
  }

  return (
    <div className="home-container">
      <h1>Meteo App</h1>

      <form onSubmit={handleSearch} className="search-container">
        <input
          type="text"
          className="search-input"
          placeholder="Cerca una città..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <button type="submit" className="search-button">
          Cerca
        </button>
      </form>

      <div className="popular-cities">
        <p className="popular-label">CITTÀ POPOLARI</p>
        <div className="city-chips">
          {popularCities.map((cityName) => (
            <button
              key={cityName}
              className="city-chip"
              onClick={() => navigate(`/weather/${cityName}`)}
            >
              {cityName}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default HomePage
