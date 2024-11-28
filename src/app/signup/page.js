"use client"

import React, { useEffect, useState } from "react";
import styles from "./Signup.module.css"

function SignUpPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [apiKey, setApiKey] = useState("");
    const [userType, setUserType] = useState("");
    const [orgName, setOrgName] = useState("");
    const [orgType, setOrgType] = useState("");
    const [schedule, setSchedule] = useState("");
    const [dateAdded, setDateAdded] = useState("");
    const [name, setName] = useState("");
    const [role, setRole] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");


    const handleSignUp = async (event) => {
        event.preventDefault();
        setError("");
        setSuccess("");

        try{
            let endpoint;
            let payload = {};

            if(userType === "organization") {
                endpoint = "http://127.0.0.1:8080/createOrganization";
                payload = {
                    orgName,
                    orgType,
                    apiKey,
                    schedule: schedule
                        .split(",")
                        .reduce((map, item) => ({ ...map, [item.trim()]: true }), {}),
                    dateAdded,
                };
            } else if (userType === "volunteer") {
                endpoint = `http://127.0.0.1:8080/enrollVolunteer?apiKey=${encodeURIComponent(apiKey)}&name=${encodeURIComponent(name)}&role=${encodeURIComponent(role)}`;
                payload = {
                    schedule: schedule.split(",").reduce((map, item) => {
                        const trimmedItem = item.trim();
                        map[trimmedItem] = "true"; // or some default value
                        return map;
                    }, {}),
                };
            } else {
                setError("Please select a valid user type.");
                return;
            }

            const response = await fetch(endpoint, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });
            if(response.ok) {
                setSuccess("User created successfully.");
            } else {
                const errorData = await response.json();
                setError(errorData.message || "Failed to create user.");
            }
        } catch (error) {
            console.error("Error signing up:", error);
            setError("Failed to create user.");
        }
    };




    return (
        <div className={styles.signupForm}>
            <h1>Sign Up</h1>
            {error && <p className={styles.error}>{error}</p>}
            {success && <p className={styles.success}>{success}</p>}

            {/* Dropdown to select user type */}
            <label htmlFor="userType">Select User Type</label>
            <select
                id="userType"
                name="userType"
                required
                value={userType}
                onChange={(e) => setUserType(e.target.value)}
            >
                <option value="">Please Select</option>
                <option value="volunteer">Volunteer</option>
                <option value="organization">Organization</option>
            </select>

            {/* Conditionally render the form based on the selected user type */}
            {userType && (
                <form onSubmit={handleSignUp}>
                    {userType === "organization" ? (
                        <>
                            <label htmlFor="orgName">Organization Name</label>
                            <input
                                type="text"
                                id="orgName"
                                required
                                value={orgName}
                                onChange={(e) => setOrgName(e.target.value)}
                            />
                            <label htmlFor="orgType">Organization Type</label>
                            <input
                                type="text"
                                id="orgType"
                                required
                                value={orgType}
                                onChange={(e) => setOrgType(e.target.value)}
                            />
                            <label htmlFor="schedule">Schedule (Comma-separated)</label>
                            <input
                                type="text"
                                id="schedule"
                                required
                                value={schedule}
                                onChange={(e) => setSchedule(e.target.value)}
                            />
                            <label htmlFor="dateAdded">Date Added</label>
                            <input
                                type="date"
                                id="dateAdded"
                                required
                                value={dateAdded}
                                onChange={(e) => setDateAdded(e.target.value)}
                            />
                        </>
                    ) : (
                        <>
                            <label htmlFor="apiKey">API Key</label>
                            <input
                                type="text"
                                id="apiKey"
                                required
                                value={apiKey}
                                onChange={(e) => setApiKey(e.target.value)}
                            />
                            <label htmlFor="name">Name</label>
                            <input
                                type="text"
                                id="name"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                            <label htmlFor="role">Role</label>
                            <input
                                type="text"
                                id="role"
                                required
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                            />
                            <label htmlFor="volunteerSchedule">Volunteer Schedule (Comma-separated)</label>
                            <input
                                type="text"
                                id="volunteerSchedule"
                                required
                                value={schedule}
                                onChange={(e) => setSchedule(e.target.value)}
                            />
                        </>
                    )}
                    <button type="submit">Sign Up</button>
                </form>
            )}
        </div>
    );
}

export default SignUpPage;