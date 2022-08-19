import dbConnect from '../../../utils/mongo'
import User from '../../../models/User'

export async function getUser(id) {

    await dbConnect()

    try {
        const user = await User.findById(id)
        const { password, ...otherInfo } = user._doc
        return otherInfo
    } catch (error) {
        return error
    }
}

export default async function handler(req, res) {

    const { method, query: { id }, cookies } = req
    const token = cookies.token

    await dbConnect()

    if (method === 'GET') {
        try {
            const user = await User.findById(id)
            const { password, ...otherInfo } = user._doc
            res.status(200).json(otherInfo)
        } catch (error) {
            res.status(500).json(error)
        }
    }

    if (method === 'PUT') {

        if (!token) {
            return res.status(401).json("Not authenticated!")
        }

        try {
            const user = await User.findByIdAndUpdate(id, req.body, { new: true, })
            res.status(200).json(user)
        } catch (error) {
            res.status(500).json(error)
        }
    }

    if (method === 'DELETE') {

        if (!token) {
            return res.status(401).json("Not authenticated!")
        }

        try {
            await User.findByIdAndDelete(id)
            res.status(200).json('User deleted successfully')
        } catch (error) {
            res.status(500).json(error)
        }
    }
}