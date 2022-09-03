import dbConnect from '../../../utils/mongo'
import Chat from '../../../models/Chat'

export async function getUserChats(id) {

   await dbConnect()

   try {
      const chats = await Chat.find({
         members: { $in: [id] }
      })
      return chats
   } catch (error) {
      return error
   }
}

export async function getChat(id) {

   await dbConnect()

   try {
      const chat = await Chat.findById(id)
      return chat
   } catch (error) {
      return error
   }
}

export default async function handler(req, res) {
   const { method, query: { id } } = req

   dbConnect()

   // get user chats
   if (method === 'GET') {
      try {
         const chats = await Chat.find({
            members: { $in: [id] }
         })
         res.status(200).json(chats)
      } catch (error) {
         res.status(500).json(error)
      }
   }

   if (method === 'DELETE') {
      try {
         await Chat.findByIdAndDelete(id)
         res.status(200).json('chat has been deleted')
      } catch (error) {
         res.status(500).json(error)
      }
   }

   if (method === 'PUT') {
      try {
         const chat = await Chat.findByIdAndUpdate(id, req.body, { new: true, })
         res.status(200).json(chat)
     } catch (error) {
         res.status(500).json(error)
     }
   }
}