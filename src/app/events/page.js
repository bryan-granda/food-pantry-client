"use client";

import React, { useEffect, useState } from "react";
import styles from "./Events.module.css";

function Events() {
  const [events, setEvents] = useState([]);
  const [eventsLoading, setEventsLoading] = useState(true);
  const [filterDate, setFilterDate] = useState("");
  const [filterLocation, setFilterLocation] = useState("");

  useEffect(() => {
    const fetchEventsHandler = async () => {
      console.log("fetching events");
      const response = await fetch(
        "http://127.0.0.1:8080/listEvents?apiKey=eb382178-10d8-4f72-b324-eb4c24309313"
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      if (response.ok) {
        console.log("response ok");
        const data = await response.json();
        console.log("data", data);
        setEvents(data);
        console.log("events", events);
      } else {
        console.error("Error fetching events");
      }
      setEventsLoading(false);
    };
    fetchEventsHandler();
  }, []);

  const handleFilterByDate = async () => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8080/searchEventsByDate?apiKey=eb382178-10d8-4f72-b324-eb4c24309313&date=${filterDate}`
      );
      if (response.status === 404) {
        console.warn("No events found for the given date.");
        setEvents([]);
        return;
      }
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setEvents(data);
    } catch (error) {
      console.error("Error filtering by date:", error);
    }
  };

  const handleFilterByLocation = async () => {
    try {
      console.log(filterLocation);
      const response = await fetch(
        `http://127.0.0.1:8080/searchEventsByLocation?apiKey=eb382178-10d8-4f72-b324-eb4c24309313&location=${filterLocation}`
      );
      if (response.status === 404) {
        console.log("No events found for the given location.");
        setEvents([]);
        return;
      }
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setEvents(data);
    } catch (error) {
      console.error("Error filtering by location:", error);
    }
  };

  if (eventsLoading) {
    return (
      <div className={styles.loadingContainer}>
        Loading...
      </div>
    );
  }

  return (
    <div>
      <h1>Events</h1>

      {/* Filters */}
      <div className={styles.filters}>
        <div>
          <label>Date: </label>
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
          />
          <button onClick={handleFilterByDate}>Filter by Date</button>
        </div>
        <div>
          <label>Location: </label>
          <input
            type="text"
            placeholder="Enter location"
            value={filterLocation}
            onChange={(e) => setFilterLocation(e.target.value)}
          />
          <button onClick={handleFilterByLocation}>Filter by Location</button>
        </div>
      </div>

      <div className={styles.eventsContainer}>
        {events.length > 0 ? (
          events
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .map((event) => (
              <div className={styles.eventBox} key={event.databaseId}>
                <div className={styles.eventBoxTitle}>{event.name}</div>
                <div>{event.location}</div>
                <div>{event.description}</div>
                <div>Organized by {event.organizer || "N/A"}</div>
                <div className={styles.eventBoxDate}>{event.date}</div>
              </div>
            ))
        ) : (
          <p>No events found.</p>
        )}
      </div>
    </div>
  );
}

export default Events;
