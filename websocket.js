const WebSocket = require('ws')
const http = require('http')
const server = http.createServer()
const wss = new WebSocket.Server({ server })

let users = []
let id = 0

wss.on('connection', (ws) => {
  console.log('Player connected')

  users.push({user: ws, room: undefined, id})
  id++

  // Handle messages from players
  ws.on('message', (message) => {
    // handle object conversion
    const jsonString = message.toString('utf8')
    const receivedObject = JSON.parse(jsonString)

    if(receivedObject.roomEntered) {
        const index = users.findIndex(el => el.user == ws)
        users[index].room = receivedObject.room
    } else {
      users.forEach(client => {
        if (client.user !== ws && client.room == receivedObject.room) {
          client.user.send(JSON.stringify(receivedObject))
        }
      });
      console.log(`Received message: ${JSON.stringify(receivedObject)}`)
    }
  })

  ws.on('close', () => {
    users = users.filter(el => el.user !== ws)
    console.log('Player disconnected')
  })
})

// Start the server
server.listen(3001, () => {
  console.log('Server listening on http://localhost:3001')
})
