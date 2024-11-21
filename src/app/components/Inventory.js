'use client';
import React, {useEffect, useState} from 'react';

function Inventory() {

  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true); // To handle loading state

  useEffect(() => {
    const fetchInventoryHandler = async () => {
      console.log('fetching inventory');
      const response = await fetch('/api/inventory');

        if (response.ok) {
        console.log('response ok');
        const data = await response.json();
        console.log('data', data);
        setInventory(data.inventory);
        console.log('inventory', inventory);
      } else {
        console.error('Error fetching inventory');
      }
      setLoading(false); // Set loading to false after fetch
    };

    fetchInventoryHandler();
  }, []);

  if (loading) {
    return (
      <div>
        <h1>Inventory</h1>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div>
      <h1>Inventory</h1>
      <ul>
        {inventory.map((item) => (
          <li key={item.databaseId}>
            <h3>{item.itemName}</h3>
            <p>Category: {item.itemType}</p>
            <p>Amount: {item.quantity}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Inventory;