import { useContext, useState, useEffect } from "react";
import styles from "./Forms.module.css";
import { API_KEY, BASE_URL } from "@/app/components/constants.js";
import { SessionContext } from '@/context/SessionContext';

export default function JoinEvent({}) {
  const [events, setEvents] = useState([]);
  const { volunteerID } = useContext(SessionContext);
  const [curEventId, setcurEventId] = useState(""); 
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      setMessage("");
      try {
        const response = await fetch(
          `${BASE_URL}/listEvents?apiKey=${encodeURIComponent(API_KEY)}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          setEvents(data);
        } else {
          const errorData = await response.text();
          setMessage(`Error gettin events: ${errorData}`);
        }
      } catch (err) {
        console.error(err);
        setMessage("An unexpected error occurred while retrieving events.");
      }
    };

    fetchEvents();
  }, []);

  const handleJoinEvent = async () => {
    if (!curEventId) {
      setMessage("Please select an event.");
      return;
    }

    setIsLoading(true);
    setMessage("");

    try {
      const response = await fetch(
        `${BASE_URL}/addVolunteerToEvent?apiKey=${encodeURIComponent(
          API_KEY
        )}&eventId=${encodeURIComponent(curEventId)}&volunteerId=${encodeURIComponent(
          volunteerID
        )}`,
        { method: "POST" }
      );

      setMessage("Successfully joined the event!");
    } catch (err) {
      setMessage("Failed to joined the event!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h2>Join an Event</h2>

      <div className={styles.section}>
        <label>
          Select Event:
          <select
            value={curEventId}
            onChange={(e) => setcurEventId(e.target.value)}
            className={styles.input}
          >
            <option value="">Select an Event</option>
            {events.map((event) => (
              <option key={event.databaseId} value={event.databaseId}>
                {event.name} (Date: {event.date}, Location: {event.location})
              </option>
            ))}
          </select>
        </label>
      </div>

      <button
        onClick={handleJoinEvent}
        className={styles.submitButton}
        disabled={isLoading || !curEventId}
      >
        {isLoading ? "Joining..." : "Join Event"}
      </button>

      {message && <p className={styles.message}>{message}</p>}
    </div>
  );
}
