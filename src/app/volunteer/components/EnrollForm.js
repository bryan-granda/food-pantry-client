
"use client";

import { useState } from 'react';
import styles from './Forms.module.css';
import { API_KEY,BASE_URL } from '@/app/components/constants.js'; 

export default function EnrollForm() {
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [schedule, setSchedule] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleScheduleChange = (e) => {
    setSchedule(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    
    let scheduleObj;
    try {
      scheduleObj = JSON.parse(schedule);
      if (typeof scheduleObj !== 'object' || Array.isArray(scheduleObj)) {
        throw new Error();
      }
    } catch {
      setMessage('Schedule must be a valid JSON object.');
      return;
    }

    const apiEndpoint = `${BASE_URL}/enrollVolunteer?apiKey=${encodeURIComponent(API_KEY)}&name=${encodeURIComponent(name)}&role=${encodeURIComponent(role)}`;

    setIsLoading(true);
    try {
      const response = await fetch(apiEndpoint, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(scheduleObj), 
      });

      if (response.ok) {
        const responseData = await response.text(); 
        setMessage(`Success: ${responseData}`);
        setName('');
        setRole('');
        setSchedule('');
      } else {
        const data = await response.json();
        setMessage(`Error: ${data.message || 'Enrollment failed.'}`);
      }
    } catch (err) {
      console.error(err);
      setMessage('An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <h2>Enroll as Volunteer</h2>

      
      <label>
        Name:
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className={styles.input}
          placeholder="e.g., Jamie"
        />
      </label>
      
      <label>
        Role:
        <input
          type="text"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          required
          className={styles.input}
          placeholder="e.g., Unassigned"
        />
      </label>
      
      <label>
        Schedule (JSON format):
        <textarea
          value={schedule}
          onChange={handleScheduleChange}
          required
          placeholder='e.g., {"Monday": "9am-5pm", "Wednesday": "9am-5pm"}'
          className={styles.textarea}
        />
      </label>
      
      <button type="submit" className={styles.submitButton} disabled={isLoading}>
        {isLoading ? 'Enrolling...' : 'Enroll'}
      </button>
      
      {message && (
        <p className={styles.message}>
          {message.startsWith('Success') ? <span style={{ color: 'green' }}>{message}</span> : <span style={{ color: 'red' }}>{message}</span>}
        </p>
      )}
    </form>
  );
}
