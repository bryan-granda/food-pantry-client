"use client";

import { useState, useEffect, useContext } from "react";
import { SessionContext } from "@/context/SessionContext";
import styles from "../components/Forms.module.css";
import { API_KEY, BASE_URL } from "@/app/components/constants.js";

export default function DistributeToEvent() {
  const { orgID } = useContext(SessionContext);
  const [events, setEvents] = useState([]);
  const [storageCenters, setStorageCenters] = useState([]);
  const [items, setItems] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState("");
  const [selectedStorageCenter, setSelectedStorageCenter] = useState("");
  const [selectedItem, setSelectedItem] = useState("");
  const [quantity, setQuantity] = useState("");
  const [message, setMessage] = useState("");
  const [maxQuantity, setMaxQuantity] = useState(0);

  useEffect(() => {
    fetchEvents();
    fetchStorageCenters();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch(`${BASE_URL}/listEvents?apiKey=${API_KEY}`);
      if (response.ok) {
        const data = await response.json();
        setEvents(data);
      } else {
        console.error("Failed to fetch events.");
      }
    } catch (err) {
      console.error("Error fetching events:", err);
    }
  };

  const fetchStorageCenters = async () => {
    try {
      const response = await fetch(`${BASE_URL}/listAllCenters?apiKey=${API_KEY}`);
      if (response.ok) {
        const data = await response.json();
        setStorageCenters(data);
      } else {
        console.error("Failed to fetch storage centers.");
      }
    } catch (err) {
      console.error("Error fetching storage centers:", err);
    }
  };

  const fetchItems = async (storageCenterId) => {
    try {
      const response = await fetch(
        `${BASE_URL}/listInventory?apiKey=${API_KEY}&storageCenterId=${storageCenterId}`
      );
      if (response.ok) {
        const data = await response.json();
        setItems(data);
      } else {
        console.error("Failed to fetch items.");
      }
    } catch (err) {
      console.error("Error fetching items:", err);
    }
  };

  const handleStorageCenterSelect = (storageCenterId) => {
    setSelectedStorageCenter(storageCenterId);
    setSelectedItem("");
    setQuantity("");
    setMaxQuantity(0);
    fetchItems(storageCenterId);
  };

  const handleItemSelect = (itemName) => {
    const item = items.find((item) => item.name === itemName);
    if (item) {
      setSelectedItem(itemName);
      setMaxQuantity(item.quantity);
    }
  };

  const handleDistribute = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!selectedEvent || !selectedStorageCenter || !selectedItem || !quantity) {
      setMessage("All fields are required.");
      return;
    }

    try {
      const item = items.find((item) => item.name === selectedItem);
      const response = await fetch(`${BASE_URL}/checkOutItems`, {
        method: "PATCH",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          storageCenterId: selectedStorageCenter,
          type: item.type,
          name: selectedItem,
          quantity,
        }),
      });

      if (response.ok) {
        setMessage("Items distributed successfully!");
        fetchItems(selectedStorageCenter); 
        setSelectedItem("");
        setQuantity("");
        setMaxQuantity(0);
      } else {
        const error = await response.text();
        setMessage(`Error: ${error}`);
      }
    } catch (err) {
      console.error("Error distributing items:", err);
      setMessage("An unexpected error occurred while distributing items.");
    }
  };

  return (
    <div className={styles.container}>
      <h2>Distribute to Event</h2>
      {message && <p className={styles.message}>{message}</p>}

      <form onSubmit={handleDistribute} className={styles.form}>
        {/* Select Event */}
        <label>
          Select Event:
          <select
            value={selectedEvent}
            onChange={(e) => setSelectedEvent(e.target.value)}
            required
            className={styles.input}
          >
            <option value="">--Select--</option>
            {events.map((event) => (
              <option key={event.id} value={event.id}>
                {event.name} (Date: {event.date})
              </option>
            ))}
          </select>
        </label>

        {/* Select Storage Center */}
        <label>
          Select Storage Center:
          <select
            value={selectedStorageCenter}
            onChange={(e) => handleStorageCenterSelect(e.target.value)}
            required
            className={styles.input}
          >
            <option value="">--Select--</option>
            {storageCenters.map((center) => (
              <option key={center.id} value={center.id}>
                {center.name}
              </option>
            ))}
          </select>
        </label>

        {/* Select Item */}
        {items.length > 0 && (
          <label>
            Select Item:
            <select
              value={selectedItem}
              onChange={(e) => handleItemSelect(e.target.value)}
              required
              className={styles.input}
            >
              <option value="">--Select--</option>
              {items.map((item) => (
                <option key={item.name} value={item.name}>
                  {item.name} (Type: {item.type}, Quantity: {item.quantity})
                </option>
              ))}
            </select>
          </label>
        )}

        {/* Select Quantity */}
        {selectedItem && (
          <label>
            Quantity:
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              max={maxQuantity}
              min="1"
              required
              className={styles.input}
            />
          </label>
        )}

        <button type="submit" className={styles.submitButton}>
          Distribute
        </button>
      </form>
    </div>
  );
}
