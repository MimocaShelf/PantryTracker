import React, { useState } from 'react';

function PriceCompare() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]); // normalized results from both stores
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

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
        // Common shapes: { products: [...] } or { data: [...] } or an array
        if (Array.isArray(data)) return data;
        if (data.products && Array.isArray(data.products)) return data.products;
        if (data.items && Array.isArray(data.items)) return data.items;
        if (data.results && Array.isArray(data.results)) return data.results;
        // fallback: return [] but keep raw in a single-element array for debugging
        return [];
    };

    const normalizeColes = (raw) => {
        const items = extractProducts(raw);
        return items.map((it, i) => ({
            store: 'Coles',
            id: it.id ?? it.productId ?? `coles-${i}`,
            name: it.name ?? it.product_name ?? it.title ?? String(it),
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

            console.log('coles response', colesJson);
            console.log('woolworths response', wwJson);

            const colesItems = normalizeColes(colesJson);
            const wwItems = normalizeWoolworths(wwJson);

            // combine and sort by price if available
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
                        <th style={{ textAlign: 'right', borderBottom: '1px solid #ddd', padding: 8 }}>Price</th>
                    </tr>
                </thead>
                <tbody>
                    {results.length === 0 && !loading && (
                        <tr><td colSpan="3" style={{ padding: 12, color: '#666' }}>No results — try a different query.</td></tr>
                    )}
                    {results.map((r) => (
                        <tr key={`${r.store}-${r.id}`} >
                            <td style={{ padding: 8, borderBottom: '1px solid #f0f0f0' }}>{r.store}</td>
                            <td style={{ padding: 8, borderBottom: '1px solid #f0f0f0' }}>{r.name}</td>
                            <td style={{ padding: 8, textAlign: 'right', borderBottom: '1px solid #f0f0f0' }}>
                                {r.price != null ? `$${Number(r.price).toFixed(2)}` : 'N/A'}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Debug: view raw data in console */}
        </div>
    );
}

export default PriceCompare;