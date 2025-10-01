import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './style.css';

function ShoppingList() {
    const [items, setItems] = useState([
        { name: 'Apples', quantity: 1 },
        { name: 'Bananas', quantity: 2 },
        { name: 'Carrots', quantity: 3 },
    ]);
    const [inputValue, setInputValue] = useState('');
    const [quantityValue, setQuantityValue] = useState(1);

    // Fetch low stock items from the backend
    const [lowStockRecommendations, setLowStockRecommendations] = useState([]);

    useEffect(() => {
        fetch('http://localhost:3001/getLowStockItems')
            .then(res => res.json())
            .then(data => {
                setLowStockRecommendations(
                    data.filter(
                        stockItem =>
                            !items.some(
                                item =>
                                    item.name.toLowerCase() ===
                                    stockItem.item_name.toLowerCase()
                            )
                    )
                );
            });
    }, [items]);

    // Function to handle adding an item
    const addItem = () => {
        if (
            inputValue.trim() !== '' &&
            quantityValue > 0 &&
            Number.isInteger(quantityValue)
        ) {
            setItems([...items, { name: inputValue.trim(), quantity: quantityValue }]);
            setInputValue('');
            setQuantityValue(1);
        }
    };

    // Function to handle removing an item
    const removeItem = (index) => {
        const updatedItems = [...items];
        updatedItems.splice(index, 1);
        setItems(updatedItems);
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
            i === index && item.quantity > 1
                ? { ...item, quantity: item.quantity - 1 }
                : item
        );
        setItems(updatedItems);
    };

    // Add recommended item to shopping list
    const addRecommendedItem = (name) => {
        setItems([...items, { name, quantity: 1 }]);
    };

    // Add navigation to shopping mode
    const navigate = useNavigate();

    return (
        <div className="genericContentBox" style={{ maxWidth: 600, margin: '40px auto' }}>
            <h1>Shopping List</h1>
            <button
                style={{
                    marginBottom: '24px',
                    background: 'var(--lavender)',
                    color: 'var(--purple)',
                    border: '1px solid var(--purple)',  
                    borderRadius: '8px',
                    padding: '10px 24px',
                    fontWeight: 600,
                    cursor: 'pointer',
                }}
                onClick={() => navigate('/shoppingMode')}
            >
                Go to Shopping Mode
            </button>
            <div style={{ marginBottom: '24px' }}>
                <input
                    type="text"
                    placeholder="Item name"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    style={{
                        padding: '8px',
                        borderRadius: '6px',
                        border: '1px solid #ccc',
                        marginRight: '10px',
                        width: '40%',
                    }}
                />
                <input
                    type="number"
                    placeholder="Quantity"
                    value={quantityValue}
                    min={1}
                    onChange={(e) => {
                        const val = Number(e.target.value);
                        setQuantityValue(val < 1 ? 1 : Math.floor(val));
                    }}
                    style={{
                        padding: '8px',
                        borderRadius: '6px',
                        border: '1px solid #ccc',
                        width: '80px',
                        marginRight: '10px',
                    }}
                />
                <button onClick={addItem}>Add Item</button>
            </div>

            <ul style={{ padding: 0, listStyle: 'none', marginBottom: '32px' }}>
                {items.map((item, idx) => (
                    <li
                        key={idx}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            background: 'var(--lavender)',
                            color: 'var(--blue)',
                            borderRadius: '6px',
                            padding: '10px 16px',
                            marginBottom: '10px',
                        }}
                    >
                        <span>
                            {item.name} &nbsp;
                            <button onClick={() => decreaseQuantity(idx)} style={{ padding: '2px 8px', marginLeft: '8px', marginRight: '4px' }}>-</button>
                            {item.quantity}
                            <button onClick={() => increaseQuantity(idx)} style={{ padding: '2px 8px', marginLeft: '4px', marginRight: '8px' }}>+</button>
                        </span>
                        <button onClick={() => removeItem(idx)} style={{ background: 'var(--purple)', color: 'var(--white)' }}>
                            Remove
                        </button>
                    </li>
                ))}
            </ul>

            {/* Recommendation Section */}
            <div
                style={{
                    marginTop: '30px',
                    padding: '15px',
                    background: 'var(--blue)',
                    border: '1px solid var(--purple)',
                    borderRadius: '8px',
                }}
            >
                <h2 id="lavender-text">Recommended: Low Stock Items</h2>
                {lowStockRecommendations.length === 0 ? (
                    <p style={{ color: 'var(--white)' }}>All pantry items are sufficiently stocked!</p>
                ) : (
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        {lowStockRecommendations.map((item, idx) => (
                            <li key={idx} style={{ marginBottom: '8px', color: 'var(--white)' }}>
                                {item.item_name} (Current: {item.quantity})
                                <button
                                    style={{
                                        marginLeft: '10px',
                                        padding: '3px 10px',
                                        backgroundColor: 'var(--lavender)',
                                        border: '1px solid var(--purple)',
                                        borderRadius: '5px',
                                        color: 'var(--purple)',
                                        cursor: 'pointer',
                                    }}
                                    onClick={() => addRecommendedItem(item.item_name)}
                                >
                                    Add to List
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}

export default ShoppingList;