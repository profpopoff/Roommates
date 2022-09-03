import dbConnect from '../../../utils/mongo'
import Chat from '../../../models/Chat'

export async function getChats() {

   await dbConnect()

   try {
      const chats = await Chat.find()
      return chats
   } catch (error) {
      return error
   }
}

export default async function handler(req, res) {
   const { method } = req

   await dbConnect()

   if (method === 'GET') {
      try {
         const chats = await Chat.find()
         res.status(200).json(chats)
      } catch (error) {
         res.status(500).json(error)
      }
   }

   if (method === 'POST') {

      const newChat = new Chat({
         members: [req.body.senderId, req.body.receiverId]
      })

      try {
         const savedChat = await newChat.save()
         res.status(200).json(savedChat)
      } catch (error) {
         res.status(500).json(error)
      }
   }
}