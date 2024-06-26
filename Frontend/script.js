document.addEventListener("DOMContentLoaded", function () {
  loadItemsFromServer();
});


function isValidItem(item) {
  return item && typeof item.id === 'string' &&
         typeof item.name === 'string' &&
         typeof item.amount === 'number' &&
         typeof item.date === 'string' &&
         typeof item.level === 'string';
         (consol.log("funktion isValidItem"))
}

// hier werden die daten vom Server geladen
async function loadItemsFromServer() {
  try {
    const response = await fetch("http://127.0.0.1:3000/items");//
    if (!response.ok) {
      throw new Error(`Serverantwort nicht OK: ${response.status} ${response.statusText}`);// hier gibts die Fehlermeldung 
    }
    const items = await response.json();
    items.forEach(item => {
      if (isValidItem(item)) {
        addItemToPage(item);
      } else {
        console.error(`Ungültiges Element erhalten: ${JSON.stringify(item)}`); 
      }
    });
  } catch (error) {
    console.error("Fehler beim Laden der Elemente vom Server:", error); 
  }
}
// Die eigentlichen Routenimplementierungen
try {
  
} catch (error) {
  response.writeHead(500, { 'Content-Type': 'application/json' });
  response.end(JSON.stringify({ message: 'Internal Server Error', error: error.message }));
}

// Hinzufügen der Items
async function addItem() {
  const newItemName = document.getElementById("newItemName").value.trim();
  const newItemDate = document.getElementById("newItemDate").value;
  const level = document.getElementById("levelSelect").value;

  if (!newItemName || !newItemDate) {
    alert("Bitte geben Sie den Namen und das Ablaufdatum des Lebensmittels ein.");
    return;
  }

  const newItem = {
    name: newItemName,
    amount: 0,
    date: newItemDate,
    level: level
  };

  try {
    const response = await fetch("http://127.0.0.1:3000/items", {  //
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newItem)
    });

    if (response.ok) {
      const savedItem = await response.json();
      addItemToPage(savedItem);
      console.log(`Lebensmittel "${savedItem.name}" erfolgreich hinzugefügt`);
    } else {
      console.error(`Fehler beim Hinzufügen des Lebensmittels: ${response.statusText}`); // hier gibts die Fehlermeldung 
    }
  } catch (error) {
    console.error("Fehler beim Hinzufügen des Lebensmittels:", error);
  }

  document.getElementById("newItemName").value = "";
  document.getElementById("newItemDate").value = "";
}

// Item wird zur Seite hinzugefügt
function addItemToPage(item) {
  if (!item || typeof item.id !== 'string' || typeof item.name !== 'string' || typeof item.amount !== 'number' || !item.date || typeof item.level !== 'string') {
    console.error(`Ungültiges Element: ${JSON.stringify(item)}`);
    return;
  }


  const listItem = document.createElement("div");
  listItem.className = "item";
  listItem.textContent = item.name;

  const countWrapper = document.createElement("div");
  countWrapper.className = "count-wrapper";

  const countSpan = document.createElement("span");
  countSpan.className = "count";
  countSpan.textContent = item.amount;
  countWrapper.appendChild(countSpan);

  listItem.appendChild(countWrapper);

  const minusButton = document.createElement("button");
  minusButton.textContent = "-";
  minusButton.addEventListener("click", function () {
    updateItemCount(item, countSpan, -1);
  });
  countWrapper.appendChild(minusButton);

  const plusButton = document.createElement("button");
  plusButton.textContent = "+";
  plusButton.addEventListener("click", function () {
    updateItemCount(item, countSpan, 1);
  });
  countWrapper.appendChild(plusButton);

  listItem.appendChild(countWrapper);

  const dateSpan = document.createElement("span");
  dateSpan.className = "date";
  dateSpan.textContent = formatDate(item.date);
  listItem.appendChild(dateSpan);

  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Löschen";
  deleteButton.addEventListener("click", function () {
    deleteItem(item, listItem);
  });
  listItem.appendChild(deleteButton);

  const levelContainer = document.getElementById(`level${item.level}`);
  if (levelContainer) {
    levelContainer.appendChild(listItem);
  } else {
    console.error(`Container für Ebene ${item.level} nicht gefunden. Element "${item.name}" konnte nicht hinzugefügt werden.`);
  }
  checkCountAndColor(countSpan, item.amount);
}


//Aktualisiert den Zähler eines Items und sendet die neue Anzahl an den Server.
async function updateItemCount(item, countSpan, change) {
  const newCount = Math.max(0, parseInt(countSpan.textContent) + change);
  countSpan.textContent = newCount;
  await updateItemOnServer(item.id, newCount);
  checkCountAndColor(countSpan, newCount);
}


//Löscht ein Item vom Server und entfernt es von der Seite.
async function deleteItem(item, listItem) {
  try {
    const response = await fetch(`http://127.0.0.1:3000/items/${item.id}`, {//
      method: 'DELETE'
    });

    if (response.ok) {
      listItem.remove();
      console.log(`Element ${item.id} erfolgreich vom Server gelöscht`);
    } else {
      throw new Error('Fehler beim Löschen des Elements vom Server');
    }
  } catch (error) {
    console.error(`Fehler beim Löschen des Elements ${item.id} vom Server:`, error);
  }
}

//Aktualisiert die Anzahl eines Items auf dem Server.
async function updateItemOnServer(itemId, newCount) {
  try {
    const response = await fetch(`http://127.0.0.1:3000/items/${itemId}`, { //
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ amount: newCount })
    });

    if (!response.ok) {
      throw new Error('Fehler beim Aktualisieren des Elements auf dem Server');
    }

    console.log(`Element ${itemId} erfolgreich auf dem Server aktualisiert`);
  } catch (error) {
    console.error(`Fehler beim Aktualisieren des Elements ${itemId} auf dem Server:`, error);
  }
}

//Formatiert ein Datum in ein lesbares Format.
function formatDate(dateString) {
  const date = new Date(dateString);
  return `${date.getDate().toString().padStart(2, '0')}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getFullYear()}`;
}
 
// Überprüft Anzahl und Farbe
function checkCountAndColor(countSpan, count) {
  const itemElement = countSpan.closest(".item");
  if (count < 2) {
    itemElement.classList.add("warning");
  } else {
    itemElement.classList.remove("warning");
  }
}