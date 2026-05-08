import { auth, db } from "./firebase.js";
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  arrayUnion
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

function generateLobbyID(){
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

// UI
const status = document.getElementById("status");

const lobbyNameInput = document.getElementById("lobbyName");
const maxPlayersInput = document.getElementById("maxPlayers");
const roundsInput = document.getElementById("rounds");

const lobbyIdInput = document.getElementById("lobbyIdInput");

const createBtn = document.getElementById("createLobby");
const joinBtn = document.getElementById("joinLobby");

// safety check
const username = localStorage.getItem("username");

if(!username){
  console.warn("Geen username gevonden");
}

// 🔥 CREATE LOBBY
createBtn.onclick = async () => {
  const user = auth.currentUser;

  if(!user){
    status.innerText = "Nog niet ingelogd...";
    return;
  }

  const name = lobbyNameInput.value.trim();
  const maxPlayers = Number(maxPlayersInput.value);
  const rounds = Number(roundsInput.value);

  if(!name){
    status.innerText = "Geef een lobby naam!";
    return;
  }

  if(maxPlayers < 2){
    status.innerText = "Minimaal 2 spelers!";
    return;
  }

  const lobbyID = generateLobbyID();

  await setDoc(doc(db, "lobbies", lobbyID), {
    name,
    host: user.uid,
    maxPlayers,
    roundCount: rounds,
    status: "waiting",
    turnIndex: 0,
    players: [
      {
        uid: user.uid,
        username: username || "Player"
      }
    ],
    createdAt: Date.now()
  });

  localStorage.setItem("lobbyID", lobbyID);

  status.innerText = "Lobby aangemaakt! 🚀";

  setTimeout(() => {
    location.href = "room.html";
  }, 500);
};

// 🔥 JOIN LOBBY
joinBtn.onclick = async () => {

  const user = auth.currentUser;

  if(!user){
    status.innerText = "Nog niet ingelogd...";
    return;
  }

  const lobbyID = lobbyIdInput.value.trim().toUpperCase();

  if(!lobbyID){
    status.innerText = "Vul een Lobby ID in!";
    return;
  }

  const lobbyRef = doc(db, "lobbies", lobbyID);
  const snap = await getDoc(lobbyRef);

  if(!snap.exists()){
    status.innerText = "Lobby bestaat niet!";
    return;
  }

  const lobby = snap.data();

  if(lobby.players.length >= lobby.maxPlayers){
    status.innerText = "Lobby is vol!";
    return;
  }

  await updateDoc(lobbyRef, {
    players: arrayUnion({
      uid: user.uid,
      username: username || "Player"
    })
  });

  localStorage.setItem("lobbyID", lobbyID);

  status.innerText = "Joined lobby! 🎮";

  setTimeout(() => {
    location.href = "room.html";
  }, 500);
};
