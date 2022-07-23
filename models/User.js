import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, minlength: 3, maxlength: 60 },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        isAdmin: { type: Boolean, default: false },
        phoneNumber: { type: String, required: true, unique: true },
        profilePicture: { type: String }
    },
    { timestamps: true }
)

export default mongoose.models.User || mongoose.model('User', UserSchema)