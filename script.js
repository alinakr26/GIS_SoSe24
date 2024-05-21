// Funktion zum Laden der vorhandenen Daten beim Seitenaufruf
document.addEventListener("DOMContentLoaded", function () {
  loadItemsFromLocalStorage();
});

// Funktion zum Laden der Daten aus dem localStorage
function loadItemsFromLocalStorage() {
  var items = localStorage.getItem("items");
  if (items) {
      items = JSON.parse(items);
      items.forEach(function (item) {
          addItemToPage(item);
      });
  }
}

// Funktion zum Hinzufügen eines neuen Lebensmittels
function addItem() {
  var newItemName = document.getElementById("newItemName").value.trim();
  if (newItemName === "") {
      alert("Bitte geben Sie den Namen des Lebensmittels ein.");
      return;
  }

  // Erstellen eines neuen Lebensmittelobjekts
  var newItem = {
      name: newItemName,
      count: 0
  };

  // Laden der vorhandenen Daten aus dem localStorage
  var items = localStorage.getItem("items") ? JSON.parse(localStorage.getItem("items")) : [];

  // Hinzufügen des neuen Lebensmittels zur Liste
  items.push(newItem);

  // Speichern der aktualisierten Liste im localStorage
  localStorage.setItem("items", JSON.stringify(items));

  // Füge das neue Lebensmittel der Seite hinzu
  addItemToPage(newItem);

  // Zurücksetzen des Eingabefelds
  document.getElementById("newItemName").value = "";
}

// Funktion zum Hinzufügen eines Lebensmittels zur Seite
function addItemToPage(item) {
  var newItem = document.createElement("div");
  newItem.classList.add("item");
  newItem.innerHTML = `
      <h3>${item.name}</h3>
      <p>Anzahl: <span id="${item.name.replace(/\s/g, '')}Count" class="count">${item.count}</span></p>
      <button onclick="increaseCount('${item.name.replace(/\s/g, '')}')">+</button>
      <button onclick="decreaseCount('${item.name.replace(/\s/g, '')}')">-</button>
      <button class="delete-btn" onclick="deleteItem(this)">Löschen</button>
  `;
  document.querySelector(".container").appendChild(newItem);
}

// Funktion zum Erhöhen der Anzahl des Lebensmittels
function increaseCount(itemName) {
  var countSpan = document.getElementById(`${itemName}Count`);
  var count = parseInt(countSpan.textContent);
  countSpan.textContent = count + 1;

  updateItemInLocalStorage(itemName, count + 1);
  checkCountAndColor(countSpan, count + 1); // Überprüfen der Anzahl und Färben der Container und Schrift
}

// Funktion zum Verringern der Anzahl des Lebensmittels
function decreaseCount(itemName) {
  var countSpan = document.getElementById(`${itemName}Count`);
  var count = parseInt(countSpan.textContent);
  if (count > 0) {
      countSpan.textContent = count - 1;

      updateItemInLocalStorage(itemName, count - 1);
      checkCountAndColor(countSpan, count - 1); // Überprüfen der Anzahl und Färben der Container und Schrift
  }
}

// Funktion zum Aktualisieren der Anzahl eines Lebensmittels im localStorage
function updateItemInLocalStorage(itemName, newCount) {
  var items = JSON.parse(localStorage.getItem("items"));
  var itemIndex = items.findIndex(item => item.name.replace(/\s/g, '') === itemName);
  if (itemIndex !== -1) {
      items[itemIndex].count = newCount;
      localStorage.setItem("items", JSON.stringify(items));
  }
}

// Funktion zum Löschen des Lebensmittels
function deleteItem(deleteBtn) {
  var item = deleteBtn.parentElement;
  var itemName = item.querySelector("h3").textContent;
  item.remove();

  removeItemFromLocalStorage(itemName);
}

// Funktion zum Entfernen eines Lebensmittels aus dem localStorage
function removeItemFromLocalStorage(itemName) {
  var items = JSON.parse(localStorage.getItem("items"));
  var filteredItems = items.filter(item => item.name !== itemName);
  localStorage.setItem("items", JSON.stringify(filteredItems));
}

// Funktion zum Überprüfen der Anzahl und Färben der Container und Schrift
function checkCountAndColor(countSpan, count) {
  if (count <= 1) {
      countSpan.style.color = "red"; // Schrift rot färben
      countSpan.parentElement.parentElement.classList.add("warning"); // Container rot färben
  } else {
      countSpan.style.color = ""; // Standardfarbe für die Schrift wiederherstellen
      countSpan.parentElement.parentElement.classList.remove("warning"); // Container rot färben entfernen
  }
}

