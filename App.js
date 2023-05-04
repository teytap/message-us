//---firebase----

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  onValue,
  remove,
  update,
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

const appSettings = {
  databaseURL:
    "https://message-us-4c786-default-rtdb.europe-west1.firebasedatabase.app/",
};
const app = initializeApp(appSettings);
const database = getDatabase(app);
const messageUsDB = ref(database, "messageUs");
//------
const messageText = document.getElementById("message-text");
const userFrom = document.getElementById("user-from");
const userTo = document.getElementById("user-to");
const publishBtn = document.getElementById("publish-btn");
const warning = document.querySelector(".warning");
const messagesContainer = document.querySelector("#messages-container");

function getMessageHtml(item) {
  let itemID = item[0];
  if (item[1]) {
    let message = item[1].messageValue;
    let from = item[1].fromValue;
    let to = item[1].toValue;
    let likeCount = item[1].like;
    let isLiked = item[1].isLiked;
    let newMessage = document.createElement("li");
    newMessage.innerHTML = `<li>
      
      <h4>To: ${to}</h4>
      <div class="message-field">${message}</div>
      <h4>From: ${from}</h4>
      <div class="actions"><span id="likes">♥<span id="likes-count">${likeCount}</span></span>  
      <span class="material-symbols-outlined" id="trash-bin">
      delete
      </span></div></li>
      `;

    //each li has its own delete and like function
    newMessage.addEventListener("click", function (e) {
      if (e.target.id === "trash-bin") {
        let exactLocationOfItemInDB = ref(database, `messageUs/${itemID}`);
        remove(exactLocationOfItemInDB);
      }
      if (e.target.id === "likes") {
        if (!isLiked) {
          likeCount++;
          let exactLocationOfItemInDB = ref(database, `messageUs/${itemID}`);
          update(exactLocationOfItemInDB, {
            like: likeCount,
            isLiked: true,
          });
        }
      }
    });
    messagesContainer.append(newMessage);
  }
}

//---firebase function onValue
onValue(messageUsDB, function (snapshot) {
  if (snapshot.exists()) {
    let messagesArray = Object.entries(snapshot.val());
    messagesContainer.innerHTML = "";
    for (let message of messagesArray) {
      getMessageHtml(message);
    }
  } else {
    messagesContainer.innerHTML = "";
  }
});

// function of publish button
function publish() {
  //if inputs exists
  if (messageText.value && userFrom.value && userTo.value) {
    push(messageUsDB, {
      messageValue: messageText.value,
      fromValue: userFrom.value,
      toValue: userTo.value,
      like: 0,
      isLiked: false,
    });
    warning.style.display = "none";
    messageText.value = "";
    userFrom.value = "";
    userTo.value = "";
  } else {
    warning.style.display = "block";
  }
}

publishBtn.addEventListener("click", publish);
