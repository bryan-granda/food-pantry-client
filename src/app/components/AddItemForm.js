'use client';
import React, {useState} from 'react';

function AddItemForm() {
  // TODO: change to false after implementing form submission
  const [successfulSubmit, setSuccessfulSubmit] = useState(true);

  const onSubmitHandler = async (event) => {
  // TODO: Implement form submission
    event.preventDefault();
  };

  return (
    <div>
      <h1>Add Item</h1>
      <p>Use this form to add an item to the inventory.</p>
      <p>Item Name, Item Type, and Quantity are required fields.</p>
      <form onSubmit={onSubmitHandler}>
        <label htmlFor="itemName">Item Name</label>
        <input type="text" id="itemName" name="itemName" required/>
        <label htmlFor="itemType">Item Type</label>
        <select id="itemType" name="itemType" defaultValue="" required>
          <option value="" disabled>Select an item type</option>
          <option value="FOOD">FOOD</option>
          <option value="CLOTHES">CLOTHES</option>
          <option value="TOILETRIES">TOILETRIES</option>
        </select>
        <label htmlFor="quantity">Quantity</label>
        <input type="number" id="quantity" min="1" name="quantity" required />
        <button type="submit">Add Item</button>
      </form>
      {successfulSubmit && <p>Item added successfully!</p>}
    </div>
  );
}

export default AddItemForm;