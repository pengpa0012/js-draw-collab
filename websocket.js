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
    console.log(message)
    if(message.room) {
        const index = users.findIndex(el => el.id == message.id)
        users[index].room = message.room
        console.log(users)
    } else {

      // handle object conversion
      const jsonString = message.toString('utf8')
      const receivedObject = JSON.parse(jsonString)

      users.forEach(client => {
        if (client !== ws && client.room == message.room) {
          client.send(JSON.stringify(receivedObject))
        }
      });
      console.log(`Received message: ${JSON.stringify(receivedObject)}`)
    }
  })

  ws.on('close', () => {
    console.log('Player disconnected')
  })
})

// Start the server
server.listen(3001, () => {
  console.log('Server listening on http://localhost:3001')
})
