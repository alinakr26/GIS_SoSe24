function addItem() {
    var newItemName = document.getElementById("newItemName").value; 
    if (newItemName.trim() === "") {
      alert("Bitte geben Sie den Namen des Lebensmittels ein.");
      return;
    }
    var newItem = document.createElement("div"); // Erstellen eines neuen Div-Elements für das Lebensmittel
    newItem.classList.add("item"); // Hinzufügen der Klasse "item"
    newItem.innerHTML = `
      <h3>${newItemName}</h3>
      <p>Anzahl: <span id="${newItemName.replace(/\s/g, '')}Count" class="count">0</span></p>
      <button onclick="increaseCount('${newItemName.replace(/\s/g, '')}')">+</button>
      <button onclick="decreaseCount('${newItemName.replace(/\s/g, '')}')">-</button>
      <span class="delete-icon" onclick="deleteItem(this)"></span>
    `;
    document.querySelector(".container").appendChild(newItem); // Anhängen des neuen Elements an den Container
    document.getElementById("newItemName").value = ""; // Zurücksetzen des Eingabefelds
  }
  
  // Funktion zum Erhöhen der Anzahl des Lebensmittels
  function increaseCount(itemName) {
    var countSpan = document.getElementById(`${itemName}Count`);
    var count = parseInt(countSpan.textContent);
    countSpan.textContent = count + 1;
    checkCountAndColor(countSpan, count + 1); // Überprüfen der Anzahl und Färben der Container und Schrift
  }
  
  // Funktion zum Verringern der Anzahl des Lebensmittels
  function decreaseCount(itemName) {
    var countSpan = document.getElementById(`${itemName}Count`);
    var count = parseInt(countSpan.textContent);
    if (count > 0) {
      countSpan.textContent = count - 1;
      checkCountAndColor(countSpan, count - 1); // Überprüfen der Anzahl und Färben der Container und Schrift
    }
  }
  
  // Funktion zum Löschen des Lebensmittels
  function deleteItem(event) {
    var item = event.target.parentElement;
    if (item) {
        item.remove();
    }
}

  

  
  // Funktion zum Überprüfen der Anzahl und Färben der Container und Schrift
  function checkCountAndColor(countSpan, count) {
    if (count <= 1) {
      countSpan.parentElement.parentElement.classList.add("warning"); // Container rot färben
    } else {
     
      countSpan.parentElement.parentElement.classList.remove("warning"); // Container rot färben entfernen
    }
  }
// Laden der vorhandenen Daten beim Seitenaufruf
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
      <p>Anzahl: <span class="count">${item.count}</span></p>
      <button onclick="increaseCount('${item.name}')">+</button>
      <button onclick="decreaseCount('${item.name}')">-</button>
      <button onclick="deleteItem('${item.name}')">Löschen</button>
  `;
  document.querySelector(".container").appendChild(newItem);
}

// Weitere Funktionen zum Erhöhen, Verringern und Löschen von Lebensmitteln werden hier eingefügt (wie in Ihrem vorherigen Code)

// Funktion zum Überprüfen der Anzahl und Färben der Container und Schrift
function checkCountAndColor(countSpan, count) {
  if (count <= 1) {
      countSpan.parentElement.parentElement.classList.add("warning"); // Container rot färben
  } else {
      countSpan.parentElement.parentElement.classList.remove("warning"); // Container rot färben entfernen
  }
}
document.addEventListener("DOMContentLoaded", function() {
  // Hier kommt dein JavaScript-Code hin
});
