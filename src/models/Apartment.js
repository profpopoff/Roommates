import mongoose from 'mongoose'

const ApartmentSchema = new mongoose.Schema(
    {
        title: { type: String, required: true, unique: true },
        type: { type: String, default: "flat" },
        desc: { type: String, required: true },
        landlordId: { type: String, required: true },
        address: {
            city: { type: String, required: true },
            street: { type: String, required: true },
            house: { type: String, required: true },
            apartment: { type: Number, required: true },
        },
        coordinates: { type: [Number], required: true },
        price: {
            value: { type: Number, required: true },
            currency: { type: String, default: "RUB" },
            frequency: { type: String, default: "month" },
        },
        images: { type: [String] },
        conveniences: { type: [String] },
        stats: {
            floor: { type: Number, required: true },
            area: { type: Number, required: true },
            rooms: { type: Number, required: true },
        },
        roommates: [{ type: String }],
        reviews: [
            {
                userId: { type: String },
                rating: { type: Number },
                review: { type: String },
            }
        ],
        isVisible: { type: Boolean, default: true },
    },
    { timestamps: true }
)

export default mongoose.models.Apartment || mongoose.model('Apartment', ApartmentSchema)