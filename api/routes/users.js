import express from 'express';

import { User } from '../../db/mock_db.js';

const router = express.Router();

/**
 * helper function to remove the password from a user object
 * @param {object} user - the user object.
 * @returns {object} the user object without the password
 */
const _sanitize = (user) => {
    const { password, ...rest } = user;
    return rest;
};

router.post('/register', async (req, res) => {
    try {
        // const registrationDate = new Date().toDateString;
        const { username, password, registrationDate = new Date().toDateString } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password required to register.' });
        }

        const existing = User.find('username', username.toLowerCase());
        if (existing) {
            return res.status(400).json({ error: 'Username already exists' });
        }
        const registeredUser = User.add({ username: username.toLowerCase(), password, registrationDate });
        res.status(201).json(_sanitize(registeredUser));
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Failed to register user' });
    }
});

router.post('/login', async (req, res) => { 
    try {
        const { username, password } = req.body;

        const user = User.find('username', username);
        if (!user || user.password !== password) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }
        res.json(_sanitize(user));
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Failed to login user' });
    }
});

router.get('/:id', async (req, res) => { 
    try {
        const { id } = req.params;
        const authorization = req.headers.authorization;

        
        if (!authorization || authorization !== id) {
            return res.status(403).json({ error: 'Unauthorized access' });
        }

        const user = User.find('_id', parseInt(id, 10));
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(_sanitize(user));
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Failed to retrieve user' });
    }
});
export default router;