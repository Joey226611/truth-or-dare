import { auth, db } from "./firebase.js";
import { onAuthStateChanged } 
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import { doc, onSnapshot } 
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const lobbyID = localStorage.getItem("lobbyID");

// UI elements
const lobbyTitle = document.getElementById("lobbyTitle");
const lobbyIDText = document.getElementById("lobbyID");
const playerList = document.getElementById("playerList");
const gameArea = document.getElementById("gameArea");

if(!lobbyID){
  console.error("Geen lobbyID gevonden 😅");
}

onAuthStateChanged(auth, (user) => {
  if(!user){
    console.log("Nog geen user geladen...");
    return;
  }

  console.log("User ready:", user.uid);
  initGame(user);
});

function initGame(user){

  const lobbyRef = doc(db, "lobbies", lobbyID);

  onSnapshot(lobbyRef, (snap) => {

    if(!snap.exists()){
      console.log("Lobby bestaat niet meer");
      return;
    }

    const lobby = snap.data();

    // UI basics
    lobbyTitle.innerText = lobby.name || "Lobby";
    lobbyIDText.innerText = "Lobby ID: " + lobbyID;

    // spelers tonen
    playerList.innerHTML = "";

    if(lobby.players && lobby.players.length > 0){
      lobby.players.forEach(p => {
        const li = document.createElement("li");
        li.textContent = p.username + (p.uid === user.uid ? " (jij)" : "");
        playerList.appendChild(li);
      });
    }

    // game area tonen zodra lobby bestaat
    gameArea.style.display = "block";

    // debug log
    console.log("Lobby update:", lobby);

  });

}
