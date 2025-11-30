import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    }, 
    password: {
        type: String,
        required: [true, 'Password is required'],
    },
    registrationDate: {
        type: Date,
        default: Date.now,
        required: false,
    }
});

UserSchema.virtual("playlists", {
    ref: "Playlist",
    localField: "_id",
    foreignField: "user",
});

UserSchema.set('toObject', { virtuals: true });
UserSchema.set('toJSON', { virtuals: true });


const User = mongoose.model('User', UserSchema);
export default User;