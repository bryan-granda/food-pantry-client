"use client";

import { useState, useEffect, useContext } from "react";
import { SessionContext } from "@/context/SessionContext";
import styles from "../components/Forms.module.css";
import Link from "next/link";
import { API_KEY, BASE_URL } from "@/app/components/constants.js";
import DistributeToEvent from "./DistributeToEvent";

export default function EventsPage() {
  const { orgID } = useContext(SessionContext);
  const [view, setView] = useState("list"); 
  const [events, setEvents] = useState([]);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [searchDate, setSearchDate] = useState("");
  const [searchLocation, setSearchLocation] = useState("");

  const [newEvent, setNewEvent] = useState({
    name: "",
    description: "",
    date: "",
    startTime: "",
    endTime: "",
    location: "",
    storageCenterId: "",
  });
  const [storageCenters, setStorageCenters] = useState([]);

  useEffect(() => {
    const fetchStorageCenters = async () => {
      try {
        const response = await fetch(`${BASE_URL}/listAllCenters?apiKey=${API_KEY}`);
        if (response.ok) {
          const data = await response.json();
          setStorageCenters(data);
        } else {
          console.error("Failed to fetch storage centers.");
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchStorageCenters();
  }, []);

  const listAllEvents = async () => {
    setIsLoading(true);
    setMessage("");
    setEvents([]);

    try {
      const response = await fetch(`${BASE_URL}/listEvents?apiKey=${API_KEY}`);
      if (response.ok) {
        const data = await response.json();
        setEvents(data);
        setMessage(`Successfully retrieved ${data.length} event(s).`);
      } else {
        setMessage("Error fetching events.");
      }
    } catch (err) {
      console.error(err);
      setMessage("An unexpected error occurred while fetching events.");
    } finally {
      setIsLoading(false);
    }
  };

  const createEvent = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsLoading(true);

    const { name, description, date, startTime, endTime, location, storageCenterId } = newEvent;

    if (!name || !description || !date || !startTime || !endTime || !location || !storageCenterId) {
      setMessage("All fields are required to create an event.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/createEvent`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          apiKey: API_KEY,
          name,
          description,
          date,
          startTime,
          endTime,
          location,
          storageCenterId,
          organizationId: orgID,
        }),
      });

      if (response.ok) {
        setMessage("Event created successfully!");
        setNewEvent({
          name: "",
          description: "",
          date: "",
          startTime: "",
          endTime: "",
          location: "",
          storageCenterId: "",
        });
        listAllEvents();
        setView("list");
      } else {
        const error = await response.text();
        setMessage(`Error: ${error}`);
      }
    } catch (err) {
      console.error(err);
      setMessage("An unexpected error occurred while creating the event.");
    } finally {
      setIsLoading(false);
    }
  };

  const searchEventsByDate = async () => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");
    setEvents([]);

    try {
      const response = await fetch(
        `${BASE_URL}/searchEventsByDate?apiKey=${API_KEY}&date=${searchDate}`
      );
      if (response.ok) {
        const data = await response.json();
        setEvents(data);
        setMessage(`Found ${data.length} event(s) on ${searchDate}.`);
      } else {
        setMessage("Error fetching events.");
      }
    } catch (err) {
      console.error(err);
      setMessage("An unexpected error occurred while searching events by date.");
    } finally {
      setIsLoading(false);
    }
  };

  const searchEventsByLocation = async () => {
    setIsLoading(true);
    setMessage("");
    setEvents([]);

    try {
      const response = await fetch(
        `${BASE_URL}/searchEventsByLocation?apiKey=${API_KEY}&location=${searchLocation}`
      );
      if (response.ok) {
        const data = await response.json();
        setEvents(data);
        setMessage(`Found ${data.length} event(s) at "${searchLocation}".`);
      } else {
        setMessage("Error fetching events.");
      }
    } catch (err) {
      console.error(err);
      setMessage("An unexpected error occurred while searching events by location.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1>Manage Events</h1>

      <div className={styles.navigation}>
        <button onClick={() => setView("list")} className={styles.submitButton}>
          List Events
        </button>
        <button onClick={() => setView("create")} className={styles.submitButton}>
          Create Event
        </button>
        <button onClick={() => setView("search")} className={styles.submitButton}>
          Search Events
        </button>
        <button onClick={() => setView("distribute")} className={styles.submitButton}>
  Distribute to Event
</button>
{view === "distribute" && <DistributeToEvent />}
      </div>

      {view === "list" && (
        <div>
          <h2>All Events</h2>
          <button onClick={listAllEvents} className={styles.submitButton} disabled={isLoading}>
            {isLoading ? "Loading..." : "Fetch Events"}
          </button>
          {message && <p className={styles.message}>{message}</p>}
          <ul className={styles.eventsList}>
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

      {view === "create" && (
        <form onSubmit={createEvent} className={styles.form}>
          <h2>Create Event</h2>
          <label>
            Event Name:
            <input
              type="text"
              value={newEvent.name}
              onChange={(e) => setNewEvent({ ...newEvent, name: e.target.value })}
              className={styles.input}
              required
            />
          </label>
          <label>
            Description:
            <textarea
              value={newEvent.description}
              onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
              className={styles.textarea}
              required
            />
          </label>
          <label>
            Date:
            <input
              type="date"
              value={newEvent.date}
              onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
              className={styles.input}
              required
            />
          </label>
          <label>
            Start Time:
            <input
              type="time"
              value={newEvent.startTime}
              onChange={(e) => setNewEvent({ ...newEvent, startTime: e.target.value })}
              className={styles.input}
              required
            />
          </label>
          <label>
            End Time:
            <input
              type="time"
              value={newEvent.endTime}
              onChange={(e) => setNewEvent({ ...newEvent, endTime: e.target.value })}
              className={styles.input}
              required
            />
          </label>
          <label>
            Location:
            <input
              type="text"
              value={newEvent.location}
              onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
              className={styles.input}
              required
            />
          </label>
          <label>
            Storage Center:
            <select
              value={newEvent.storageCenterId}
              onChange={(e) => setNewEvent({ ...newEvent, storageCenterId: e.target.value })}
              className={styles.input}
              required
            >
              <option value="">--Select--</option>
              {storageCenters.map((center) => (
                <option key={center.id} value={center.id}>
                  {center.name}
                </option>
              ))}
            </select>
          </label>
          <button type="submit" className={styles.submitButton} disabled={isLoading}>
            {isLoading ? "Creating..." : "Create Event"}
          </button>
        </form>
      )}

      {view === "search" && (
        <div>
          <h2>Search Events</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              searchDate ? searchEventsByDate() : searchEventsByLocation();
            }}
            className={styles.form}
          >
            <label>
              Date:
              <input
                type="date"
                value={searchDate}
                onChange={(e) => setSearchDate(e.target.value)}
                className={styles.input}
              />
            </label>
            <label>
              Location:
              <input
                type="text"
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
                className={styles.input}
                placeholder="Enter location"
              />
            </label>
            <button type="submit" className={styles.submitButton} disabled={isLoading}>
              {isLoading ? "Searching..." : "Search"}
            </button>
          </form>
          {message && <p className={styles.message}>{message}</p>}
          <ul className={styles.eventsList}>
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

      {message && <p className={styles.message}>{message}</p>}
      <div style={{ marginTop: '20px' }}>
            <div style={{ marginTop: '20px' }}>
        <Link href="/organization">
          <button className={styles.submitButton}>Return to Org</button>
        </Link>
      </div>
        <Link href="/">
          <button className={styles.submitButton}>Return to Home</button>
        </Link>
      </div>
    </div>
  );
}
