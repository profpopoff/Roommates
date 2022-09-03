import mongoose from 'mongoose'

const ChatSchema = new mongoose.Schema(
   {
      members: { type: Array },
      messages: [{
         text: { type: String },
         sender: { type: String },
         createdAt: { type: Date, default: Date.now }
      }]
   },
   { timestamps: true }
)

export default mongoose.models.Chat || mongoose.model('Chat', ChatSchema)