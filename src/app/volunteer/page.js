"use client";

import { useContext, useState } from 'react';
import { SessionContext } from '@/context/SessionContext';
import LoginForm from './components/LoginForm';
import EnrollForm from './components/EnrollForm';
import UpdateProfile from './components/UpdateProfile';
import DeleteProfile from './components/DeleteProfile';
import EventsView from './components/EventsView'; 
import Link from 'next/link';
import styles from './components/Forms.module.css'; 

export default function Volunteer() {
  const { volunteerID, logout } = useContext(SessionContext);
  const [view, setView] = useState('home'); // home, login, enroll, update, delete, events

  if (!volunteerID) {
    return (
      <div className={styles.container}>
        <h1>Volunteer Interface</h1>
        <div className={styles.buttonGroup}>
          <button onClick={() => setView('login')} className={styles.submitButton}>Log In</button>
          <button onClick={() => setView('enroll')} className={styles.submitButton}>Enroll as Volunteer</button>
        </div>
        {view === 'login' && <LoginForm onSuccess={() => setView('home')} />}
        {view === 'enroll' && <EnrollForm />}
        <div style={{ marginTop: '23px' }}>
          <Link href="/">
            <button className={styles.submitButton}>Return to Home</button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1>Welcome, Volunteer {volunteerID}</h1>
      <button onClick={logout} className={styles.submitButton}>Log Out</button>
      <div className={styles.buttonGroup}>
        <button onClick={() => setView('update')} className={styles.submitButton}>Update Profile</button>
        <button onClick={() => setView('delete')} className={styles.submitButton}>Delete Profile</button>
        <button onClick={() => setView('events')} className={styles.submitButton}>View Events</button>
      </div>
      {view === 'update' && <UpdateProfile />}
      {view === 'delete' && <DeleteProfile />}
      {view === 'events' && <EventsView />} 
      <div style={{ marginTop: '20px' }}>
        <Link href="/">
          <button className={styles.submitButton}>Return to Home</button>
        </Link>
      </div>
    </div>
  );
}
