'use client';
import React, {useEffect, useState} from 'react';

function Events({event}) {


  return (
    <li>
      <h3>{event.eventName}</h3>
      <p>Category: {event.eventType}</p>
      <p>Date: {event.eventDate}</p>
      <p>Time: {event.eventTime}</p>
      <p>Location: {event.eventLocation}</p>
    </li>
  );
}