import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Search } from "react-bootstrap-icons"
import TrueFocusTitle from "./TrueFocusTitle"
import ShinyText from "./ShinyText"

const HomePage = () => {
  const [city, setCity] = useState("")
  const navigate = useNavigate()

  const popularCities = [
    { name: "Roma", query: "Roma,it" },
    { name: "Milano", query: "Milano,it" },
    { name: "Napoli", query: "Napoli,it" },
    { name: "Torino", query: "Torino,it" },
    { name: "Firenze", query: "Firenze,it" },
  ]

  const handleSearch = (e) => {
    e.preventDefault()
    if (city.trim()) {
      navigate(`/weather/${city}`)
    }
  }

  return (
    <div className="home-container">
      <TrueFocusTitle
        sentence="Epsy Meteo"
        manualMode={false}
        blurAmount={5}
        borderColor="#0F52BA"
        animationDuration={2}
        pauseBetweenAnimations={1}
      >
        Meteo Vibrance
      </TrueFocusTitle>

      <form onSubmit={handleSearch} className="search-container">
        <input
          type="text"
          className="search-input"
          placeholder="Cerca una città..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <button type="submit" className="search-button">
          <Search size={22} />
        </button>
      </form>

      <div className="popular-cities">
        <p className="popular-label">CITTÀ POPOLARI</p>
        <div className="city-chips">
          {popularCities.map(({ name, query }) => (
            <button
              key={name}
              className="city-chip"
              onClick={() => navigate(`/weather/${query}`)}
            >
              <ShinyText
                text={name}
                disabled={false}
                speed={3}
                className="custom-class"
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default HomePage
