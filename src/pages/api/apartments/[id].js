import dbConnect from '../../../utils/mongo'
import Apartment from '../../../models/Apartment'
import User from '../../../models/User'

export async function getApartment(id) {

    await dbConnect()

    try {
        const apartment = await Apartment.findById(id)
        return apartment
    } catch (error) {
        return error
    }
}

export default async function handler(req, res) {
    const { method, query: { id } } = req

    dbConnect()

    if (method === 'GET') {
        try {
            const apartment = await Apartment.findById(id)
            res.status(200).json(apartment)
        } catch (error) {
            res.status(500).json(error)
        }
    }

    if (method === 'PUT') {
        try {
            const apartment = await Apartment.findByIdAndUpdate(id, req.body, { new: true, })
            res.status(200).json(apartment)
        } catch (error) {
            res.status(500).json(error)
        }
    }

    if (method === 'DELETE') {
        try {
            const apartment = await Apartment.findById(id)
            const user = await User.findById(apartment.landlordId)
            await User.findByIdAndUpdate(apartment.landlordId, {property: user.property.filter(item => item !== id)}, { new: true, })
            await Apartment.findByIdAndDelete(id)
            res.status(200).json('Deleted successfully')
        } catch (error) {
            res.status(500).json(error)
        }
    }
}