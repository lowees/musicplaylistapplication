import express from 'express';

import { User, Playlist } from '../../db/mock_db.js';    

const router = express.Router();

/** helper function to remove the password from a user object
 * @param {object} user - the user object.
 * @returns {object} the user object without the password
 */
const _sanitize = (user) => {
    const { password, ...rest } = user;
    return rest;
};

/**
 * helper function for authenticating user requests
 * @param {object} req - the express request object
 * @param {object} res - the express response object
 * @returns {object} 403 - forbidden if authorization fails
 */
function authenticate(req, res) {
    const authorization  = req.get("Authorization");
    if (!authorization) {
        return res.status(403).json({ error: 'Authentication header not present.' });
    }

    const user = User.find('_id', parseInt(authorization));
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }
    return _sanitize(user);
}
/**
 * @route GET /playlists
 * @description Get all playlists for the authenticated user
 */
router.get('/', (req, res) => {
    try {
        const user = authenticate(req, res);
        if (!user) return;

        const populated = Playlist.populate(user._id);
        res.json(populated);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Failed to retrieve user playlists' });
    }
 });

 router.post('/', (req, res) => {
    try {
        const user = authenticate(req, res);
        if (!user) return;

        const title = req.body.title;
        if(!title) {
            return res.status(400).json({ error: 'Playlist title is required' });
        }

        const newPlaylist = Playlist.insert({ user_id: user._id, title, tracks: [] });
        res.status(201).json(newPlaylist);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Failed to create playlist' });
    }
});

router.put('/:id', (req, res) => { 
    try {
        const user = authenticate(req, res);
        if (!user) return;

        const { id } = req.params;
        const playlist = Playlist.find('_id', parseInt(id, 10));
        if (!playlist) {
            return res.status(404).json({ error: 'Playlist not found' });
        }
        
        const { track, artist, album, mbid} = req.body;
        if (!track || !artist || !album || !mbid) {
            return res.status(400).json({ error: 'Track, artist, album, and mbid are required to add a track' });
        }
        const addedTrack = Playlist.addToSet(playlist._id, { track, artist, album, mbid });
        res.json(addedTrack);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Failed to add track to playlist' });
    }
});
export default router;