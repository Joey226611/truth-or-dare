import { auth, db } from "./firebase.js";
import {
  doc, onSnapshot, updateDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const lobbyID = localStorage.getItem("lobbyID");
const username = localStorage.getItem("username");

const ref = doc(db,"lobbies",lobbyID);

let isHost = false;

// UI
const playersUI = document.getElementById("players");
const gameUI = document.getElementById("game");
const startBtn = document.getElementById("startBtn");

const copyBtn = document.getElementById("copyBtn");
document.getElementById("lobbyIDText").innerText = lobbyID;

// 📋 copy
copyBtn.onclick = () => {
  navigator.clipboard.writeText(lobbyID);
};

// realtime
onSnapshot(ref,(snap)=>{

  const lobby = snap.data();

  if(!lobby) return;

  isHost = lobby.host === auth.currentUser.uid;

  document.getElementById("lobbyName").innerText = lobby.name;

  // players
  playersUI.innerHTML="";
  lobby.players.forEach(p=>{
    const li=document.createElement("li");
    li.textContent=p.username + (p.uid===auth.currentUser.uid?" (jij)":"");
    playersUI.appendChild(li);
  });

  // host only
  startBtn.style.display = isHost ? "block" : "none";

  // game state
  if(lobby.status === "playing"){
    gameUI.style.display="block";
    startBtn.style.display="none";

    const current = lobby.players[lobby.turnIndex];
    document.getElementById("turn").innerText =
      current.username + " is aan de beurt!";
  } else {
    gameUI.style.display="none";
  }

});

// ▶ start game
startBtn.onclick = async () => {
  await updateDoc(ref,{
    status:"playing"
  });
};
