import React, { useState } from 'react';

function ShoppingList() {
    const [items, setItems] = useState(['Apples', 'Bananas', 'Carrots']); // Pre-added items
    const [inputValue, setInputValue] = useState(''); // State to store the current input value

    // Function to handle adding an item
    const addItem = () => {
        if (inputValue.trim() !== '') {
            setItems([...items, inputValue.trim()]);
            setInputValue(''); // Clear the input field
        }
    };

    // Function to handle removing an item
    const removeItem = (index) => {
        const newItems = items.filter((_, i) => i !== index);
        setItems(newItems);
    };

    return (
        <div>
            <h1>Shopping List</h1>
            <div>
                <input
                    type="text"
                    placeholder="Add an item"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                />
                <button onClick={addItem}>Add Item</button>
            </div>
            <ul>
                {items.map((item, index) => (
                    <li key={index}>
                        {item}
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