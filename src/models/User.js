import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, minlength: 2, maxlength: 20 },
        surname: { type: String, required: true, minlength: 2, maxlength: 20 },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        isAdmin: { type: Boolean, default: false },
        phone: { type: String, required: true, unique: true },
        image: { type: String },
        homeId: { type: String }
    },
    { timestamps: true }
)

export default mongoose.models.User || mongoose.model('User', UserSchema)