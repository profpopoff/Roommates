import dbConnect from '../../../utils/mongo'
import User from '../../../models/User'
import CryptoJS from 'crypto-js'
import jwt from 'jsonwebtoken'
import cookie from 'cookie'

export default async function handler(req, res) {
    const { method } = req

    await dbConnect()

    if (method === 'POST') {
        try {
            const user = await User.findOne({ email: req.body.email })
            if (!user) return res.status(401).json({ message: 'Invalid credentials!' })

            const decryptedPassword = CryptoJS.AES.decrypt(user.password, process.env.SECRET_PASS).toString(CryptoJS.enc.Utf8)
            if (decryptedPassword !== req.body.password) return res.status(401).json({ message: 'Invalid credentials!' })

            const token = jwt.sign(
                {
                    id: user._id,
                    isAdmin: user.isAdmin
                },
                process.env.SECRET_JWT,
                { expiresIn: '30d' }
            )

            res.setHeader(
                "Set-Cookie",
                cookie.serialize("token", token, {
                    sameSite: "strict",
                    maxAge: 60 * 60 * 24 * 30,
                    path: "/",
                })
            )

            const { password, ...otherInfo } = user._doc
            res.status(200).json({ token, ...otherInfo })
        } catch (error) {
            res.status(500).json(error)
        }
    }
}