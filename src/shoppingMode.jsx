import React, { useState, useEffect } from 'react';
import './style.css';

function ShoppingMode() {
    const [itemsToBuy, setItemsToBuy] = useState([]);
    const [boughtItems, setBoughtItems] = useState([]);
    const [message, setMessage] = useState('');
    const [pantries, setPantries] = useState([]);
    const [selectedPantryId, setSelectedPantryId] = useState(null);
    const [pantryError, setPantryError] = useState('');

    // Load shopping list from localStorage or backend
    useEffect(() => {
        const stored = localStorage.getItem('shoppingList');
        if (stored) {
            setItemsToBuy(JSON.parse(stored));
        }
    }, []);

    // Load user's pantries
    useEffect(() => {
        const userId = localStorage.getItem('user_id');
        if (!userId) {
            setPantryError('No user found. Please log in to select a pantry.');
            return;
        }

        (async () => {
            try {
                const res = await fetch('http://localhost:3001/postGetPantriesForUser', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ user_id: Number(userId) }),
                });
                if (!res.ok) throw new Error('Failed to load pantries');
                const data = await res.json();
                setPantries(data || []);
                if (data && data.length > 0) {
                    setSelectedPantryId(data[0].pantry_id);
                } else {
                    setPantryError('No pantries found for this user.');
                }
            } catch (e) {
                setPantryError('Error loading pantries.');
            }
        })();
    }, []);

    // Keep shopping list in sync with localStorage
    useEffect(() => {
        localStorage.setItem('shoppingList', JSON.stringify(itemsToBuy));
    }, [itemsToBuy]);

    // Mark item as bought
    const markAsBought = (idx) => {
        const item = itemsToBuy[idx];
        setBoughtItems([...boughtItems, item]);
        setItemsToBuy(itemsToBuy.filter((_, i) => i !== idx));
    };

    // Send bought items to the backend to add to the DB and remove them from the shopping list
    const syncBoughtItems = async () => {
        if (!selectedPantryId) {
            setMessage('Please select a pantry before syncing.');
            return;
        }
        let success = true;
        for (const item of boughtItems) {
            // Add item to pantry
            const res = await fetch('http://localhost:3001/postAddItemToPantry', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    pantry_id: selectedPantryId,
                    item_name: item.name,
                    extra_info: 'None', // Default extra info
                    quantity: item.quantity,
                    unit: 'units', // Default unit
                }),
            });

            if (!res.ok) {
                success = false;
                continue;
            }

            // Remove item from shopping list
            const removeRes = await fetch('http://localhost:3001/removeShoppingListItem', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: item.name }),
            });

            if (!removeRes.ok) {
                success = false;
            }
        }

        if (success) {
            setMessage('All bought items added to pantry and removed from the shopping list!');
            setBoughtItems([]); // Clear bought items after syncing
        } else {
            setMessage('Some items failed to sync. Please try again.');
        }
    };

    return (
        <div className="genericContentBox" style={{ maxWidth: 600, margin: '40px auto' }}>
            <h1 style={{ color: 'black' }}>Shopping Mode</h1>
            <p style={{ color: 'black' }}>
                Mark items as bought and add them to your pantry.
            </p>

            {/* Pantry selector */}
            <div style={{ margin: '16px 0' }}>
                <label htmlFor="pantrySelect" style={{ color: 'black', marginRight: 8 }}>Destination Pantry:</label>
                <select
                    id="pantrySelect"
                    data-testid="pantry-select"
                    value={selectedPantryId ?? ''}
                    onChange={(e) => setSelectedPantryId(Number(e.target.value))}
                    disabled={pantries.length === 0}
                    style={{ padding: '6px 10px', borderRadius: 6 }}
                >
                    {pantries.length === 0 ? (
                        <option value="" disabled>
                            {pantryError || 'Loading pantries...'}
                        </option>
                    ) : (
                        pantries.map((p) => (
                            <option key={p.pantry_id} value={p.pantry_id}>
                                {p.pantry_name} (ID: {p.pantry_id})
                            </option>
                        ))
                    )}
                </select>
            </div>

            <h2 style={{ color: 'black' }}>Items To Buy</h2>
            <ul style={{ listStyle: 'none', padding: 0 }}>
                {itemsToBuy.length === 0 && <li style={{ color: 'black' }}>All items bought!</li>}
                {itemsToBuy.map((item, idx) => (
                    <li
                        key={idx}
                        style={{
                            background: 'var(--lavender)',
                            color: 'black',
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

            <h2 style={{ color: 'black' }}>Bought Items</h2>
            <ul style={{ listStyle: 'none', padding: 0 }}>
                {boughtItems.length === 0 && <li style={{ color: 'black' }}>No items bought yet.</li>}
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
                disabled={boughtItems.length === 0 || !selectedPantryId}
                style={{
                    marginTop: '20px',
                    background: 'var(--lavender)',
                    color: 'black',
                    border: '1px solid var(--purple)',
                    borderRadius: '8px',
                    padding: '10px 24px',
                    fontWeight: 600,
                    cursor: boughtItems.length === 0 || !selectedPantryId ? 'not-allowed' : 'pointer',
                }}
            >
                Add Bought Items to Pantry
            </button>
            {message && (
                <div style={{ marginTop: '16px', color: 'black' }}>{message}</div>
            )}
        </div>
    );
}

export default ShoppingMode;