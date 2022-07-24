import dbConnect from '../../../utils/mongo'
import User from '../../../models/User'
import CryptoJS from 'crypto-js'
import jwt from 'jsonwebtoken'

export default async function handler(req, res) {
    const { method } = req

    dbConnect()

    if (method === 'POST') {
        try {
            const user = await User.findOne({ email: req.body.email })
            if (!user) return res.status(401).json('Wrong credentials')

            const decryptedPassword = CryptoJS.AES.decrypt(user.password, process.env.SECRET_PASS).toString(CryptoJS.enc.Utf8)
            if (decryptedPassword !== req.body.password) return res.status(401).json('Wrong password')

            const token = jwt.sign(
                {
                    id: user._id,
                    isAdmin: user.isAdmin
                },
                process.env.SECRET_JWT,
                { expiresIn: '3d' }
            )

            const { password, ...otherInfo } = user._doc
            res.status(200).json({ token, ...otherInfo })
        } catch (error) {
            res.status(500).json(error)
        }
    }
}