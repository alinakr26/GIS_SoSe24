const http = require('http');
const url = require('url');
const { v4: uuidv4 } = require('uuid');
const sqlite3 = require('sqlite3');
const sqlite = require('sqlite');



const hostname = '127.0.0.1'; // localhost
const port = 3000;

let items = []; // In-memory database


const server = http.createServer(async (request, response) => {
  const parsedUrl = url.parse(request.url, true);
  const method = request.method;
  const path = parsedUrl.pathname;
  response.setHeader('Access-Control-Allow-Origin', '*'); // on CORS error /
  response.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    const dbFilePath = 'myDatabase.db';
    const db = await sqlite.open({
      filename: dbFilePath,
      driver: sqlite3.Database,
    });
    db.run('CREATE TABLE IF NOT EXISTS items (id INT UNIQUE, name TEXT, amount INT, date TEXT, level TEXT)');

  if (method === 'POST' && path === '/api/items') {
    let jsonString = '';
    request.on('data', (data) => {
      jsonString += data;
    });
    request.on('end', () => {
      const newItem = JSON.parse(jsonString);
      newItem.id = uuidv4(); // Assign a unique ID to the new item
      console.log(newItem)
      items.push(newItem);
      response.writeHead(201, { 'Content-Type': 'application/json' });
      response.end(JSON.stringify(newItem));
    });
  } else if (method === 'GET' && path === '/api/items') {
    response.writeHead(200, { 'Content-Type': 'application/json' });
    response.end(JSON.stringify(items));
  } else if (method === 'PUT' && path.startsWith('/api/items/')) { 
    const id = path.split('/')[3];
    let jsonString = '';
    request.on('data', (data) => {
      jsonString += data;
    });
    request.on('end', () => {
      const updatedItem = JSON.parse(jsonString);
      const index = items.findIndex(item => item.id === id);
      if (index !== -1) {
        items[index] = { ...items[index], ...updatedItem };
        response.writeHead(200, { 'Content-Type': 'application/json' });
        response.end(JSON.stringify(items[index]));
      } else {
        response.writeHead(404, { 'Content-Type': 'application/json' });
        response.end(JSON.stringify({ message: 'Item not found' }));
      }
    });
  } else if (method === 'DELETE' && path.startsWith('/api/items/')) {
    const id = path.split('/')[3];
    let index = items.findIndex(item => item.id === id);
    if (index !== -1) {
      const deletedItem = items.splice(index, 1);
      response.writeHead(200, { 'Content-Type': 'application/json' });
      response.end(JSON.stringify(deletedItem[0]));
    } else {
      response.writeHead(404, { 'Content-Type': 'application/json' });
      response.end(JSON.stringify({ message: 'Item not found' }));
    }
  } else {
    response.writeHead(404, { 'Content-Type': 'application/json' });
    response.end(JSON.stringify({ message: 'Route not found' }));
  }

});
server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
  