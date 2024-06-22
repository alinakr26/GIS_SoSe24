document.addEventListener("DOMContentLoaded", function () {
  loadItemsFromLocalStorage();
});

async function loadItemsFromLocalStorage() {
 // var items = localSt.getItem("items");
 const response = await fetch("http://127.0.0.1:3000/api/items");
  const items = await response.text();
  console.log(items)
  if (items) {
      items = JSON.parse(items);
      items.forEach(function (item) {
          addItemToPage(item);
      });
  }
}

function saveItemsToLocalStorage(items) {
  localStorage.setItem("items", JSON.stringify(items));
}

function formatDate(dateString) {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  return `${day < 10 ? '0' + day : day}.${month < 10 ? '0' + month : month}.${year}`;
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


  const response = await fetch("http://127.0.0.1:3000/api/items", {
    method: 'post',
    body: JSON.stringify(newItem),
  });

  document.getElementById("newItemName").value = "";
  document.getElementById("newItemDate").value = "";
}

function addItemToPage(item) {
  var newItem = document.createElement("div");
  newItem.classList.add("item");
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

function increaseCount(itemName) {
  var countSpan = document.getElementById(`${itemName}Count`);
  var count = parseInt(countSpan.textContent);
  countSpan.textContent = count + 1;
  updateItemInLocalStorage(itemName, count + 1);
  checkCountAndColor(countSpan, count + 1);
}

function decreaseCount(itemName) {
  var countSpan = document.getElementById(`${itemName}Count`);
  var count = parseInt(countSpan.textContent);
  if (count > 0) {
      countSpan.textContent = count - 1;
      updateItemInLocalStorage(itemName, count - 1);
      checkCountAndColor(countSpan, count - 1);
  }
}

function deleteItem(itemName) {
  var item = document.getElementById(`${itemName}Count`).parentElement.parentElement;
  item.remove();
  removeItemFromLocalStorage(itemName);
}

function checkCountAndColor(countSpan, count) {
  if (count < 2) {
      countSpan.parentElement.parentElement.classList.add("warning");

  } else {
      countSpan.parentElement.parentElement.classList.remove("warning");
  }
}

function updateItemInLocalStorage(itemName, newCount) {
  var items = JSON.parse(localStorage.getItem("items"));
  var item = items.find(item => item.name.replace(/\s/g, '') === itemName);
  item.amount = newCount;
  saveItemsToLocalStorage(items);
}

function removeItemFromLocalStorage(itemName) {
  var items = JSON.parse(localStorage.getItem("items"));
  items = items.filter(item => item.name.replace(/\s/g, '') !== itemName);
  saveItemsToLocalStorage(items);
}
function increaseCount(itemName) {
  var countSpan = document.getElementById(`${itemName}Count`);
  var count = parseInt(countSpan.textContent);
  countSpan.textContent = count + 1;
  updateItemInLocalStorage(itemName, count + 1);
  checkCountAndColor(countSpan, count + 1);
}

function decreaseCount(itemName) {
  var countSpan = document.getElementById(`${itemName}Count`);
  var count = parseInt(countSpan.textContent);
  if (count > 0) {
      countSpan.textContent = count - 1;
      updateItemInLocalStorage(itemName, count - 1);
      checkCountAndColor(countSpan, count - 1);
  }
}

async function deleteItem(itemName) {
  const response = await fetch("http://127.0.0.1:3000/api/items");
  console.log('Response', response); 
  const text = await response.text();
  console.log(text); // Text aus Response Body
  var itemElement = document.getElementById(`${itemName}Count`).parentElement.parentElement;
  var items = JSON.parse(localStorage.getItem("items"));
  var item = items.find(i => i.name.replace(/\s/g, '') === itemName);
  if (item) {
    deleteItemFromServer(item.id);
  }
  itemElement.remove();
  items = items.filter(i => i.name.replace(/\s/g, '') !== itemName);
  saveItemsToLocalStorage(items);
}
