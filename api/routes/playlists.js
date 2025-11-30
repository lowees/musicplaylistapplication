import express from 'express';

import Playlist from '../models/Playlist.js';   
import { verifyUser } from '../middleware/authorization.js';

const router = express.Router();

router.use(verifyUser);

router.post('/', async (req, res) => {
    try {

        const {title } = req.body;
        if(!title) {
            return res.status(400).json({ error: 'Playlist title is required' });
        }

        const newPlaylist =  await Playlist.create({ user: req.user._id, title, tracks: [] });
        res.status(201).json(newPlaylist);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Failed to create playlist' });
    }
});

router.put('/:id', async (req, res) => { 
    try {
        const { id } = req.params;
        const playlist = await Playlist.findById(id);
        if (!playlist) {
            return res.status(404).json({ error: 'Playlist not found' });
        }
        
        const { track, artist, album, mbid, image} = req.body;
        if (!track || !artist || !album || !mbid) {
            return res.status(400).json({ error: 'Track, artist, album, and mbid are required to add a track' });
        }
        const addedTrack = playlist.tracks.push({track, artist, album, mbid, image});
        await playlist.save();
        res.json(playlist);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Failed to add track to playlist' });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const user = req.user;
        const { id } = req.params;
        const playlist = await Playlist.findById(id);
        if (!playlist) {
            return res.status(404).json({ error: 'Playlist not found' });
        }
        
        await playlist.deleteOne();
        res.json({ message: 'Playlist deleted successfully' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Failed to delete playlist' });
    }
});


export default router;