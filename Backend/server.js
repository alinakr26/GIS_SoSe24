const http = require('http');
const url = require('url');
const { v4: uuidv4 } = require('uuid');
const sqlite3 = require('sqlite3').verbose();
const sqlite = require('sqlite');

const hostname = '127.0.0.1'; // localhost
const port = 4000;

let db;

// Initialisiere die Datenbank
async function initDb() {
  db = await sqlite.open({
    filename: 'myDatabase.db',
    driver: sqlite3.Database,
  });
  await db.run('CREATE TABLE IF NOT EXISTS items (id TEXT PRIMARY KEY, name TEXT, amount INT, date TEXT, level TEXT)');
}

const server = http.createServer(async (request, response) => {
  const parsedUrl = url.parse(request.url, true);
  const method = request.method;
  const path = parsedUrl.pathname;

  // CORS-Einstellungen
  response.setHeader('Access-Control-Allow-Origin', '*'); 
  response.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (method === 'OPTIONS') {
    response.writeHead(204);
    response.end();
    return;
  }

  if (method === 'POST' && path === '/api/items') {
    let jsonString = '';
    request.on('data', (data) => {
      jsonString += data;
    });
    request.on('end', async () => {
      const newItem = JSON.parse(jsonString);
      newItem.id = uuidv4(); // Assign a unique ID to the new item
      await db.run('INSERT INTO items (id, name, amount, date, level) VALUES (?, ?, ?, ?, ?)', 
                    [newItem.id, newItem.name, newItem.amount, newItem.date, newItem.level]);
      response.writeHead(201, { 'Content-Type': 'application/json' });
      response.end(JSON.stringify(newItem));
    });
  } else if (method === 'GET' && path === '/api/items') {
    const items = await db.all('SELECT * FROM items');
    response.writeHead(200, { 'Content-Type': 'application/json' });
    response.end(JSON.stringify(items));
  } else if (method === 'PUT' && path.startsWith('/api/items/')) { 
    const id = path.split('/')[3];
    let jsonString = '';
    request.on('data', (data) => {
      jsonString += data;
    });
    request.on('end', async () => {
      const updatedItem = JSON.parse(jsonString);
      const result = await db.run('UPDATE items SET name = ?, amount = ?, date = ?, level = ? WHERE id = ?', 
                                  [updatedItem.name, updatedItem.amount, updatedItem.date, updatedItem.level, id]);
      if (result.changes !== 0) {
        const updatedItemFromDb = await db.get('SELECT * FROM items WHERE id = ?', [id]);
        response.writeHead(200, { 'Content-Type': 'application/json' });
        response.end(JSON.stringify(updatedItemFromDb));
      } else {
        response.writeHead(404, { 'Content-Type': 'application/json' });
        response.end(JSON.stringify({ message: 'Item not found' }));
      }
    });
  } else if (method === 'DELETE' && path.startsWith('/api/items/')) {
    const id = path.split('/')[3];
    const result = await db.run('DELETE FROM items WHERE id = ?', [id]);
    if (result.changes !== 0) {
      response.writeHead(200, { 'Content-Type': 'application/json' });
      response.end(JSON.stringify({ message: 'Item deleted' }));
    } else {
      response.writeHead(404, { 'Content-Type': 'application/json' });
      response.end(JSON.stringify({ message: 'Item not found' }));
    }
  } else {
    response.writeHead(404, { 'Content-Type': 'application/json' });
    response.end(JSON.stringify({ message: 'Route not found' }));
  }
});

initDb().then(() => {
  server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
  });
}).catch((error) => {
  console.error('Failed to initialize the database:', error);
});
