import { auth, db } from "./firebase.js";
import { collection, doc, setDoc, getDoc, updateDoc, arrayUnion } 
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

function generateLobbyID() {
    return Math.random().toString(36).substring(2,8).toUpperCase();
}

const status = document.getElementById("status");

document.getElementById("createLobby").onclick = async () => {
    const user = auth.currentUser;
    if(!user) return;

    const lobbyID = generateLobbyID();
    const name = document.getElementById("lobbyName").value;
    const maxPlayers = Number(document.getElementById("maxPlayers").value);
    const rounds = Number(document.getElementById("rounds").value);

    if(maxPlayers < 2) {
        status.innerText = "Minimaal 2 spelers!";
        return;
    }

    await setDoc(doc(db, "lobbies", lobbyID), {
        name,
        host: user.uid,
        maxPlayers,
        roundCount: rounds,
        status: "waiting",
        turnIndex: 0,
        players: [
            { username: localStorage.getItem("username") }
        ]
    });

    localStorage.setItem("lobbyID", lobbyID);
    location.href = "room.html";
};

document.getElementById("joinLobby").onclick = async () => {
    const lobbyID = document.getElementById("lobbyIdInput").value.toUpperCase();
    const user = auth.currentUser;
    if(!user) return;

    const lobbyRef = doc(db, "lobbies", lobbyID);
    const lobbySnap = await getDoc(lobbyRef);

    if(!lobbySnap.exists()) {
        status.innerText = "Lobby bestaat niet!";
        return;
    }

    await updateDoc(lobbyRef, {
        players: arrayUnion({
            uid: user.uid,
            username: user.email.split("@")[0]
        })
    });

    localStorage.setItem("lobbyID", lobbyID);
    location.href = "room.html";
};
