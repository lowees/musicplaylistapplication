import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const JWT_SECRET = process.env.JWT_SECRET;

/**
 * Hashes a password using bcrypt in a clear, step-by-step process.
 * @param {string} password - The plain-text password.
 * @returns {Promise<string>} A promise that resolves to the hashed password.
 */
const hash = async (password) => {
    // 1. Define the cost factor. The higher the number, the more computationally
    // expensive the hash, and the more resistant to brute-force attacks.
    // 10 is a good, recommended default in 2025.

    // Salt rounds control how many times bcrypt runs its hashing algorithm.
    // Higher rounds = stronger security but slower performance.
    // It’s called “rounds” because bcrypt mixes in random data (the salt)
    // multiple times to make the hash harder to crack.
    const rounds = 10;

    // 2. Generate the salt. This is an asynchronous operation.
    const salt = await bcrypt.genSalt(rounds);

    // 3. Hash the password using the generated salt. This is also async.
    const hashedPassword = await bcrypt.hash(password, salt);

    return hashedPassword;
};

/**
 * Compares a plain-text password against a bcrypt hash.
 * Bcrypt automatically extracts the embedded salt from the hash string for comparison.
 * @param {string} password - The plain-text password to check.
 * @param {string} dbPassword - The hashed password from the database.
 * @returns {Promise<boolean>} A promise that resolves to true if they match, false otherwise.
 */
const compare = async (password, dbPassword) => {
    // We explicitly await the result of the asynchronous comparison.
    return await bcrypt.compare(password, dbPassword);
};

/**
 * Signs a JWT with a given payload.
 * @param {object} payload - The data to include in the token (e.g., { _id, username }).
 * @returns {string} The signed JSON Web Token.
 */
const signToken = (payload) => {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });
};

/**
 * Verifies a JWT.
 * @param {string} token - The token to verify.
 * @returns {object|null} The decoded payload if valid, otherwise null.
 */
const verifyToken = (token) => {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        return null;
    }
};

export { hash, compare, signToken, verifyToken };
