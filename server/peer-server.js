const { PeerServer } = require('peer')

const peerServer = PeerServer({ port: 3001, path: '/' })

peerServer.on('connection', (client) => {
    console.log('Peer connected:', client.getId())
})

peerServer.on('disconnect', (client) => {
    console.log('Peer disconnected:', client.getId())
})
