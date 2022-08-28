import mongoose from 'mongoose'

const MessageSchema = new mongoose.Schema(
   {
      conversationId: { type: String },
      sender: { type: String },
      members: { type: Array },
      text: { type: String }
   },
   { timestamps: true }
)

export default mongoose.models.Message || mongoose.model('Message', MessageSchema)