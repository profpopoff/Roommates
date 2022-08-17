import dbConnect from '../../../utils/mongo'
import User from '../../../models/User'
import CryptoJS from 'crypto-js'

export default async function handler(req, res) {
    const { method } = req

    dbConnect()

    if (method === 'POST') {

        const newUser = new User({
            name: req.body.name,
            surname: req.body.surname,
            email: req.body.email,
            password: CryptoJS.AES.encrypt(req.body.password, process.env.SECRET_PASS).toString(),
            phone: req.body.phone,
            image: req.body.image
        })

        try {
            const savedUser = await newUser.save()
            res.status(200).json(savedUser)
        } catch (error) {
            res.status(500).json(error)
        }
    }
}