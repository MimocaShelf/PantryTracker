import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Import Link for navigation

function ShoppingList() {
    const [items, setItems] = useState([
        { name: 'Apples', quantity: 1 },
        { name: 'Bananas', quantity: 2 },
        { name: 'Carrots', quantity: 3 },
    ]); // Pre-added items with quantities
    const [inputValue, setInputValue] = useState(''); // State to store the current input value
    const [quantityValue, setQuantityValue] = useState(1); // State to store the quantity value

    // Function to handle adding an item
    const addItem = () => {
        if (inputValue.trim() !== '' && quantityValue > 0) {
            setItems([...items, { name: inputValue.trim(), quantity: quantityValue }]);
            setInputValue(''); // Clear the input field
            setQuantityValue(1); // Reset the quantity field
        }
    };

    // Function to handle removing an item
    const removeItem = (index) => {
        const newItems = items.filter((_, i) => i !== index);
        setItems(newItems);
    };

    return (
        <div>
            {/* Back Button */}
            <Link to="/" style={{ display: 'inline-block', marginBottom: '20px', textDecoration: 'none' }}>
                &larr; Back to Home
            </Link>

            <h1>Shopping List</h1>
            <div>
                <input
                    type="text"
                    placeholder="Add an item"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                />
                <input
                    type="number"
                    placeholder="Quantity"
                    value={quantityValue}
                    onChange={(e) => setQuantityValue(Number(e.target.value))}
                    style={{ marginLeft: '10px', width: '80px' }}
                />
                <button onClick={addItem} style={{ marginLeft: '10px' }}>
                    Add Item
                </button>
            </div>
            <ul>
                {items.map((item, index) => (
                    <li key={index}>
                        {item.name} (x{item.quantity})
                        <button onClick={() => removeItem(index)} style={{ marginLeft: '10px' }}>
                            Remove
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default ShoppingList;