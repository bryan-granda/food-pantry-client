"use client";

import { useState, useContext } from 'react';
import { SessionContext } from '../../../context/SessionContext';
import { API_KEY } from '@/app/components/constants.js';
import styles from './Forms.module.css';

export default function LoginForm({ onSuccess }) {
  const [volunteerIDInput, setVolunteerIDInput] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(SessionContext);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const apiEndpoint = `http://localhost:8080/getVolunteerInfo?apiKey=${encodeURIComponent(API_KEY)}&volunteerId=${encodeURIComponent(volunteerIDInput)}`;

    try {
      const response = await fetch(apiEndpoint, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        login(volunteerIDInput);
        onSuccess();
      } else if (response.status === 404) {
        setError('Volunteer not found.');
      } else if (response.status === 403) {
        setError('Invalid API key.');
      } else {
        setError('Error verifying Volunteer ID.');
      }
    } catch (err) {
      console.error(err);
      setError('An unexpected error occurred.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <h2>Log In</h2>
      <label>
        Volunteer ID:
        <input
          type="text"
          value={volunteerIDInput}
          onChange={(e) => setVolunteerIDInput(e.target.value)}
          required
          className={styles.input}
        />
      </label>
      <button type="submit" className={styles.submitButton}>Log In</button>
      {error && <p className={styles.error}>{error}</p>}
    </form>
  );
}
