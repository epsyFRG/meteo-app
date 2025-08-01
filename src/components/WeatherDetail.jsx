import { useState, useEffect } from "react"
import { ArrowLeft } from "react-bootstrap-icons"
import { useParams, Link } from "react-router-dom"

const API_KEY = "32c017994027bf371c0a54146e96096f"

const WeatherDetail = () => {
  const { city } = useParams()
  const [currentWeather, setCurrentWeather] = useState(null)
  const [forecast, setForecast] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        setLoading(true)
        setError(null)

        const currentResponse = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric&lang=it`
        )

        if (!currentResponse.ok) {
          throw new Error("Città non trovata")
        }

        const currentData = await currentResponse.json()
        setCurrentWeather(currentData)

        const forecastResponse = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric&lang=it`
        )

        if (!forecastResponse.ok) {
          throw new Error("Impossibile ottenere le previsioni")
        }

        const forecastData = await forecastResponse.json()

        const dailyForecasts = []
        const forecastMap = {}

        forecastData.list.forEach((item) => {
          const date = new Date(item.dt * 1000).toLocaleDateString()

          if (!forecastMap[date]) {
            forecastMap[date] = item
            dailyForecasts.push(item)
          }
        })

        setForecast(dailyForecasts.slice(0, 5))
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchWeatherData()
  }, [city])

  if (loading) {
    return <div className="loading">Caricamento in corso...</div>
  }

  if (error) {
    return (
      <div className="error-container">
        <p className="error-message">{error}</p>
        <Link to="/" className="back-link">
          Torna alla ricerca
        </Link>
      </div>
    )
  }

  return (
    <div className="weather-detail-container">
      <Link to="/" className="back-link">
        <ArrowLeft size={24} />
      </Link>

      {currentWeather && (
        <div className="weather-card current-weather">
          <h2 className="city-title">
            {currentWeather.name}, {currentWeather.sys.country}
          </h2>

          <div className="weather-main">
            <img
              src={`https://openweathermap.org/img/wn/${currentWeather.weather[0].icon}@2x.png`}
              alt={currentWeather.weather[0].description}
              className="weather-icon"
            />
            <div className="temperature">
              {Math.round(currentWeather.main.temp)}°C
            </div>
            <div className="weather-description">
              {currentWeather.weather[0].description}
            </div>
          </div>

          <div className="weather-details-container">
            <div className="weather-detail-item">
              <span className="detail-value">
                {Math.round(currentWeather.main.temp_min)}°C /{" "}
                {Math.round(currentWeather.main.temp_max)}°C
              </span>
              <span className="detail-label">Min / Max</span>
            </div>
            <div className="weather-detail-item">
              <span className="detail-value">
                {currentWeather.main.humidity}%
              </span>
              <span className="detail-label">Umidità</span>
            </div>
            <div className="weather-detail-item">
              <span className="detail-value">
                {currentWeather.wind.speed} m/s
              </span>
              <span className="detail-label">Vento</span>
            </div>
          </div>
        </div>
      )}

      {forecast && (
        <div className="forecast-section">
          <h3>Previsioni per i prossimi giorni</h3>
          <div className="forecast-container">
            {forecast.map((day, index) => (
              <div key={index} className="forecast-item">
                <div className="forecast-date">
                  {new Date(day.dt * 1000).toLocaleDateString("it-IT", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                  })}
                </div>
                <img
                  src={`https://openweathermap.org/img/wn/${day.weather[0].icon}.png`}
                  alt={day.weather[0].description}
                  className="forecast-icon"
                />
                <div className="forecast-temp">
                  {Math.round(day.main.temp)}°C
                </div>
                <div className="forecast-description">
                  {day.weather[0].description}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default WeatherDetail
