import { Server, Socket } from "socket.io"

export default function SocketHandler(req, res) {
   // It means that socket server was already initialised
   if (res.socket.server.io) {
      console.log("Already set up")
      res.end()
      return
   }

   const io = new Server(res.socket.server)
   res.socket.server.io = io

   // const onConnection = (socket) => {
      // const createdMessage = (msg) => {
      //    socket.broadcast.emit("newIncomingMessage", msg)
      // }

      // socket.on("createdMessage", createdMessage)
   // console.log("onConnection")

   // }

   // // Define actions inside
   // io.on("connection", onConnection)

   // console.log("Setting up socket")

   io.on('connection', (socket) => {
      console.log('connected to socket.io')

      socket.on('setup', (userId) => {
         socket.join(userId)
         console.log(userId)
         socket.emit('connected')
      })

      socket.on('join chat', (room) => {
         socket.join(room)
         console.log('user joined room: ' + room)
      })

      // socket.on('new message', (newMessageRecieved) => {
      //    if (!newMessageRecieved.members) return console.log('chat.users not defined')
      //    newMessageRecieved.members.forEach(user => {
      //       if (user !== newMessageRecieved.sender) {
      //          socket.in(user).emit('message recieved', newMessageRecieved)
      //       }
      //       else { return }

      //    })
      // })
   })
   res.end()
}