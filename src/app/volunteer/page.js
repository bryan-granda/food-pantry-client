"use client";

import { useContext, useState } from "react";
import { SessionContext } from "@/context/SessionContext";
import LoginForm from "./components/LoginForm";
import EnrollForm from "./components/EnrollForm";
import UpdateProfile from "./components/UpdateProfile";
import DeleteProfile from "./components/DeleteProfile";
import EventsView from "./components/EventsView";
import JoinEvent from "./components/JoinEvent";
import Link from "next/link";
import styles from "./components/Forms.module.css";

export default function Volunteer() {
  const { volunteerID, logoutVolunteer } = useContext(SessionContext);
  const [view, setView] = useState("home"); 

  return (
    <div className={styles.container}>
      <h1>Volunteer Interface</h1>
      
      {!volunteerID ? (
        <p>Welcome! Please log in or enroll to start volunteering.</p>
      ) : (
        <p>Welcome back!</p>
      )}

      {!volunteerID && (
        <div className={styles.buttonGroup}>
          <button onClick={() => setView("login")} className={styles.submitButton}>
            Log In
          </button>
          <button onClick={() => setView("enroll")} className={styles.submitButton}>
            Enroll as Volunteer
          </button>
        </div>
      )}

      {volunteerID && (
        <div className={styles.buttonGroup}>
          <button onClick={logoutVolunteer} className={styles.submitButton}>
            Log Out
          </button>
          <button onClick={() => setView("update")} className={styles.submitButton}>
            Update Profile
          </button>
          <button onClick={() => setView("delete")} className={styles.submitButton}>
            Delete Profile
          </button>
          <button onClick={() => setView("events")} className={styles.submitButton}>
            View Events
          </button>
          <button onClick={() => setView("joinEvent")} className={styles.submitButton}>
            Join Event
          </button>
        </div>
      )}

      {view === "login" && <LoginForm onSuccess={() => setView("home")} />}
      {view === "enroll" && <EnrollForm />}
      {view === "update" && <UpdateProfile />}
      {view === "delete" && <DeleteProfile />}
      {view === "events" && <EventsView />}
      {view === "joinEvent" && <JoinEvent onSuccess={() => setView("home")} />}

      <div style={{ marginTop: "20px" }}>
        <Link href="/">
          <button className={styles.submitButton}>Return to Home</button>
        </Link>
      </div>
    </div>
  );
}
