

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
  function deleteItem(deleteIcon) {
    var item = deleteIcon.parentElement;
    item.remove();
  }
  
  // Funktion zum Überprüfen der Anzahl und Färben der Container und Schrift
  function checkCountAndColor(countSpan, count) {
    if (count <= 1) {
      countSpan.parentElement.parentElement.classList.add("warning"); // Container rot färben
    } else {
     
      countSpan.parentElement.parentElement.classList.remove("warning"); // Container rot färben entfernen
    }
  }