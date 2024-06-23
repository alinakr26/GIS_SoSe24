document.addEventListener("DOMContentLoaded", function () {
  loadItemsFromServer();
});

async function loadItemsFromServer() {
  try {
    const response = await fetch("http://127.0.0.1:3000/api/items");
    if (!response.ok) {
      throw new Error('Error loading items from server');
    }
    const items = await response.json();
    console.log(items);
    items.forEach(function (item) {
      addItemToPage(item);
    });
  } catch (error) {
    console.error("Error loading items from server:", error);
  }
}

async function saveItemsToServer(item) {
  try {
    const response = await fetch("http://127.0.0.1:3000/api/items", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(item)
    });

    if (!response.ok) {
      throw new Error('Error saving item to server');
    }

    console.log(`Item ${item.name} successfully saved to server`);
  } catch (error) {
    console.error(`Error saving item ${item.name} to server:`, error);
  }
}


try{
async function deleteItem(itemName) {
    const response = await fetch(`http://127.0.0.1:3000/api/items/${itemName}`, {
      method: 'DELETE'
    });

    if (!response.ok) {
      throw new Error('Error deleting item from server');
    }

    console.log(`Item ${itemName} successfully deleted from server`);

    var itemElement = document.querySelector(`[data-name="${itemName}"]`);
    if (itemElement) {
      itemElement.remove();
    }
  }
}


catch{
function formatDate(dateString) {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  return `${day < 10 ? '0' + day : day}.${month < 10 ? '0' + month : month}.${year}`;
}
}

async function addItem() {
  var newItemName = document.getElementById("newItemName").value.trim();
  var newItemDate = document.getElementById("newItemDate").value;
  var level = document.getElementById("levelSelect").value;

  if (newItemName === "" || newItemDate === "") {
    alert("Bitte geben Sie den Namen und das Ablaufdatum des Lebensmittels ein.");
    return;
  }

  var newItem = {
    name: newItemName,
    amount: 0,
    date: newItemDate,
    level: level
  };

  addItemToPage(newItem);

  try {
    await saveItemsToServer(newItem);
    document.getElementById("newItemName").value = "";
    document.getElementById("newItemDate").value = "";
  } catch (error) {
    console.error('Error:', error);
  }
}

function addItemToPage(item) {
  var newItem = document.createElement("div");
  newItem.classList.add("item");
  newItem.setAttribute("data-name", item.name.replace(/\s/g, ''));
  const formattedDate = formatDate(item.date);
  newItem.innerHTML = `
    <h3>${item.name}</h3>
    <p>Anzahl: <span id="${item.name.replace(/\s/g, '')}Count" class="count">${item.amount}</span></p>
    <p>Ablaufdatum: <span class="expiry-date">${formattedDate}</span></p>
    <button onclick="increaseCount('${item.name.replace(/\s/g, '')}')">+</button>
    <button onclick="decreaseCount('${item.name.replace(/\s/g, '')}')">-</button>
    <button onclick="deleteItem('${item.name.replace(/\s/g, '')}')">Löschen</button>
  `;

  if (item.amount < 2) {
    newItem.classList.add("warning");
  }

  var levelContainer = document.getElementById(`level${item.level}`);
  if (levelContainer) {
    levelContainer.appendChild(newItem);
  } else {
    console.error(`Level ${item.level} container not found.`);
  }
}

async function increaseCount(itemName) {
  var countSpan = document.getElementById(`${itemName}Count`);
  var count = parseInt(countSpan.textContent);
  countSpan.textContent = count + 1;
  await updateItemOnServer(itemName, count + 1);
  checkCountAndColor(countSpan, count + 1);
}

async function decreaseCount(itemName) {
  var countSpan = document.getElementById(`${itemName}Count`);
  var count = parseInt(countSpan.textContent);
  if (count > 0) {
    countSpan.textContent = count - 1;
    await updateItemOnServer(itemName, count - 1);
    checkCountAndColor(countSpan, count - 1);
  }
}
  
function checkCountAndColor(countSpan, count) {
  if (count < 2) {
    countSpan.parentElement.parentElement.classList.add("warning");
  } else {
    countSpan.parentElement.parentElement.classList.remove("warning");
  }
}

async function updateItemOnServer(itemName, newCount) {
  try {
    const response = await fetch(`http://127.0.0.1:3000/api/items/${itemName}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ amount: newCount })
    });

    if (!response.ok) {
      throw new Error('Error updating item on server');
    }

    console.log(`Item ${itemName} successfully updated on server`);
  }finally {

  }} 
