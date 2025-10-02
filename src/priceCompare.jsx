import React, { useState, useEffect } from 'react';

function PriceCompare() {
    const [colesPrices, setColesPrices] = useState([]);
    const [woolworthsPrices, setWoolworthsPrices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Fetch prices from Coles and Woolworths APIs
    useEffect(() => {
        const fetchPrices = async () => {
            try {
                setLoading(true);

                // Fetch Coles prices
                const colesResponse = await fetch('http://localhost:3001/getColesPriceChanges');
                const colesData = await colesResponse.json();

                // Fetch Woolworths prices (replace with your Woolworths API endpoint)
                const woolworthsResponse = await fetch('http://localhost:3001/getWoolworthsPriceChanges');
                const woolworthsData = await woolworthsResponse.json();

                setColesPrices(colesData);
                setWoolworthsPrices(woolworthsData);
            } catch (err) {
                console.error('Error fetching prices:', err);
                setError('Failed to fetch prices. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchPrices();
    }, []);

    // Helper function to find the best price for a product
    const findBestPrice = (productName) => {
        const colesProduct = colesPrices.find((item) => item.name === productName);
        const woolworthsProduct = woolworthsPrices.find((item) => item.name === productName);

        if (!colesProduct && !woolworthsProduct) return null;

        if (!colesProduct) return { store: 'Woolworths', price: woolworthsProduct.price };
        if (!woolworthsProduct) return { store: 'Coles', price: colesProduct.price };

        return colesProduct.price < woolworthsProduct.price
            ? { store: 'Coles', price: colesProduct.price }
            : { store: 'Woolworths', price: woolworthsProduct.price };
    };

    return (
        <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
            <h1>Price Comparison: Coles vs Woolworths</h1>

            {loading && <p>Loading prices...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}

            {!loading && !error && (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr>
                            <th style={{ border: '1px solid #ccc', padding: '8px' }}>Product</th>
                            <th style={{ border: '1px solid #ccc', padding: '8px' }}>Coles Price</th>
                            <th style={{ border: '1px solid #ccc', padding: '8px' }}>Woolworths Price</th>
                            <th style={{ border: '1px solid #ccc', padding: '8px' }}>Best Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        {[
                            ...new Set([
                                ...colesPrices.map((item) => item.name),
                                ...woolworthsPrices.map((item) => item.name),
                            ]),
                        ].map((productName) => {
                            const colesProduct = colesPrices.find((item) => item.name === productName);
                            const woolworthsProduct = woolworthsPrices.find((item) => item.name === productName);
                            const bestPrice = findBestPrice(productName);

                            return (
                                <tr key={productName}>
                                    <td style={{ border: '1px solid #ccc', padding: '8px' }}>{productName}</td>
                                    <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                                        {colesProduct ? `$${colesProduct.price.toFixed(2)}` : 'N/A'}
                                    </td>
                                    <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                                        {woolworthsProduct ? `$${woolworthsProduct.price.toFixed(2)}` : 'N/A'}
                                    </td>
                                    <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                                        {bestPrice ? `${bestPrice.store} ($${bestPrice.price.toFixed(2)})` : 'N/A'}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            )}
        </div>
    );
}

function ProductSearch() {
    const [query, setQuery] = useState('');
    const [colesData, setColesData] = useState(null);
    const [woolworthsData, setWoolworthsData] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const searchProduct = async () => {
        try {
            setLoading(true);
            setError('');
            setColesData(null);
            setWoolworthsData(null);

            // Fetch Coles product data
            const colesResponse = await fetch(`http://localhost:3001/getColesProduct?query=${query}`);
            if (!colesResponse.ok) {
                throw new Error('Failed to fetch Coles product data');
            }
            const colesResult = await colesResponse.json();
            setColesData(colesResult);

            // Fetch Woolworths product data
            const woolworthsResponse = await fetch(`http://localhost:3001/getWoolworthsProduct?query=${query}`);
            if (!woolworthsResponse.ok) {
                throw new Error('Failed to fetch Woolworths product data');
            }
            const woolworthsResult = await woolworthsResponse.json();
            setWoolworthsData(woolworthsResult);
        } catch (err) {
            console.error(err);
            setError('Error fetching product data. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
            <h1>Product Search: Coles vs Woolworths</h1>
            <input
                type="text"
                placeholder="Enter product name"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                style={{ padding: '8px', width: '100%', marginBottom: '10px' }}
            />
            <button
                onClick={searchProduct}
                style={{
                    padding: '10px 20px',
                    backgroundColor: '#007BFF',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                }}
            >
                Search
            </button>
            {loading && <p>Loading...</p>}
            {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
            {!loading && (colesData || woolworthsData) && (
                <div style={{ marginTop: '20px' }}>
                    <h2>Search Results:</h2>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr>
                                <th style={{ border: '1px solid #ccc', padding: '8px' }}>Store</th>
                                <th style={{ border: '1px solid #ccc', padding: '8px' }}>Product</th>
                                <th style={{ border: '1px solid #ccc', padding: '8px' }}>Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* Coles Results */}
                            {colesData && colesData.products && colesData.products.length > 0 ? (
                                colesData.products.map((product, index) => (
                                    <tr key={`coles-${index}`}>
                                        <td style={{ border: '1px solid #ccc', padding: '8px' }}>Coles</td>
                                        <td style={{ border: '1px solid #ccc', padding: '8px' }}>{product.name}</td>
                                        <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                                            ${product.price.toFixed(2)}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td style={{ border: '1px solid #ccc', padding: '8px' }}>Coles</td>
                                    <td style={{ border: '1px solid #ccc', padding: '8px' }} colSpan="2">
                                        No results found
                                    </td>
                                </tr>
                            )}

                            {/* Woolworths Results */}
                            {woolworthsData && woolworthsData.products && woolworthsData.products.length > 0 ? (
                                woolworthsData.products.map((product, index) => (
                                    <tr key={`woolworths-${index}`}>
                                        <td style={{ border: '1px solid #ccc', padding: '8px' }}>Woolworths</td>
                                        <td style={{ border: '1px solid #ccc', padding: '8px' }}>{product.name}</td>
                                        <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                                            ${product.price.toFixed(2)}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td style={{ border: '1px solid #ccc', padding: '8px' }}>Woolworths</td>
                                    <td style={{ border: '1px solid #ccc', padding: '8px' }} colSpan="2">
                                        No results found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default function App() {
    return (
        <div>
            <PriceCompare />
            <ProductSearch />
        </div>
    );
}