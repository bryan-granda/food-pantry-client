"use client";

import { useContext, useEffect, useState } from "react";
import { SessionContext } from "@/context/SessionContext";
import Link from "next/link";
import styles from "../components/Forms.module.css";
import { API_KEY, BASE_URL } from "@/app/components/constants.js";

export default function ManageStorages() {
  const { orgID } = useContext(SessionContext);
  const [storages, setStorages] = useState([]);
  const [message, setMessage] = useState("");
  const [view, setView] = useState("list");

  const [newStorageName, setNewStorageName] = useState("");
  const [newStorageDescription, setNewStorageDescription] = useState("");

  const [selectedUpdateStorageId, setSelectedUpdateStorageId] = useState("");
  const [updatedName, setUpdatedName] = useState("");
  const [updatedDescription, setUpdatedDescription] = useState("");

  const [selectedDeleteStorageId, setSelectedDeleteStorageId] = useState("");

  const [selectedInventoryStorageId, setSelectedInventoryStorageId] = useState("");
  const [inventory, setInventory] = useState([]);

  useEffect(() => {
    if (!orgID) {
      setMessage("You must be logged in to view this page.");
      return;
    }
    fetchStorages();
  }, [orgID]);

  const fetchStorages = async () => {
    setMessage("");
    try {
      const response = await fetch(
        `${BASE_URL}/listAllCenters?`
      );

      if (response.ok) {
        const data = await response.json();
        setStorages(data);
      } else {
        const errorData = await response.json();
        setMessage(`Error: ${errorData.error || "Failed to fetch storages."}`);
      }
    } catch (error) {
      console.error("Error fetching storages:", error);
      setMessage("An unexpected error occurred while fetching storages.");
    }
  };

  const handleAddStorage = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const response = await fetch(
        `${BASE_URL}/createCenter?`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            name: newStorageName,
            description: newStorageDescription,
          }),
        }
      );

      if (response.ok) {
        setMessage("Storage Center added successfully!");
        setNewStorageName("");
        setNewStorageDescription("");
        fetchStorages();
      } else {
        const errorData = await response.json();
        setMessage(`Error: ${errorData.error || "Failed to add storage center."}`);
      }
    } catch (error) {
      console.error("Error adding storage center:", error);
      setMessage("An unexpected error occurred while adding the storage center.");
    }
  };

  const handleUpdateStorage = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      if (updatedName) {
        await fetch(
          `${BASE_URL}/updateCenterName?storageCenterId=${encodeURIComponent(
            selectedUpdateStorageId
          )}&name=${encodeURIComponent(updatedName)}`,
          { method: "PATCH" }
        );
      }

      if (updatedDescription) {
        await fetch(
          `${BASE_URL}/updateCenterDescription?storageCenterId=${encodeURIComponent(
            selectedUpdateStorageId
          )}&description=${encodeURIComponent(updatedDescription)}`,
          { method: "PATCH" }
        );
      }

      setMessage("Storage Center updated successfully.");
      setSelectedUpdateStorageId("");
      setUpdatedName("");
      setUpdatedDescription("");
      fetchStorages();
      setView("list");
    } catch (error) {
      console.error("Error updating storage center:", error);
      setMessage("An unexpected error occurred while updating the storage center.");
    }
  };

  const handleDeleteStorage = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const response = await fetch(
        `${BASE_URL}/deleteCenter?storageCenterId=${encodeURIComponent(
          selectedDeleteStorageId
        )}`,
        { method: "DELETE" }
      );

      if (response.ok) {
        setMessage("Storage Center deleted successfully.");
        setSelectedDeleteStorageId("");
        fetchStorages();
        setView("list");
      } else {
        const errorData = await response.json();
        setMessage(`Error: ${errorData.error || "Failed to delete storage center."}`);
      }
    } catch (error) {
      console.error("Error deleting storage center:", error);
      setMessage("An unexpected error occurred while deleting the storage center.");
    }
  };

  const handleViewInventory = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const response = await fetch(
        `${BASE_URL}/listInventory?&storageCenterId=${encodeURIComponent(
          selectedInventoryStorageId
        )}`
      );

      if (response.ok) {
        const data = await response.json();
        setInventory(data);
      } else {
        const errorData = await response.json();
        setMessage(`Error: ${errorData.error || "Failed to fetch inventory."}`);
      }
    } catch (error) {
      console.error("Error fetching inventory:", error);
      setMessage("An unexpected error occurred while fetching inventory.");
    }
  };

  return (
    <div className={styles.container}>
      <h1>Manage Storage Centers</h1>
      {message && <p className={styles.message}>{message}</p>}

      <div className={styles.buttonGroup}>
        <button onClick={() => setView("list")} className={styles.submitButton}>
          List All Storage Centers
        </button>
        <button onClick={() => setView("add")} className={styles.submitButton}>
          Add Storage Center
        </button>
        <button onClick={() => setView("update")} className={styles.submitButton}>
          Update Storage Center
        </button>
        <button onClick={() => setView("delete")} className={styles.submitButton}>
          Delete Storage Center
        </button>
        <button onClick={() => setView("inventory")} className={styles.submitButton}>
          View Inventory
        </button>
      </div>

      {view === "list" && storages.length > 0 ? (
  <ul>
    {storages.map((storage) => (
      <li key={storage.id}>
        <h4>{storage.name}</h4>
        <p><strong>ID:</strong> {storage.id}</p>
        <p><strong>Description:</strong> {storage.description}</p>
      </li>
    ))}
  </ul>
) : (
  <p></p>
)}

      {view === "add" && (
        <form onSubmit={handleAddStorage}>
          <label>
            Name:
            <input
              type="text"
              value={newStorageName}
              onChange={(e) => setNewStorageName(e.target.value)}
              required
            />
          </label>
          <label>
            Description:
            <textarea
              value={newStorageDescription}
              onChange={(e) => setNewStorageDescription(e.target.value)}
              required
            />
          </label>
          <button type="submit">Add Storage Center</button>
        </form>
      )}

      {view === "update" && (
        <form onSubmit={handleUpdateStorage}>
          <label>
            Select Storage Center:
            <select
              value={selectedUpdateStorageId}
              onChange={(e) => setSelectedUpdateStorageId(e.target.value)}
              required
            >
              <option value="">--Select--</option>
              {storages.map((storage) => (
                <option key={storage.id} value={storage.id}>
                  {storage.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            New Name:
            <input
              type="text"
              value={updatedName}
              onChange={(e) => setUpdatedName(e.target.value)}
            />
          </label>
          <label>
            New Description:
            <textarea
              value={updatedDescription}
              onChange={(e) => setUpdatedDescription(e.target.value)}
            />
          </label>
          <button type="submit">Update Storage Center</button>
        </form>
      )}

      {view === "delete" && (
        <form onSubmit={handleDeleteStorage}>
          <label>
            Select Storage Center:
            <select
              value={selectedDeleteStorageId}
              onChange={(e) => setSelectedDeleteStorageId(e.target.value)}
              required
            >
              <option value="">--Select--</option>
              {storages.map((storage) => (
                <option key={storage.id} value={storage.id}>
                  {storage.name}
                </option>
              ))}
            </select>
          </label>
          <button type="submit">Delete Storage Center</button>
        </form>
      )}

      {view === "inventory" && (
        <form onSubmit={handleViewInventory}>
          <label>
            Select Storage Center:
            <select
              value={selectedInventoryStorageId}
              onChange={(e) => setSelectedInventoryStorageId(e.target.value)}
              required
            >
              <option value="">--Select--</option>
              {storages.map((storage) => (
                <option key={storage.id} value={storage.id}>
                  {storage.name}
                </option>
              ))}
            </select>
          </label>
          <button type="submit">View Inventory</button>

          {inventory.length > 0 && (
            <ul>
              {inventory.map((item) => (
                <li key={item.id}>
                  <p>Name: {item.name}</p>
                  <p>Type: {item.type}</p>
                  <p>Quantity: {item.quantity}</p>
                </li>
              ))}
            </ul>
          )}
        </form>
      )}
            <div style={{ marginTop: '20px' }}>
            <div style={{ marginTop: '20px' }}>
        <Link href="/organization">
          <button className={styles.submitButton}>Return to Org</button>
        </Link>
      </div>
        <Link href="/">
          <button className={styles.submitButton}>Return to Home</button>
        </Link>
      </div>
    </div>
  );
}
