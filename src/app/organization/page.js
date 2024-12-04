"use client";

import { useContext, useState, useEffect } from "react";
import { SessionContext } from '@/context/SessionContext';
import { BASE_URL } from "../components/constants";
import LoginForm from './components/LoginForm';
import EnrollForm from './components/EnrollForm';
import DeleteProfile from './components/DeleteProfile';
import Link from 'next/link';
import styles from './components/Forms.module.css';

export default function Organization() {
    const { orgID, logoutOrg } = useContext(SessionContext);
    const [view, setView] = useState("home");
    const [logs, setLogs] = useState([]);
    const [error, setError] = useState("");
    const [storageCenters, setStorageCenters] = useState([]); 
    const [curStorageCenterId, setcurStorageCenterId] = useState(""); 
  useEffect(() => {
    const fetchStorageCenters = async () => {
      try {
        const response = await fetch(`${BASE_URL}/listAllCenters`);
        if (response.ok) {
          const data = await response.json();
          setStorageCenters(data);
        } else {
          setError("Failed to fetch storage centers");
        }
      } catch (err) {
        console.error(err);
        setError("An unexpected error occurred while getting storage centers");
      }
    };

    fetchStorageCenters();
  }, []);

  const fetchLogs = async () => {
    setError("");
    setLogs([]);

    if (!curStorageCenterId) {
      setError("Please select a storage center.");
      return;
    }

    const apiEndpoint = `${BASE_URL}/listTransactions?storageCenterId=${encodeURIComponent(curStorageCenterId)}`;

    try {
      const response = await fetch(apiEndpoint, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setLogs(data);
      } else if (response.status === 404) {
        setError("Logs not found for the selected storage center.");
      } else {
        setError("Failed to fetch logs.");
      }
    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred while getting logs");
    }
  };

  if (!orgID) {
    return (
      <div className={styles.container}>
        <h1>Organization Interface</h1>
        <div className={styles.buttonGroup}>
          <button onClick={() => setView('login')} className={styles.submitButton}>Log In</button>
          <button onClick={() => setView('enroll')} className={styles.submitButton}>Enroll as Organization</button>
        </div>
        {view === 'login' && <LoginForm onSuccess={() => setView('options')} />}
        {view === 'enroll' && <EnrollForm />}
        <div style={{ marginTop: '20px' }}>
          <Link href="/">
            <button className={styles.submitButton}>Return to Home</button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1>Welcome to Org Home Page!</h1>
      <button onClick={logoutOrg} className={styles.submitButton}>Log Out</button>
      <div className={styles.buttonGroup}>
        <button onClick={() => setView('delete')} className={styles.submitButton}>Delete Profile</button>
        <button onClick={() => setView('manageStorage')} className={styles.submitButton}>Manage Storage Center</button>
        <button onClick={() => setView('manageEvent')} className={styles.submitButton}>Manage Event</button>
        <button onClick={() => setView('viewLogs')} className={styles.submitButton}>View Logs</button>
      </div>
      {view === 'delete' && <DeleteProfile />}
      {view === 'manageStorage' && (
        <Link href="/organization/storages">
          <button className={styles.submitButton}>Go to Manage Storage Center</button>
        </Link>
      )}
      {view === 'manageEvent' && (
        <Link href="/organization/events">
          <button className={styles.submitButton}>Go to Manage Events</button>
        </Link>
      )}
      {view === "viewLogs" && (
        <div>
          <h2>View Logs</h2>
          <label>
            Select Storage Center:
            <select
              value={curStorageCenterId}
              onChange={(e) => setcurStorageCenterId(e.target.value)}
              className={styles.input}
            >
              <option value="">Select a Storage Center</option>
              {storageCenters.map((center) => (
                <option key={center.id} value={center.id}>
                  {center.name}
                </option>
              ))}
            </select>
          </label>
          <button onClick={fetchLogs} className={styles.submitButton}>
            Fetch Logs
          </button>
          {error && <p className={styles.error}>{error}</p>}
          <ul className={styles.logsList}>
            {logs.map((log, index) => (
              <li key={index} className={styles.logItem}>
                <p><strong>Action:</strong> {log.action}</p>
                <p><strong>Item:</strong> {log.itemName} ({log.itemType})</p>
                <p><strong>Quantity:</strong> {log.quantity}</p>
                <p><strong>Date:</strong> {log.date}</p>
                <p><strong>Time:</strong> {log.timestamp}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
      <div style={{ marginTop: '20px' }}>
        <Link href="/">
          <button className={styles.submitButton}>Return to Home</button>
        </Link>
      </div>
    </div>
  );
}
