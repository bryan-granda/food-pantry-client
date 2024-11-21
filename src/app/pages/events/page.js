'use client';

import React, {useEffect, useState} from 'react';

function Events() {
  const [events, setEvents] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [eventsLoading, setEventsLoading] = useState(true);
  const [volunteerLoading, setVolunteerLoading] = useState(true);

  useEffect(() => {
    const fetchEventsHandler = async () => {
      console.log('fetching events');
      const response = await fetch('/api/events');

      if (response.ok) {
        console.log('response ok');
        const data = await response.json();
        console.log('data', data);
        setEvents(data.events);
        console.log('events', events);
      } else {
        console.error('Error fetching events');
      }
      setEventsLoading(false);
    };
  }, []);

  return (
    <div>
      <h1>Events</h1>
      <ul>
        {events.map((event) => (
          <li key={event.databaseId}>
            <h3>{event.eventName}</h3>
            <p>Location: {event.location}</p>
            <p>Date: {event.date}</p>
          </li>
        ))}
      </ul>
    </div>
  );

}