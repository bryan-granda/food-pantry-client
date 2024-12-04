"use client";

import { useState } from "react";
import styles from "./Forms.module.css";
import { BASE_URL, API_KEY } from "@/app/components/constants.js";

export default function EnrollForm() {
  const [orgName, setOrgName] = useState("");
  const [orgType, setOrgType] = useState("");
  const [schedule, setSchedule] = useState(new Set());
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleScheduleChange = (e) => {
    const day = e.target.value;
    setSchedule((prev) =>
      prev.has(day) ? new Set([...prev].filter((d) => d !== day)) : new Set([...prev, day])
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    const apiEndpoint = `${BASE_URL}/createOrganization?orgName=${encodeURIComponent(
      orgName
    )}&orgType=${encodeURIComponent(orgType)}${[...schedule]
      .map((day) => `&schedule=${encodeURIComponent(day)}`)
      .join("")}&dateAdded=${encodeURIComponent(
      new Date().toISOString().split("T")[0]
    )}`;

    setIsLoading(true);
    try {
      const response = await fetch(apiEndpoint, {
        method: "POST",
      });

      if (response.ok) {
        const responseData = await response.text();
        setMessage(`Success: ${responseData}`);
        setOrgName("");
        setOrgType("");
        setSchedule(new Set());
      } else {
        const data = await response.json();
        setMessage(`Error: ${data.message || "Enrollment failed."}`);
      }
    } catch (err) {
      console.error(err);
      setMessage("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <h2>Enroll as Organization</h2>

      <label>
        Organization Name:
        <input
          type="text"
          value={orgName}
          onChange={(e) => setOrgName(e.target.value)}
          required
          className={styles.input}
          placeholder="e.g., Helping Hands"
        />
      </label>

      <label>
        Organization Type:
        <input
          type="text"
          value={orgType}
          onChange={(e) => setOrgType(e.target.value)}
          required
          className={styles.input}
          placeholder="e.g., Non-Profit"
        />
      </label>

      <fieldset className={styles.fieldset}>
        <legend>Schedule:</legend>
        {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map((day) => (
          <label key={day} className={styles.checkboxLabel}>
            <input
              type="checkbox"
              value={day}
              checked={schedule.has(day)}
              onChange={handleScheduleChange}
              className={styles.checkbox}
            />
            {day}
          </label>
        ))}
      </fieldset>

      <button type="submit" className={styles.submitButton} disabled={isLoading}>
        {isLoading ? "Enrolling..." : "Enroll Organization"}
      </button>

      {message && (
        <p className={styles.message}>
          {message.startsWith("Success") ? (
            <span style={{ color: "green" }}>{message}</span>
          ) : (
            <span style={{ color: "red" }}>{message}</span>
          )}
        </p>
      )}
    </form>
  );
}
