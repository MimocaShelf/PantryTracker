import React, {useState} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signup } from './server/sql/authService.js';

function Signup() {
    return (
        <div>
            <div className="section">
                <div className="auth-container">
                    <div className="auth-card">
                        <h1>Create Account</h1>
                        <p>Sign up to start tracking your pantry</p>
                        
                        <form>
                            <div className="input-field">
                                <label htmlFor="name">Full Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    placeholder="Enter your full name"
                                />
                            </div>
                            
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
                                    placeholder="Create a password"
                                />
                            </div>
                            
                            <div className="input-field">
                                <label htmlFor="confirmPassword">Confirm Password</label>
                                <input
                                    type="password"
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    placeholder="Confirm your password"
                                />
                            </div>
                            
                            <div className="terms-checkbox">
                                <input
                                    type="checkbox"
                                    id="agreeToTerms"
                                    name="agreeToTerms"
                                />
                                <label htmlFor="agreeToTerms">
                                    I agree to the <Link to="/terms">Terms of Service</Link> and <Link to="/privacy">Privacy Policy</Link>
                                </label>
                            </div>
                            
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
