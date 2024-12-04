"use client";

import { useState, useContext } from 'react';
import { SessionContext } from '@/context/SessionContext';
import styles from './Forms.module.css';
import { BASE_URL } from '@/app/components/constants';

export default function LoginForm({ onSuccess }) {
  const [orgIDInput, setOrgIDInput] = useState('');
  const [error, setError] = useState('');
  const { loginOrg } = useContext(SessionContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const apiEndpoint = `${BASE_URL}/getOrganization?orgId=${encodeURIComponent(orgIDInput)}`;

    try {
      const response = await fetch(apiEndpoint, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
          loginOrg(orgIDInput);
          onSuccess();
      } else {
        setError('Error verifying Organization ID.');
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
        Organization ID:
        <input
          type="text"
          value={orgIDInput}
          onChange={(e) => setOrgIDInput(e.target.value)}
          required
          className={styles.input}
          placeholder="Enter your Organization ID"
        />
      </label>
      <button type="submit" className={styles.submitButton}>Log In</button>
      {error && <p className={styles.error}>{error}</p>}
    </form>
  );
}
