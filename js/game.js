import { auth, db } from "./firebase.js";
import { doc, onSnapshot, updateDoc } 
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const lobbyID = localStorage.getItem("lobbyID");
const lobbyRef = doc(db, "lobbies", lobbyID);

document.getElementById("lobbyID").innerText = "Lobby ID: " + lobbyID;

onSnapshot(lobbyRef, (docSnap) => {
    const lobby = docSnap.data();

    document.getElementById("lobbyTitle").innerText = lobby.name;

    const list = document.getElementById("playerList");
    list.innerHTML = "";
    lobby.players.forEach(p => {
        list.innerHTML += `<li>${p.username}</li>`;
    });

    if(lobby.status === "playing"){
        document.getElementById("gameArea").style.display="block";
        const current = lobby.players[lobby.turnIndex];
        document.getElementById("turnPlayer").innerText =
          current.username + " is aan de beurt!";
    }
});

document.getElementById("startGame").onclick = async () => {
    await updateDoc(lobbyRef, { status: "playing" });
};
