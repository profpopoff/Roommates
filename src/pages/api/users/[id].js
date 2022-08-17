import dbConnect from '../../../utils/mongo'
import User from '../../../models/User'

export default async function handler(req, res) {
    const { method, query: { id } } = req

    dbConnect()

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
        try {
            const user = await User.findByIdAndUpdate(id, req.body, { new: true, })
            res.status(200).json(user)
        } catch (error) {
            res.status(500).json(error)
        }
    }

    if (method === 'DELETE') {
        try {
            await User.findByIdAndDelete(id)
            res.status(200).json('User deleted successfully')
        } catch (error) {
            res.status(500).json(error)
        }
    }
}