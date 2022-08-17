import dbConnect from '../../../utils/mongo'
import Apartment from '../../../models/Apartment'

export default async function handler(req, res) {
    const { method } = req

    dbConnect()

    if (method === 'GET') {
        try {
            const apartments = await Apartment.find()
            res.status(200).json(apartments)
        } catch (error) {
            res.status(500).json(error)
        }
    }

    if (method === 'POST') {
        try {
            const apartment = await Apartment.create(req.body)
            res.status(200).json(apartment)
        } catch (error) {
            res.status(500).json(error)
        }
    }
}