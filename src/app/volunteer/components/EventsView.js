"use client";

import { useState } from 'react';
import styles from './Forms.module.css';
import { API_KEY } from '@/app/components/constants.js'; 

export default function EventsView() {
  const [events, setEvents] = useState([]);
  const [searchDate, setSearchDate] = useState('');
  const [searchLocation, setSearchLocation] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const listAllEvents = async () => {
    setIsLoading(true);
    setMessage('');
    setEvents([]);

    const apiEndpoint = `http://localhost:8080/listEvents?apiKey=${encodeURIComponent(API_KEY)}`;

    try {
      const response = await fetch(apiEndpoint, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setEvents(data);
        setMessage(`Successfully retrieved ${data.length} event(s).`);
      } else {
        const errorData = await response.text();
        setMessage(`Error: ${errorData}`);
      }
    } catch (err) {
      console.error(err);
      setMessage('An unexpected error occurred while fetching all events.');
    } finally {
      setIsLoading(false);
    }
  };

  const searchEventsByDate = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');
    setEvents([]);

    if (!searchDate) {
      setMessage('Please enter a date to search.');
      setIsLoading(false);
      return;
    }

    const apiEndpoint = `http://localhost:8080/searchEventsByDate?apiKey=${encodeURIComponent(API_KEY)}&date=${encodeURIComponent(searchDate)}`;

    try {
      const response = await fetch(apiEndpoint, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setEvents(data);
        setMessage(`Found ${data.length} event(s) on ${searchDate}.`);
      } else {
        const errorData = await response.text();
        setMessage(`Error: ${errorData}`);
      }
    } catch (err) {
      console.error(err);
      setMessage('An unexpected error occurred while searching events by date.');
    } finally {
      setIsLoading(false);
    }
  };

  const searchEventsByLocation = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');
    setEvents([]);

    if (!searchLocation) {
      setMessage('Please enter a location to search.');
      setIsLoading(false);
      return;
    }

    const apiEndpoint = `http://localhost:8080/searchEventsByLocation?apiKey=${encodeURIComponent(API_KEY)}&location=${encodeURIComponent(searchLocation)}`;

    try {
      const response = await fetch(apiEndpoint, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setEvents(data);
        setMessage(`Found ${data.length} event(s) at location "${searchLocation}".`);
      } else {
        const errorData = await response.text();
        setMessage(`Error: ${errorData}`);
      }
    } catch (err) {
      console.error(err);
      setMessage('An unexpected error occurred while searching events by location.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h2>Events</h2>
      
      <div className={styles.section}>
        <button onClick={listAllEvents} className={styles.submitButton} disabled={isLoading}>
          {isLoading ? 'Loading...' : 'List All Events'}
        </button>
      </div>
      <div className={styles.section}>
        <h3>Search Events by Date</h3>
        <form onSubmit={searchEventsByDate} className={styles.form}>
          <label>
            Date:
            <input
              type="date"
              value={searchDate}
              onChange={(e) => setSearchDate(e.target.value)}
              required
              className={styles.input}
            />
          </label>
          <button type="submit" className={styles.submitButton} disabled={isLoading}>
            {isLoading ? 'Searching...' : 'Search by Date'}
          </button>
        </form>
      </div>

      <div className={styles.section}>
        <h3>Search Events by Location</h3>
        <form onSubmit={searchEventsByLocation} className={styles.form}>
          <label>
            Location:
            <input
              type="text"
              value={searchLocation}
              onChange={(e) => setSearchLocation(e.target.value)}
              required
              className={styles.input}
              placeholder="e.g., Central Park"
            />
          </label>
          <button type="submit" className={styles.submitButton} disabled={isLoading}>
            {isLoading ? 'Searching...' : 'Search by Location'}
          </button>
        </form>
      </div>

      {message && <p className={styles.message}>{message}</p>}

      {events.length > 0 && (
        <div className={styles.eventsList}>
          <h3>Events:</h3>
          <ul>
            {events.map((event) => (
              <li key={event.id} className={styles.eventItem}>
                <h4>{event.name}</h4>
                <p><strong>Date:</strong> {event.date}</p>
                <p><strong>Location:</strong> {event.location}</p>
                <p><strong>Description:</strong> {event.description}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
