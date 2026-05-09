import { ensureLogin, auth, db } from "./firebase.js";
import {
  doc, setDoc, getDoc, updateDoc, arrayUnion
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

await ensureLogin();

const username = localStorage.getItem("username");
if(!username) location.href="index.html";

function makeID(){
  return Math.random().toString(36).substring(2,7).toUpperCase();
}

// CREATE LOBBY
document.getElementById("createLobby").onclick = async ()=>{

  const lobbyID = makeID();
  const user = auth.currentUser;
  const name = document.getElementById("lobbyName").value;
  const max = Number(document.getElementById("maxPlayers").value);

  await setDoc(doc(db,"lobbies",lobbyID),{
    name,
    host:user.uid,
    maxPlayers:max,
    status:"waiting",
    turnIndex:0,
    players:[{uid:user.uid, username}],
    gameState:{
      phase:"lobby",
      currentQuestion:"",
      currentAnswer:""
    }
  });

  localStorage.setItem("lobbyID", lobbyID);
  location.href="room.html";
};

// JOIN LOBBY
document.getElementById("joinLobby").onclick = async ()=>{

  const id = document.getElementById("lobbyIdInput").value.toUpperCase();
  const ref = doc(db,"lobbies",id);
  const snap = await getDoc(ref);

  if(!snap.exists()) return alert("Lobby bestaat niet");

  const lobby = snap.data();

  if(lobby.status === "playing") return alert("Game al gestart");
  if(lobby.players.length >= lobby.maxPlayers) return alert("Lobby vol");

  await updateDoc(ref,{
    players: arrayUnion({
      uid: auth.currentUser.uid,
      username
    })
  });

  localStorage.setItem("lobbyID", id);
  location.href="room.html";
};
