// Utility functions for user validation

// Validate email format
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Validate password strength (min 6 chars, at least one letter and one number)
function isValidPassword(password) {
    return typeof password === 'string' &&
        password.length >= 6 &&
        /[A-Za-z]/.test(password) &&
        /\d/.test(password);
}

export { isValidEmail, isValidPassword };