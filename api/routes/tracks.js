import express from 'express';
import axios from 'axios';

const router = express.Router();

const LASTFM_API_KEY = process.env.API_KEY;
const LASTFM_BASE_URL = 'http://ws.audioscrobbler.com/2.0';

// helper function to check if a track has a (mbid)
const _hasMbid = (track) => {
    return track.mbid && track.mbid !== '';
}

router.get('/search', async (req, res) => {
    let { track, fuzzy = 'false' } = req.query;

    if(fuzzy === 'true'){
        track += '+*';
    }

    try {
        const params = {
            method: 'track.search',
            track: track,
            api_key: LASTFM_API_KEY, 
            format: 'json',    
        };
        console.log(params);

        const { data } = await axios.get(`${LASTFM_BASE_URL}`, { params });

        const minimal = data.results.trackmatches.track.map((track) => {
            return {
                mbid: track.mbid,
                name: track.name,
                artist: track.artist,
            };
        });

        const filtered = minimal.filter(_hasMbid);

        res.json(filtered);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Failed to search tracks via LASTFM API' });
    }
});

router.get('/:mbid', async (req, res) => {
    const { mbid } = req.params;

    try {
        const params = { 
            method: 'track.getInfo',
            api_key: LASTFM_API_KEY, 
            mbid : mbid.trim(),
            format: 'json' 
        };
        const { data } = await axios.get(`${LASTFM_BASE_URL}`, { params });
        const track_data = data.track;

        const minimal = {
            mbid: track_data.mbid,
            name: track_data.name,
            artist: track_data.artist.name,
            // In case the track is a single and has no album, although I noticed
            // if it is a single, lastFM labels the album as track title.
            album: track_data.album ? track_data.album.title : 'Single',
        };
        res.json(minimal);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Failed to get track by mbid via LASTFM API' });
    }
});

export default router;