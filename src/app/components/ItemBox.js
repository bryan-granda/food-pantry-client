'use client';
import React, {useEffect, useState} from 'react';

function ItemBox({item}) {
  const [quantity, setQuantity] = useState(item.quantity);

  useEffect(() => {
    setQuantity(item.quantity);
  }, [item.quantity]);

  const updateQuantityHandler = async (event) => {
    event.preventDefault();
    const response = await fetch('/api/inventory/', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({quantity}),
    });

    if (response.ok) {
      console.log('Quantity updated successfully');
    } else {
      console.error('Error updating quantity');
    }
  };

  return (
    <li>
      <h3>{item.itemName}</h3>
      <p>Category: {item.itemType}</p>
      <p>Amount: {item.quantity}</p>
      <form onSubmit={updateQuantityHandler}>
        <label htmlFor="quantity">Update Quantity</label>
        <input type="number" id="quantity" min="1" value={quantity} onChange={(event) => setQuantity(event.target.value)} />
        <button type="submit">Update</button>
      </form>
    </li>
  );
}

export default ItemBox;