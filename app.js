import express from 'express';
import 'dotenv/config';

import { connect, disconnect } from './db/connection.js';
import users from './api/routes/users.js';
import playlists from './api/routes/playlists.js';
import tracks from './api/routes/tracks.js';
import Playlist from './api/models/Playlist.js';

const PORT = 8888;

const app = express();

// parse incoming json requests
app.use(express.json());

// mount route handlers

app.use('/users', users);
app.use('/playlists', playlists);
app.use('/tracks', tracks);

const start = async () => {
    try {
        await connect();
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1);
    }
};

const shutdown = async () => {
    console.log("Shutting down server...");
    await disconnect();
    process.exit(0);
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

start();