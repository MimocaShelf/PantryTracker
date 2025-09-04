import React from 'react';
import { Link } from 'react-router-dom';

function Login() {
    return (
        <div>
            <div className="section">
                <div className="auth-container">
                    <div className="auth-card">
                        <h1>Welcome Back</h1>
                        <p>Sign in to continue to PantryTracker</p>
                        
                        <form>
                            <div className="input-field">
                                <label htmlFor="email">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    placeholder="Enter your email"
                                />
                            </div>
                            
                            <div className="input-field">
                                <label htmlFor="password">Password</label>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    placeholder="Enter your password"
                                />
                            </div>
                            
                            <div className="remember-forgot">
                                <div className="remember-me">
                                    <input
                                        type="checkbox"
                                        id="rememberMe"
                                        name="rememberMe"
                                    />
                                    <label htmlFor="rememberMe">Remember me</label>
                                </div>
                                <Link to="/forgot-password" className="forgot-link">Forgot password?</Link>
                            </div>
                            
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
