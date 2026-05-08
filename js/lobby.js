import { auth, db } from "./firebase.js";
import {
  doc, setDoc, getDoc, updateDoc, arrayUnion
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

function id(){
  return Math.random().toString(36).substring(2,8).toUpperCase();
}

const status = document.getElementById("status");
const username = localStorage.getItem("username");

if(!username){
  location.href = "index.html";
}

// 🎮 CREATE
document.getElementById("createLobby").onclick = async () => {

  const user = auth.currentUser;
  const name = document.getElementById("lobbyName").value;
  const max = Number(document.getElementById("maxPlayers").value);

  if(!user) return;

  const lobbyID = id();

  await setDoc(doc(db,"lobbies",lobbyID),{
    name,
    host:user.uid,
    maxPlayers:max,
    status:"waiting",
    players:[
      {uid:user.uid, username}
    ],
    turnIndex:0
  });

  localStorage.setItem("lobbyID", lobbyID);
  location.href="room.html";
};

// 🎮 JOIN
document.getElementById("joinLobby").onclick = async () => {

  const user = auth.currentUser;
  const lobbyID = document.getElementById("lobbyIdInput").value.toUpperCase();

  if(!user) return;

  const ref = doc(db,"lobbies",lobbyID);
  const snap = await getDoc(ref);

  if(!snap.exists()){
    status.innerText = "Lobby bestaat niet!";
    return;
  }

  const lobby = snap.data();

  if(lobby.status === "playing"){
    status.innerText = "Game is al gestart!";
    return;
  }

  if(lobby.players.length >= lobby.maxPlayers){
    status.innerText = "Lobby is vol!";
    return;
  }

  await updateDoc(ref,{
    players: arrayUnion({
      uid:user.uid,
      username
    })
  });

  localStorage.setItem("lobbyID", lobbyID);
  location.href="room.html";
};
