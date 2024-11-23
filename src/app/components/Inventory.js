'use client';
import React, {useEffect, useState} from 'react';
import Item from './ItemBox';

function Inventory() {

  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);

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
      setLoading(false);
    };

    // Uncomment to fetch inventory
    // fetchInventoryHandler();
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
      <div>
        <ul>
          {inventory.map((item) => (
            <Item key={item.id} item={item} />
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Inventory;