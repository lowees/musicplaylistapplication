import express from 'express';
import 'dotenv/config';

import users from './api/routes/users.js';
import playlists from './api/routes/playlists.js';
import tracks from './api/routes/tracks.js';

const PORT = 8888;

const app = express();

// parse incoming json requests
app.use(express.json());

// mount route handlers

app.use('/users', users);
app.use('/playlists', playlists);
 app.use('/tracks', tracks);

// start server
app.listen(PORT, () => {
    console.log(`server is running on localhost:${PORT}`);
});