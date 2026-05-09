// 🔥 Firebase init (zelfde config gebruiken als andere files)
import { db, auth } from "./firebase.js";
import {
  doc,
  onSnapshot,
  updateDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const lobbyId = localStorage.getItem("lobbyId");
const lobbyRef = doc(db, "lobbies", lobbyId);

let myUid = null;

// UI elementen
const statusText = document.getElementById("status");
const truthBtn = document.getElementById("truthBtn");
const dareBtn = document.getElementById("dareBtn");
const inputBox = document.getElementById("inputBox");
const sendBtn = document.getElementById("sendBtn");

function hideAllUI() {
  truthBtn.style.display = "none";
  dareBtn.style.display = "none";
  inputBox.style.display = "none";
  sendBtn.style.display = "none";
}

function showStatus(text) {
  statusText.innerText = text;
}

auth.onAuthStateChanged(user => {
  if (!user) return;
  myUid = user.uid;
  listenLobby();
});

function listenLobby() {
  onSnapshot(lobbyRef, async (snap) => {
    const data = snap.data();
    if (!data) return;

    const myTurn = data.turn === myUid;
    hideAllUI();

    // GAME NOT STARTED
    if (!data.gameStarted) {
      showStatus("Waiting for host to start game...");
      return;
    }

    // PHASE: CHOOSE TRUTH OR DARE
    if (data.phase === "choose") {
      if (myTurn) {
        showStatus("Your turn! Choose Truth or Dare");
        truthBtn.style.display = "block";
        dareBtn.style.display = "block";
      } else {
        showStatus("Opponent is choosing...");
      }
    }

    // PHASE: OTHER PLAYER WRITES QUESTION
    if (data.phase === "writeQuestion") {
      if (!myTurn) {
        showStatus("Write the question/opdracht");
        inputBox.style.display = "block";
        sendBtn.style.display = "block";
        inputBox.placeholder = "Type question...";
      } else {
        showStatus("Opponent is writing...");
      }
    }

    // PHASE: PLAYER ANSWERS
    if (data.phase === "answer") {
      if (myTurn) {
        showStatus("Answer now!");
        inputBox.style.display = "block";
        sendBtn.style.display = "block";
        inputBox.placeholder = "Type your answer...";
      } else {
        showStatus("Opponent is answering...");
      }
    }
  });
}


// 🎯 TRUTH / DARE CLICK
truthBtn.onclick = async () => {
  await updateDoc(lobbyRef, {
    choice: "truth",
    phase: "writeQuestion"
  });
};

dareBtn.onclick = async () => {
  await updateDoc(lobbyRef, {
    choice: "dare",
    phase: "writeQuestion"
  });
};


// ✍️ SEND QUESTION OR ANSWER
sendBtn.onclick = async () => {
  const text = inputBox.value.trim();
  if (!text) return;

  const snap = await lobbyRef.get();
  const data = snap.data();

  const otherPlayer = data.players.find(p => p !== myUid);

  // If writing question
  if (data.phase === "writeQuestion") {
    await updateDoc(lobbyRef, {
      question: text,
      phase: "answer"
    });
  }

  // If answering
  else if (data.phase === "answer") {
    await updateDoc(lobbyRef, {
      answer: text,
      turn: otherPlayer,
      phase: "choose",
      question: "",
      answer: "",
      choice: null
    });
  }

  inputBox.value = "";
};
