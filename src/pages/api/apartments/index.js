import dbConnect from '../../../utils/mongo'
import Apartment from '../../../models/Apartment'

export async function getApartments() {

    await dbConnect()

    try {
        const apartments = await Apartment.find()
        return apartments
    } catch (error) {
        return error
    }
}

export default async function handler(req, res) {
    const { method } = req

    await dbConnect()

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
            const address = `${req.body.address.city}, ${req.body.address.street}, ${req.body.address.house}`
            let coordinates = {}
            await fetch(`http://api.positionstack.com/v1/forward?access_key=${process.env.GEOCODER_TOKEN}&query=${address}`)
                .then(response => response.json())
                .then(data => {
                    coordinates.latitude = data.data[0].latitude
                    coordinates.longitude = data.data[0].longitude
                })
            const apartment = await Apartment.create({ ...req.body, coordinates: {...coordinates} })
            res.status(200).json(apartment)
        } catch (error) {
            res.status(500).json(error)
        }
    }
}