const WebSocket = require('ws')
const http = require('http')
const server = http.createServer()
const wss = new WebSocket.Server({ server })


wss.on('connection', (ws) => {
  console.log('Player connected')
  
  // Handle messages from players
  ws.on('message', (message) => {
    // handle object conversion
    const jsonString = message.toString('utf8')
    const receivedObject = JSON.parse(jsonString)

    wss.clients.forEach(client => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(receivedObject))
      }
    });
    console.log(`Received message: ${JSON.stringify(receivedObject)}`)
  })

  ws.on('close', () => {
    console.log('Player disconnected')
  })
})

// Start the server
server.listen(3001, () => {
  console.log('Server listening on http://localhost:3001')
})
