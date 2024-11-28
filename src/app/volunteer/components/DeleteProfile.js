"use client";

import { useState, useContext } from 'react';
import { SessionContext } from '../../../context/SessionContext';
import { API_KEY } from '@/app/components/constants.js';
import styles from './Forms.module.css';

export default function DeleteProfile() {
  const { volunteerID, logout } = useContext(SessionContext);
  const [confirmation, setConfirmation] = useState(false);
  const [message, setMessage] = useState('');

  const handleDelete = async () => {
    if (!volunteerID) {
      setMessage('You must be logged in to delete your profile.');
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8080/removeVolunteer?apiKey=${encodeURIComponent(API_KEY)}&volunteerId=${encodeURIComponent(volunteerID)}`,
        { method: 'DELETE' }
      );

      if (response.ok) {
        setMessage('Profile deleted successfully.');
        logout();
      } else if (response.status === 404) {
        setMessage('Volunteer not found.');
      } else if (response.status === 403) {
        setMessage('Invalid API key.');
      } else {
        const data = await response.json();
        setMessage(data.message || 'Deletion failed.');
      }
    } catch (err) {
      console.error(err);
      setMessage('An unexpected error occurred.');
    }
  };

  return (
    <div className={styles.deleteContainer}>
      <h2>Delete Profile</h2>
      {!confirmation ? (
        <button onClick={() => setConfirmation(true)} className={styles.button}>
          Confirm Delete
        </button>
      ) : (
        <div>
          <p>Are you sure you want to delete your profile? This action cannot be undone.</p>
          <button onClick={handleDelete} className={styles.deleteButton}>
            Yes, Delete
          </button>
          <button onClick={() => setConfirmation(false)} className={styles.button}>
            Cancel
          </button>
        </div>
      )}
      {message && <p className={styles.message}>{message}</p>}
    </div>
  );
}
