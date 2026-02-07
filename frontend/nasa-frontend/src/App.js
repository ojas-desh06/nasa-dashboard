import React, { useState, useEffect } from 'react';
import { getAPOD, getNEO, getISSLocation, getEarthEvents } from './services/api';
import './App.css';

function APODCard({ item }) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div className="apod-card-wrapper">
      <div 
        className={`apod-card ${isFlipped ? 'flipped' : ''}`}
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <div className="card-inner">
          <div className="card-front">
            <h2>{item.title}</h2>
            <p className="date">{item.date}</p>
            {item.media_type === 'image' ? (
              <img src={item.url} alt={item.title} />
            ) : (
              <p>Video content</p>
            )}
            <p className="click-hint">💫 Click to read more</p>
          </div>
          <div className="card-back">
            <h2>{item.title}</h2>
            <p className="explanation">{item.explanation}</p>
            <p className="click-hint">🔙 Click to go back</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function APODGallery({ apodData }) {
  return (
    <div className="apod-gallery">
      {apodData.map((item, index) => (
        <APODCard key={index} item={item} />
      ))}
    </div>
  );
}

function App() {
  const [apod, setApod]  = useState(null);
  const [neo, setNeo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('apod');
  const [error, setError] = useState(null);
  const [iss, setIss] = useState(null);
  const [events, setEvents] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    Promise.all([
      getAPOD().then(data => setApod(data)).catch(err => {
        console.error('APOD error:', err);
        throw new Error('Failed to load Astronomy Pictures');
      }),
      getNEO().then(data => setNeo(data)).catch(err => {
        console.error('NEO error:', err);
        throw new Error('Failed to load Near Earth Objects');
      }),
      getISSLocation().then(data => setIss(data)).catch(err => {
        console.error('ISS error:', err);
        throw new Error('Failed to Load ISS Location');
      }),
      getEarthEvents().then(data => setEvents(data)).catch(err => {
        console.error('Earth Events error:', err);
        throw new Error('Failed to load Earth Events');
      })

    ])
    .catch(err => {
      setError(err.message);
    })
    .finally(() => {
      setLoading(false);
    })

    }, []);

    const handleRetry = () => {
      window.location.reload();
    };
    
  

  if (loading) {
    return (
      <div className="App">
        <h1> NASA Mission Dashboard</h1>
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading NASA data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="App">
        <h1> NASA Mission Dashboard</h1>
        <div className="error-container">
          <div className="error-icon">⚠️</div>
          <h2> Oops! Something went wrong.</h2>
          <p>{error}</p>
          <button className="retry-button" onClick={handleRetry}>
            Try again
          </button>
        </div>
      </div>
    )
  }  

  return (
    <div className="App">
      <h1> NASA Mission Dashboard </h1>
      <div className="tabs">
        <button
          className={activeTab === 'apod' ? 'active' :  ''}
          onClick={() => setActiveTab('apod')}
        >
          Astronomy Picture
        </button>
        <button
          className={activeTab === 'neo' ? 'active' : ''}
          onClick={() => setActiveTab('neo')}
        >
          Near Earth Objects
        </button>
        <button
          className={activeTab === 'iss' ? 'active' : ''}
          onClick={() => setActiveTab('iss')}
        >
          ISS Tracker
        </button>
        <button
          className={activeTab === 'events' ? 'active' : ''}
          onClick={() => setActiveTab('events')}
        >
          Earth Events
        </button>
      </div>

      <div className="container">
        {activeTab === 'apod' && apod && (
          <APODGallery apodData={apod} />
        )}

        {activeTab === 'neo' && neo && ( 
          <div className="neo-card">
            <h2>Near Earth Objects</h2>
            <p className="count">Asteroids near Earth today: <span>{neo.element_count}</span></p>
          </div>
        )}
        {activeTab === 'iss' && iss && (
          <div className="iss-card">
            <h2>🛰️ International Space Station</h2>
            <p className="iss-subtitle">Live Location</p>
            <div className="iss-info">
              <div className="coord">
                <span className="label">Latitude:</span>
                <span className="value">{parseFloat(iss.iss_position.latitude).toFixed(4)}°</span>
              </div>
              <div className="coord">
                <span className="label">Longitude:</span>
                <span className="value">{parseFloat(iss.iss_position.longitude).toFixed(4)}°</span>
              </div>
              <div className="coord">
                <span className="label">Last Updated:</span>
                <span className="value">{new Date(iss.timestamp * 1000).toLocaleTimeString()}</span>
              </div>
          </div>
          <p className="iss-note">The ISS orbits Earth every ~90 minutes at about 408 km altitude</p>
          </div>
        )}
        {activeTab === 'events' && events && (
          <div className='events-card'>
            <h2> Natural Events on Earth</h2>
            <p className='events-subtitle'>Tracked From Space Satellites</p>
            <div className='events-grid'>
              {events.events.slice(0, 9).map((event) => (
                <div key={event.id} className='event-card'>
                  <h3>{event.title}</h3>
                  <div className='event=details'>
                    <span className='event-category'>{event.categories[0].title}</span>
                    <span className='event-date'>
                      {new Date(event.geometry[0].date).toLocaleDateString()
                    }</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
