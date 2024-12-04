"use client";

import { useState, useEffect, useContext } from 'react';
import { SessionContext } from '../../../context/SessionContext';
import { BASE_URL, API_KEY } from '@/app/components/constants.js';
import styles from './Forms.module.css';

export default function UpdateProfile() {
  const { volunteerID } = useContext(SessionContext);
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [schedule, setSchedule] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (volunteerID) {
      const fetchVolunteerInfo = async () => {
        try {
          const response = await fetch(
            `${BASE_URL}/getVolunteerInfo?apiKey=${encodeURIComponent(API_KEY)}&volunteerId=${encodeURIComponent(volunteerID)}`
          );
      
          if (response.ok) {
            const text = await response.text(); 
            const [nameLine, roleLine, scheduleLine] = text.split('\n'); 
            setName(nameLine.split(':')[1]?.trim() || '');
            setRole(roleLine.split(':')[1]?.trim() || '');
            setSchedule(scheduleLine.split(':')[1]?.trim() || '');
          } else if (response.status === 404) {
            setMessage('Volunteer not found.');
          } else if (response.status === 403) {
            setMessage('Invalid API key.');
          }
        } catch (err) {
          console.error(err);
          setMessage('An error occurred while fetching volunteer info.');
        }
      };
      

      fetchVolunteerInfo();
    }
  }, [volunteerID]);

  const handleScheduleChange = (e) => {
    setSchedule(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!volunteerID) {
      setMessage('You must be logged in to update your profile.');
      return;
    }

    let updateResults = [];

    if (name) {
      try {
        const response = await fetch(
          `${BASE_URL}/updateName?apiKey=${encodeURIComponent(API_KEY)}&volunteerId=${encodeURIComponent(volunteerID)}&name=${encodeURIComponent(name)}`,
          { method: 'PATCH' }
        );

        if (response.ok) {
          updateResults.push('Name updated successfully.');
        } else {
          const errorData = await response.json();
          updateResults.push(errorData.message || 'Failed to update name.');
        }
      } catch (err) {
        console.error(err);
        updateResults.push('Error updating name.');
      }
    }

    if (role) {
      try {
        const response = await fetch(
          `${BASE_URL}/updateRole?apiKey=${encodeURIComponent(API_KEY)}&volunteerId=${encodeURIComponent(volunteerID)}&role=${encodeURIComponent(role)}`,
          { method: 'PATCH' }
        );

        if (response.ok) {
          updateResults.push('Role updated successfully.');
        } else {
          const errorData = await response.json();
          updateResults.push(errorData.message || 'Failed to update role.');
        }
      } catch (err) {
        console.error(err);
        updateResults.push('Error updating role.');
      }
    }

    if (schedule) {
      let scheduleObj;
      try {
        scheduleObj = JSON.parse(schedule); 
      } catch {
        updateResults.push('Schedule must be a valid JSON.');
        setMessage(updateResults.join(' '));
        return;
      }

      try {
        const response = await fetch(
          `${BASE_URL}/updateSchedule?apiKey=${encodeURIComponent(API_KEY)}&volunteerId=${encodeURIComponent(volunteerID)}`,
          {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(scheduleObj),
          }
        );

        if (response.ok) {
          updateResults.push('Schedule updated successfully.');
        } else {
          const errorData = await response.json();
          updateResults.push(errorData.message || 'Failed to update schedule.');
        }
      } catch (err) {
        console.error(err);
        updateResults.push('Error updating schedule.');
      }
    }

    setMessage(updateResults.join(' '));
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <h2>Update Profile</h2>
      <label>
        Name:
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="New Name"
          className={styles.input}
        />
      </label>
      <label>
        Role:
        <input
          type="text"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          placeholder="New Role"
          className={styles.input}
        />
      </label>
      <label>
        Schedule (JSON format):
        <textarea
          value={schedule}
          onChange={handleScheduleChange}
          placeholder='e.g., {"Tuesday": "10am-4pm", "Thursday": "10am-4pm"}'
          className={styles.textarea}
        />
      </label>
      <button type="submit" className={styles.submitButton}>Update Profile</button>
      {message && <p className={styles.message}>{message}</p>}
    </form>
  );
}
