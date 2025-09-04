import React, { useState } from 'react';
import { Link } from 'react-router-dom';

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

    // Function to increase the quantity of an item
    const increaseQuantity = (index) => {
        const updatedItems = items.map((item, i) =>
            i === index ? { ...item, quantity: item.quantity + 1 } : item
        );
        setItems(updatedItems);
    };

    // Function to decrease the quantity of an item
    const decreaseQuantity = (index) => {
        const updatedItems = items.map((item, i) =>
            i === index && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item
        );
        setItems(updatedItems);
    };

    return (
        <div>
            {/* Back Button */}
            <Link
                to="/"
                style={{
                    position: 'absolute',
                    top: '10px',
                    left: '10px',
                    textDecoration: 'none',
                    padding: '5px 10px',
                    backgroundColor: '#f0f0f0',
                    border: '1px solid #ccc',
                    borderRadius: '5px',
                    color: '#333',
                }}
            >
                &larr; Back to Home
            </Link>

            <h1 style={{ marginTop: '50px' }}>Shopping List</h1>
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
                    <li key={index} style={{ marginBottom: '10px' }}>
                        {item.name} (x{item.quantity})
                        <button
                            onClick={() => decreaseQuantity(index)}
                            style={{
                                marginLeft: '10px',
                                padding: '5px 10px',
                                backgroundColor: '#f8d7da',
                                border: '1px solid #f5c6cb',
                                borderRadius: '5px',
                                color: '#721c24',
                            }}
                        >
                            -
                        </button>
                        <button
                            onClick={() => increaseQuantity(index)}
                            style={{
                                marginLeft: '5px',
                                padding: '5px 10px',
                                backgroundColor: '#d4edda',
                                border: '1px solid #c3e6cb',
                                borderRadius: '5px',
                                color: '#155724',
                            }}
                        >
                            +
                        </button>
                        <button
                            onClick={() => removeItem(index)}
                            style={{
                                marginLeft: '10px',
                                padding: '5px 10px',
                                backgroundColor: '#f0f0f0',
                                border: '1px solid #ccc',
                                borderRadius: '5px',
                                color: '#333',
                            }}
                        >
                            Remove
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default ShoppingList;