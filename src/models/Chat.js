import mongoose from 'mongoose'

const ChatSchema = new mongoose.Schema(
   {
      members: { type: Array },
      messages: [{
         text: { type: String },
         createdAt: { type: Date, default: Date.now },
         sender: { stype: String }
      }]
   },
   { timestamps: true }
)

export default mongoose.models.Chat || mongoose.model('Chat', ChatSchema)