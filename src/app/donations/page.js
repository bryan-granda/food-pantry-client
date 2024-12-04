"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { BASE_URL } from "../components/constants";

export default function MakeDonation() {
  const [storageCenters, setStorageCenters] = useState([]);
  const [selectedCenterId, setSelectedCenterId] = useState("");
  const [itemType, setItemType] = useState("");
  const [itemName, setItemName] = useState("");
  const [itemQuantity, setItemQuantity] = useState(0);
  const [expirationDate, setExpirationDate] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function fetchStorageCenters() {
      try {
        const response = await fetch(`${BASE_URL}/listAllCenters`);
        if (!response.ok) throw new Error("Failed to load storage centers");
        const centers = await response.json();
        setStorageCenters(centers);
      } catch (error) {
        console.error(error);
        setMessage("Failed to load storage centers");
      }
    }

    fetchStorageCenters();
  }, []);

  async function handleDonationSubmit(event) {
    event.preventDefault();

    try {
      const formattedType = itemType.trim().toUpperCase();
      const formattedName = itemName.trim();
      const formattedQuantity = parseInt(itemQuantity, 10);
      const formattedDate = expirationDate.trim();

      const response = await fetch(
        `${BASE_URL}/checkInItems?storageCenterId=${encodeURIComponent(
          selectedCenterId
        )}&type=${encodeURIComponent(formattedType)}&name=${encodeURIComponent(
          formattedName
        )}&quantity=${encodeURIComponent(
          formattedQuantity
        )}&expirationDate=${encodeURIComponent(formattedDate)}`,
        { method: "PATCH" }
      );

      if (!response.ok) throw new Error("Failed to submit donation");

      const result = await response.text();
      setMessage("Donation successful: " + result);
    } catch (error) {
      console.error(error);
      setMessage("Failed to submit donation");
    }
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>Make a Donation</h1>
      <p>Select a storage center and  make a donation!!</p>

      <div>
        <label htmlFor="storageCenter">Select Storage Center:</label>
        <select
          id="storageCenter"
          value={selectedCenterId}
          onChange={(e) => setSelectedCenterId(e.target.value)}
        >
          <option value="">-- Select a Center --</option>
          {storageCenters.map((center) => (
            <option key={center.databaseId} value={center.databaseId}>
              {center.name}
            </option>
          ))}
        </select>
      </div>
      <form onSubmit={handleDonationSubmit}>
        <div>
          <label htmlFor="itemType">Item Type:</label>
          <select
            id="itemType"
            value={itemType}
            onChange={(e) => setItemType(e.target.value)}
            required
          >
            <option value="">-- Select Item Type --</option>
            <option value="FOOD">FOOD</option>
            <option value="CLOTHES">CLOTHES</option>
            <option value="TOILETRIES">TOILETRIES</option>
          </select>
        </div>

        <div>
          <label htmlFor="itemName">Item Name:</label>
          <input
            id="itemName"
            type="text"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="itemQuantity">Quantity:</label>
          <input
            id="itemQuantity"
            type="number"
            min="1"
            value={itemQuantity}
            onChange={(e) => setItemQuantity(e.target.value)}
            required
          />
        </div><div>
          <label htmlFor="expirationDate">Expiration Date (yyyy-MM-dd):</label>
          <input
            id="expirationDate"
            type="date"
            value={expirationDate}
            onChange={(e) => setExpirationDate(e.target.value)}
            required
          />
        </div>

        <button type="submit">Submit Donation</button>
      </form>
      {message && <p>{message}</p>}

      <Link href="/">
        <button>
          Return to Home
        </button>
      </Link>
    </div>
  );
}
