const express = require('express');
const http = require('http');
const url = require('url');
const { v4: uuidv4 } = require('uuid');
const sqlite3 = require('sqlite3').verbose();
const sqlite = require('sqlite');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express ();
const hostname = '127.0.0.1'; // localhost
const port = 3000;

app.use(cors());
app.use(bodyParser.json()); 
app.use(express.static(path.join(__dirname, '..', 'Frontend')));

const dbFile = path.join(__dirname, 'new.db')
const dbExists = fs.existsSync(dbFile);
console.log('Database file ${dbFile} exists: ${dbExists}');


let db;

// Initialisiere die Datenbank
async function initDb() {
  db = await sqlite.open({
    filename: 'new.db',
    driver: sqlite3.Database,
  });
  await db.run('CREATE TABLE IF NOT EXISTS items (id TEXT PRIMARY KEY, name TEXT, amount INT, date TEXT, level TEXT)');
}

// Validierungsfunktion
function validateItem(item) {
  return item && typeof item.id === 'string' &&
         typeof item.name === 'string' &&
         typeof item.amount === 'number' &&
         typeof item.date === 'string' &&
         typeof item.level === 'string';
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
    response.end();
    return;
  }

  try {
    if (method === 'POST' && path === '/items') { //Fügt ein neues Lebensmittelobjekt in die Datenbank ein.
      let jsonString = ''; 
      request.on('data', (data) => {
        jsonString += data;
      });
      request.on('end', async () => {
        const newItem = JSON.parse(jsonString);
        newItem.id = uuidv4(); // Assign a unique ID to the new item
        newItem.amount = 0; // Ensure amount is a number

        if (validateItem(newItem)) {
          await db.run('INSERT INTO items (id, name, amount, date, level) VALUES (?, ?, ?, ?, ?)', 
                        [newItem.id, newItem.name, newItem.amount, newItem.date, newItem.level]);
          response.writeHead(201, { 'Content-Type': 'application/json' });
          response.end(JSON.stringify(newItem));
        } else {
          response.writeHead(400, { 'Content-Type': 'application/json' });
          response.end(JSON.stringify({ message: 'Ungültige Eingabedaten' }));
        }
      });
    } else if (method === 'GET' && path === '/items') { //Ruft alle Lebensmittelobjekte aus der Datenbank ab und filtert ungültige Objekte heraus,
      const items = await db.all('SELECT * FROM items');
      console.log("Server sends items: ", items); // Hinzugefügtes Protokoll
      const validItems = items.filter(validateItem);
      response.writeHead(200, { 'Content-Type': 'application/json' });
      response.end(JSON.stringify(validItems));
    } else if (method === 'PUT' && path.startsWith('/items')) { //Aktualisiert ein Lebensmittelobjekt anhand der ID in der Datenbank
      const id = path.split('/')[2];
      let jsonString = '';
      request.on('data', (data) => {
        jsonString += data;
      });
      request.on('end', async () => {
        const updatedItem = JSON.parse(jsonString);
        const result = await db.run('UPDATE items SET amount = ? WHERE id = ?', 
                                    [updatedItem.amount, id]);
        if (result.changes !== 0) {
          const updatedItemFromDb = await db.get('SELECT * FROM items WHERE id = ?', [id]);
          if (validateItem(updatedItemFromDb)) {
            response.writeHead(200, { 'Content-Type': 'application/json' });
            response.end(JSON.stringify(updatedItemFromDb));
          } else {
            response.writeHead(500, { 'Content-Type': 'application/json' });
            response.end(JSON.stringify({ message: 'Ungültige Daten im Backend' }));
          }
        } else {
          response.writeHead(404, { 'Content-Type': 'application/json' });
          response.end(JSON.stringify({ message: 'Item not found' }));
        }
      });
    } else if (method === 'DELETE' && path.startsWith('/items')) { //Löscht ein Lebensmittelobjekt aus der Datenbank anhand der ID
      const id = path.split('/')[2];
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
  } catch (error) {
    response.writeHead(500, { 'Content-Type': 'application/json' });
    response.end(JSON.stringify({ message: 'Internal Server Error', error: error.message }));
  }
});

initDb().then(() => {
  app.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
  });
}).catch((error) => {
  console.error('Failed to initialize the database:', error);
});
