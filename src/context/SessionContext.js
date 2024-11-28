// src/context/SessionContext.js
"use client";

import { createContext, useState, useEffect } from 'react';

export const SessionContext = createContext();

export const SessionProvider = ({ children }) => {
  const [volunteerID, setVolunteerID] = useState(null);

  useEffect(() => {
    // Check if volunteerID is stored in sessionStorage
    const storedID = sessionStorage.getItem('volunteerID');
    if (storedID) {
      setVolunteerID(storedID);
    }
  }, []);

  const login = (id) => {
    setVolunteerID(id);
    sessionStorage.setItem('volunteerID', id);
  };

  const logout = () => {
    setVolunteerID(null);
    sessionStorage.removeItem('volunteerID');
  };

  return (
    <SessionContext.Provider value={{ volunteerID, login, logout }}>
      {children}
    </SessionContext.Provider>
  );
};
