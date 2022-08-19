import dbConnect from '../../../utils/mongo'
import User from '../../../models/User'

export async function getUsers() {

    await dbConnect()

    try {
        const users = await User.find()
        return users
    } catch (error) {
        return error
    }
}

export default async function handler(req, res) {
    const { method } = req

    await dbConnect()

    if (method === 'GET') {
        try {
            const users = await User.find()
            res.status(200).json(users)
        } catch (error) {
            res.status(500).json(error)
        }
    }
}