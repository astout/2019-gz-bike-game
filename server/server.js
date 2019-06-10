const express = require('express');
const http = require('http');
const SocketIO = require('socket.io');
const bluetooth = require('./bluetooth');
const { port } = require('./config');

const App = express();
const Router = express.Router;
const Server = http.createServer(App);
const WebSocket = SocketIO(Server);
const BLE = bluetooth(WebSocket);
const RouteConfig = {
  App,
  Router,
  WebSocket,
  BLE,
};

WebSocket.on('connection', (client) => {
  console.log('client connection');
  console.log(client.id);
  client.on('test', (data) => {
    console.log(`WS Client '${client.id}'`, data || '');
  });
  client.on('disconnect', () => console.log('Client disconnected'));
});

App.use(express.urlencoded({ extended: true }));
App.use(express.json());

// Import Routes directory
require('./routes')(RouteConfig);

App.get('/', (req, res) => {
  res.send(`PORT ${port}`);
});

Server.listen(port, (err) => {
  if (err) { console.log(err); };
  console.log(`Listening on port ${port}`);
});
