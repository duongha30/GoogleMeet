const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    },
})
const cors = require('cors')
const path = require('path')

app.use(cors())

// In production, serve the built React app
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/dist')))
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../client/dist/index.html'))
    })
}

io.on('connection', (socket) => {
    socket.on('JOIN_ROOM', (roomId, userId) => {
        socket.join(roomId)
        socket.room = roomId

        socket.to(roomId).emit('USER_CONNECTED', userId)

        socket.on('disconnect', () => {
            socket.to(roomId).emit('USER_DISCONNECT', userId)
        })
    })

    socket.on('SEND_TEXT', (id, text) => {
        io.sockets.in(socket.room).emit('SHOW_TEXT', id, text)
    })
})

const PORT = process.env.PORT || 3000
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
