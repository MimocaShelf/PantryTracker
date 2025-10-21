import React, { useState } from 'react';

function PriceCompare() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    // Track per-item add state
    const [pendingAdd, setPendingAdd] = useState({});
    const [added, setAdded] = useState({});

    const parsePrice = (p) => {
        if (p == null) return null;
        if (typeof p === 'number') return p;
        if (typeof p === 'string') {
            const num = parseFloat(p.replace(/[^0-9.-]+/g, ''));
            return Number.isFinite(num) ? num : null;
        }
        if (p && typeof p === 'object') {
            if (p.price != null) return parsePrice(p.price);
            if (p.raw != null) return parsePrice(p.raw);
        }
        return null;
    };

    const extractProducts = (data) => {
        if (!data) return [];
        if (Array.isArray(data)) return data;
        if (data.products && Array.isArray(data.products)) return data.products;
        if (data.items && Array.isArray(data.items)) return data.items;
        if (data.results && Array.isArray(data.results)) return data.results;
        return [];
    };

    // Normalize/force brand to show when API returns product_brand
    const pickBrand = (it) => {
        const candidates = [
            it.product_brand,
            it.productBrand,
            it.brand,
            it.Brand,
            it.brandName,
            it.BrandName,
            it.manufacturer,
            it.Manufacturer,
        ];
        const hit = candidates.find(v => v !== undefined && v !== null && String(v).trim() !== '');
        return hit !== undefined ? String(hit) : '—';
    };

   
    const pickUrl = (it) => {
        const candidates = [
            it.url,            
            it.product_url,
            it.productUrl,
            it.link,
            it.href,
            it.deepLink,
            it.DeepLink,
        ];
        const hit = candidates.find(v => v && String(v).trim() !== '');
        return hit ? String(hit) : null;
    };

    const normalizeColes = (raw) => {
        const items = extractProducts(raw);
        return items.map((it, i) => ({
            store: 'Coles',
            id: it.id ?? it.productId ?? `coles-${i}`,
            name: it.name ?? it.product_name ?? it.title ?? String(it),
            brand: pickBrand(it),
            url: pickUrl(it),
            price: parsePrice(it.current_price ?? it.sellingPrice ?? it.unit_price ?? it.display_price),
            raw: it,
        }));
    };

    const normalizeWoolworths = (raw) => {
        const items = extractProducts(raw);
        return items.map((it, i) => ({
            store: 'Woolworths',
            id: it.id ?? it.productId ?? `ww-${i}`,
            name: it.Name ?? it.name ?? it.product_name ?? it.title ?? String(it),
            brand: pickBrand(it),
            url: pickUrl(it),
            price: parsePrice(it.current_price ?? it.price ?? it.sellingPrice ?? it.unit_price),
            raw: it,
        }));
    };

    const searchProduct = async () => {
        if (!query.trim()) return;
        setLoading(true);
        setError('');
        setResults([]);
        try {
            const q = encodeURIComponent(query.trim());

            const [colesRes, wwRes] = await Promise.all([
                fetch(`http://localhost:3001/getColesProduct?query=${q}`),
                fetch(`http://localhost:3001/getWoolworthsProduct?query=${q}`),
            ]);

            if (!colesRes.ok) throw new Error('Coles API error');
            if (!wwRes.ok) throw new Error('Woolworths API error');

            const [colesJson, wwJson] = await Promise.all([colesRes.json(), wwRes.json()]);

            const colesItems = normalizeColes(colesJson);
            const wwItems = normalizeWoolworths(wwJson);

            const combined = [...colesItems, ...wwItems].sort((a, b) => {
                if (a.price == null && b.price == null) return 0;
                if (a.price == null) return 1;
                if (b.price == null) return -1;
                return a.price - b.price;
            });

            setResults(combined);
        } catch (err) {
            console.error(err);
            setError('Failed to fetch prices. Check server and endpoints.');
        } finally {
            setLoading(false);
        }
    };

    // Add selected product to Shopping List in DB (defaults to qty 1)
    const addToShoppingList = async (item) => {
        const key = `${item.store}-${item.id}`;
        setPendingAdd((m) => ({ ...m, [key]: true }));
        try {
            const res = await fetch('http://localhost:3001/addShoppingListItem', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: item.name, quantity: 1 }),
            });
            if (!res.ok) throw new Error('Failed to add item');
            setAdded((m) => ({ ...m, [key]: true }));
        } catch (e) {
            console.error(e);
            alert('Failed to add to shopping list.');
        } finally {
            setPendingAdd((m) => ({ ...m, [key]: false }));
        }
    };

    return (
        <div style={{ padding: 20, maxWidth: 900, margin: '0 auto' }}>
            <h1>Product Search — Coles & Woolworths</h1>

            <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && searchProduct()}
                    placeholder="e.g. Kraft Singles"
                    style={{ flex: 1, padding: 8 }}
                />
                <button onClick={searchProduct} disabled={loading} style={{ padding: '8px 16px' }}>
                    {loading ? 'Searching…' : 'Search'}
                </button>
            </div>

            {error && <div style={{ color: 'red', marginBottom: 12 }}>{error}</div>}

            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr>
                        <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd', padding: 8 }}>Store</th>
                        <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd', padding: 8 }}>Product</th>
                        <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd', padding: 8 }}>Brand</th>
                        <th style={{ textAlign: 'right', borderBottom: '1px solid #ddd', padding: 8 }}>Price</th>
                        <th style={{ textAlign: 'right', borderBottom: '1px solid #ddd', padding: 8 }}>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {results.length === 0 && !loading && (
                        <tr>
                            <td colSpan="5" style={{ padding: 12, color: '#666' }}>
                                No results — try a different query.
                            </td>
                        </tr>
                    )}
                    {results.map((r) => {
                        const key = `${r.store}-${r.id}`;
                        const isPending = !!pendingAdd[key];
                        const isAdded = !!added[key];
                        return (
                            <tr key={key}>
                                <td style={{ padding: 8, borderBottom: '1px solid #f0f0f0' }}>{r.store}</td>
                                <td style={{ padding: 8, borderBottom: '1px solid #f0f0f0' }}>
                                    {r.url ? (
                                        <a href={r.url} target="_blank" rel="noopener noreferrer">
                                            {r.name}
                                        </a>
                                    ) : (
                                        r.name
                                    )}
                                </td>
                                <td style={{ padding: 8, borderBottom: '1px solid #f0f0f0' }}>{r.brand ?? '—'}</td>
                                <td style={{ padding: 8, textAlign: 'right', borderBottom: '1px solid #f0f0f0' }}>
                                    {r.price != null ? `$${Number(r.price).toFixed(2)}` : 'N/A'}
                                </td>
                                <td style={{ padding: 8, textAlign: 'right', borderBottom: '1px solid #f0f0f0' }}>
                                    <button
                                        onClick={() => addToShoppingList(r)}
                                        disabled={isPending || isAdded}
                                        style={{
                                            padding: '6px 12px',
                                            borderRadius: 6,
                                            border: '1px solid var(--purple, #6c63ff)',
                                            background: isAdded ? 'var(--lavender, #e6e0ff)' : 'transparent',
                                            color: 'var(--purple, #6c63ff)',
                                            cursor: isPending || isAdded ? 'not-allowed' : 'pointer',
                                        }}
                                    >
                                        {isAdded ? 'Added' : isPending ? 'Adding…' : 'Add to List'}
                                    </button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}

export default PriceCompare;