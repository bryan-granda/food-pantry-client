"use client";

import { createContext, useState, useEffect } from 'react';

export const SessionContext = createContext();

export const SessionProvider = ({ children }) => {
  const [volunteerID, setVolunteerID] = useState(null);
  const [orgID, setOrgID] = useState(null);

  useEffect(() => {
    const savedVolunteerID = sessionStorage.getItem('volunteerID');
    if (savedVolunteerID) {
      setVolunteerID(savedVolunteerID);
    }

    const storedOrgID = sessionStorage.getItem('orgID');
    if (storedOrgID) {
      setOrgID(storedOrgID);
    }
  }, []);

  const loginVolunteer = (id) => {
    setVolunteerID(id);
    sessionStorage.setItem('volunteerID', id);
  };

  const logoutVolunteer = () => {
    setVolunteerID(null);
    sessionStorage.removeItem('volunteerID');
  };

  const loginOrg = (id) => {
    setOrgID(id);
    sessionStorage.setItem('orgID', id);
  };

  const logoutOrg = () => {
    setOrgID(null);
    sessionStorage.removeItem('orgID');
  };

  return (
    <SessionContext.Provider value={{ 
      volunteerID, 
      loginVolunteer, 
      logoutVolunteer, 
      orgID, 
      loginOrg, 
      logoutOrg 
    }}>
      {children}
    </SessionContext.Provider>
  );
};
