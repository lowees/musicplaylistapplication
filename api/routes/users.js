import express from 'express';

import User from '../models/User.js';
import { verifyUser } from '../middleware/authorization.js';
import { hash, compare, signToken } from '../util/auth.js';

const router = express.Router();

/**
 * helper function to remove the password from a user object
 * @param {object} user - the user object.
 * @returns {object} the user object without the password
 */
const _sanitize = (user) => {
    const userObj = user.toObject ? user.toObject() : user;
    const { password, ...rest } = userObj;
    return rest;
};

router.post('/register', async (req, res) => {
    try {
        const { username, password} = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password required to register.' });
        }

        const existing = await User.findOne({username: username.toLowerCase()});
        if (existing) {
            return res.status(400).json({ error: 'Username already exists' });
        }

        const hashed = await hash(password);

        const registeredUser = await User.create({ username: username.toLowerCase(), password: hashed });
        res.status(201).json(_sanitize(registeredUser));
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Failed to register user' });
    }
});

router.post('/login', async (req, res) => { 
    try {
        const { username, password } = req.body;

        const user = await User.findOne({ username: username.toLowerCase() });
        const isValid = user && (await compare(password, user.password));

        if (!isValid) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }
        const token = signToken({ username: user.username, _id: user._id });
        res.json({access_token: token, token_type: "Bearer", user: _sanitize(user)});
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Failed to login user' });
    }
});

router.get('/:id', verifyUser, async (req, res) => { 
    try {
        const { id } = req.params;
     
        if(req.user._id.toString() !== id){
            return res.status(403).json({ error: 'Forbidden: access is denied' });
        }

        res.json(_sanitize(req.user));
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Failed to retrieve user' });
    }
});

router.get('/:id/playlists', verifyUser, async (req, res) => {
    try {
        const { id } = req.params;
        if(req.user._id.toString() !== id){
            return res.status(403).json({ error: 'Forbidden: access is denied' });
        }

        const populatedUser = await User.findById(id).populate({path: 'playlists'});
        res.json(_sanitize(populatedUser));
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Failed to retrieve user playlists' });
    }
});
export default router;