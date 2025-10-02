import React, {useState} from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Signup() {
    const [form, setForm] = useState({ 
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        agreeToTerms: false,
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const path = "http://localhost:3001"

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm(prevForm => ({
            ...prevForm,
            [name]: type === 'checkbox'? checked : value,
        }));
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if(!form.agreeToTerms) {
            setError('You must agree to the terms and privacy policy.');
            return;
        }

        if(form.password !== form.confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        try {
            const res = await fetch(path + '/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: form.name,
                    email: form.email,
                    password: form.password,
                }),
            });
            if (!res.ok) {
                const data = await res.json();
                setError(data.error || 'Signup failed.');
                return;
            }
            navigate('/login');
        } catch (err) {
            setError('Network error. Please try again.');
        }
    };
    
    return (
        <div>
            <div className="section">
                <div className="auth-container">
                    <div className="auth-card">
                        <h1>Create Account</h1>
                        <p>Sign up to start tracking your pantry</p>
                        
                        <form onSubmit={handleSubmit}>
                            <div className="input-field">
                                <label htmlFor="name">Full Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    placeholder="Enter your full name"
                                    value={form.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            
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
                                    placeholder="Create a password"
                                    value={form.password}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            
                            <div className="input-field">
                                <label htmlFor="confirmPassword">Confirm Password</label>
                                <input
                                    type="password"
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    placeholder="Confirm your password"
                                    value={form.confirmPassword}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            
                            <div className="terms-checkbox">
                                <input
                                    type="checkbox"
                                    id="agreeToTerms"
                                    name="agreeToTerms"
                                    checked={form.agreeToTerms}
                                    onChange={handleChange}
                                />
                                <label htmlFor="agreeToTerms">
                                    I agree to the <Link to="/terms">Terms of Service</Link> and <Link to="/privacy">Privacy Policy</Link>
                                </label>
                            </div>
                            {error && <p style={{ color: 'red' }}>{error}</p>}
                            <button type="submit" className="auth-button">Create Account</button>
                        </form>
                        
                        <div className="auth-footer">
                            <p>Already have an account? <Link to="/login">Sign in</Link></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Signup;
