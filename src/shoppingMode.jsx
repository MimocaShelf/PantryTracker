import React, { useState } from 'react';
import './style.css';

function ShoppingMode() {
    const [itemsToBuy, setItemsToBuy] = useState([
        { name: 'Apples', quantity: 1 },
        { name: 'Bananas', quantity: 2 },
        { name: 'Carrots', quantity: 3 },
    ]);
    const [boughtItems, setBoughtItems] = useState([]);
    const [message, setMessage] = useState('');

    // Mark item as bought
    const markAsBought = (idx) => {
        const item = itemsToBuy[idx];
        setBoughtItems([...boughtItems, item]);
        setItemsToBuy(itemsToBuy.filter((_, i) => i !== idx));
    };

    // Send bought items to the backend to add to the DB
    const syncBoughtItems = async () => {
        let success = true;
        for (const item of boughtItems) {
            const res = await fetch('http://localhost:3001/addPantryItem', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    item_name: item.name,
                    quantity: item.quantity,
                    unit: 'units',
                    pantry_id: 1,
                }),
            });
            if (!res.ok) success = false;
        }
        setMessage(success ? 'All bought items added to pantry!' : 'Some items failed to sync.');
        setBoughtItems([]);
    };

    return (
        <div className="genericContentBox" style={{ maxWidth: 600, margin: '40px auto' }}>
            <h1 id="lavender-text">Shopping Mode</h1>
            <p style={{ color: 'var(--white)' }}>
                Mark items as bought and add them to your pantry.
            </p>

            <h2 style={{ color: 'var(--lavender)' }}>Items To Buy</h2>
            <ul style={{ listStyle: 'none', padding: 0 }}>
                {itemsToBuy.length === 0 && <li style={{ color: 'var(--white)' }}>All items bought!</li>}
                {itemsToBuy.map((item, idx) => (
                    <li
                        key={idx}
                        style={{
                            background: 'var(--lavender)',
                            color: 'var(--blue)',
                            borderRadius: '6px',
                            padding: '10px 16px',
                            marginBottom: '10px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                        }}
                    >
                        <span>
                            {item.name} (x{item.quantity})
                        </span>
                        <button
                            style={{
                                background: 'var(--purple)',
                                color: 'var(--white)',
                                borderRadius: '5px',
                                padding: '5px 12px',
                                cursor: 'pointer',
                            }}
                            onClick={() => markAsBought(idx)}
                        >
                            Mark as Bought
                        </button>
                    </li>
                ))}
            </ul>

            <h2 style={{ color: 'var(--lavender)' }}>Bought Items</h2>
            <ul style={{ listStyle: 'none', padding: 0 }}>
                {boughtItems.length === 0 && <li style={{ color: 'var(--white)' }}>No items bought yet.</li>}
                {boughtItems.map((item, idx) => (
                    <li
                        key={idx}
                        style={{
                            background: 'var(--blue)',
                            color: 'var(--white)',
                            borderRadius: '6px',
                            padding: '10px 16px',
                            marginBottom: '10px',
                        }}
                    >
                        {item.name} (x{item.quantity})
                    </li>
                ))}
            </ul>

            <button
                onClick={syncBoughtItems}
                disabled={boughtItems.length === 0}
                style={{
                    marginTop: '20px',
                    background: 'var(--lavender)',
                    color: 'var(--purple)',
                    border: '1px solid var(--purple)',
                    borderRadius: '8px',
                    padding: '10px 24px',
                    fontWeight: 600,
                    cursor: boughtItems.length === 0 ? 'not-allowed' : 'pointer',
                }}
            >
                Add Bought Items to Pantry
            </button>
            {message && (
                <div style={{ marginTop: '16px', color: 'var(--white)' }}>{message}</div>
            )}
        </div>
    );
}

export default ShoppingMode;