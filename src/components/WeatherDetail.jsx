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

        const today = new Date()
        const todayDateString = today.toDateString()

        const dailyData = {}

        forecastData.list.forEach((item) => {
          const itemDate = new Date(item.dt * 1000)
          const dateString = itemDate.toDateString()

          if (dateString === todayDateString) {
            return
          }

          if (!dailyData[dateString]) {
            dailyData[dateString] = {
              items: [],
              date: itemDate,
              midDayItem: null,
            }
          }

          dailyData[dateString].items.push(item)

          const hour = itemDate.getHours()
          if (hour >= 12 && hour <= 15) {
            if (
              !dailyData[dateString].midDayItem ||
              Math.abs(hour - 12) <
                Math.abs(
                  new Date(
                    dailyData[dateString].midDayItem.dt * 1000
                  ).getHours() - 12
                )
            ) {
              dailyData[dateString].midDayItem = item
            }
          }
        })

        const sortedDates = Object.keys(dailyData).sort(
          (a, b) => new Date(a) - new Date(b)
        )

        const dailyForecasts = sortedDates.slice(0, 5).map((dateString) => {
          const dayData = dailyData[dateString]

          if (dayData.midDayItem) {
            return {
              ...dayData.midDayItem,
              main: {
                ...dayData.midDayItem.main,
                temp_min: Math.min(
                  ...dayData.items.map((item) => item.main.temp_min)
                ),
                temp_max: Math.max(
                  ...dayData.items.map((item) => item.main.temp_max)
                ),
              },
            }
          } else {
            const avgTemp =
              dayData.items.reduce((sum, item) => sum + item.main.temp, 0) /
              dayData.items.length
            const firstItem = dayData.items[0]
            return {
              ...firstItem,
              main: {
                ...firstItem.main,
                temp: avgTemp,
                temp_min: Math.min(
                  ...dayData.items.map((item) => item.main.temp_min)
                ),
                temp_max: Math.max(
                  ...dayData.items.map((item) => item.main.temp_max)
                ),
              },
            }
          }
        })

        setForecast(dailyForecasts)
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
                <div className="forecast-temp-range">
                  {Math.round(day.main.temp_min)}° /{" "}
                  {Math.round(day.main.temp_max)}°
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
