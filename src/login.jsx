import React, {useState} from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Login() {
    const [form, setForm] = useState({ 
        email: '',
        password: '',
        rememberMe: false
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const path = "http://localhost:3001";

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm(prevForm => ({  ...prevForm, [name]: type === 'checkbox'? checked : value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const res = await fetch(path + '/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: form.email,
                    password: form.password
                }),
            });
            if (!res.ok) {
                throw new Error('Failed to log in');
            }

            const data = await res.json();

            localStorage.setItem('user_id', JSON.stringify(data.user_id));
            console.log("User ID stored in localStorage:", data.user_id);

            navigate('/user');

        } catch (err) {
            setError('Login failed. Please check your credentials and try again.');
        }
    };

    return (
        <div>
            <div className="section">
                <div className="auth-container">
                    <div className="auth-card">
                        <h1>Welcome Back</h1>
                        <p>Sign in to continue to PantryTracker</p>
                        
                        <form onSubmit={handleSubmit}>
                            <div className="input-field">
                                <label htmlFor="email">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    placeholder="Enter your email"
                                    value={form.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            
                            <div className="input-field">
                                <label htmlFor="password">Password</label>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    placeholder="Enter your password"
                                    value={form.password}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            
                            <div className="remember-forgot">
                                <div className="remember-me">
                                    <input
                                        type="checkbox"
                                        id="rememberMe"
                                        name="rememberMe"
                                        checked={form.rememberMe}
                                        onChange={handleChange}
                                    />
                                    <label htmlFor="rememberMe">Remember me</label>
                                </div>
                                <Link to="/forgot-password" className="forgot-link">Forgot password?</Link>
                            </div>
                            
                            {error && <p style={{ color: 'red' }}>{error}</p>}
                            <button type="submit" className="auth-button">Sign In</button>
                        </form>
                        
                        <div className="auth-footer">
                            <p>Don't have an account? <Link to="/signup">Sign up</Link></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
