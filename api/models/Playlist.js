import mongoose from 'mongoose';

const trackSchema = new mongoose.Schema(
    {
        mbid: {
            type: String,
            required: true,
        },
        track: {
            type: String,
            required: true,
        },
        artist: {
            type: String,
            required: true,
        },
        album: {
            type: String
        },
        image: {
            type: String
        }
    },
    { _id: false } 
);

const playlistSchema = new mongoose.Schema({
    title : {
        type: String,
        required: true,
        trim: true,
    },
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    tracks: {
        type: [trackSchema],
        default: [],
    }},
);

export default mongoose.model('Playlist', playlistSchema);
