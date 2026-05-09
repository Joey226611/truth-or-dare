import { ensureLogin, auth, db } from "./firebase.js";
import {
  doc, onSnapshot, updateDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

await ensureLogin();

const lobbyID = localStorage.getItem("lobbyID");
if(!lobbyID) location.href="lobby.html";

const ref = doc(db,"lobbies",lobbyID);

const TRUTH = [
 "Wat is je grootste geheim?",
 "Wie vind je leuk?",
 "Wat is je grootste angst?",
 "Wat is je meest gênante moment?"
];

const playersUI = document.getElementById("players");
const gameUI = document.getElementById("game");
const startBtn = document.getElementById("startBtn");

let lobbyData;

// REALTIME LISTENER
onSnapshot(ref,(snap)=>{
  if(!snap.exists()) return location.href="lobby.html";

  lobbyData = snap.data();
  renderLobby();
  renderGame();
});

function renderLobby(){

  playersUI.innerHTML="";
  lobbyData.players.forEach(p=>{
    const li=document.createElement("li");
    li.textContent=p.username;
    playersUI.appendChild(li);
  });

  startBtn.style.display =
    lobbyData.host === auth.currentUser.uid ? "block":"none";
}

// HOST START GAME
startBtn.onclick = ()=> updateDoc(ref,{
  status:"playing",
  "gameState.phase":"choose"
});

// GAME RENDER
function renderGame(){

  if(lobbyData.status !== "playing") return;

  gameUI.style.display="block";

  const phase = lobbyData.gameState.phase;

  if(phase==="choose") showChoose();
  if(phase==="truth_pick") showPick();
  if(phase==="truth_answer") showAnswer();
  if(phase==="truth_result") showResult();
}

// WAARHEID KLIK
document.getElementById("truth").onclick=()=>{
  updateDoc(ref,{ "gameState.phase":"truth_pick" });
};

function showChoose(){}

function showPick(){

  const q1 = TRUTH[Math.floor(Math.random()*TRUTH.length)];
  const q2 = TRUTH[Math.floor(Math.random()*TRUTH.length)];

  random1.innerText=q1;
  random2.innerText=q2;

  random1.onclick=()=>sendQuestion(q1);
  random2.onclick=()=>sendQuestion(q2);
}

function sendQuestion(q){
  updateDoc(ref,{
    "gameState.phase":"truth_answer",
    "gameState.currentQuestion":q
  });
}

sendAnswer.onclick=()=>{
  updateDoc(ref,{
    "gameState.phase":"truth_result",
    "gameState.currentAnswer":answerInput.value
  });
};

continueBtn.onclick=()=>{

  let next=lobbyData.turnIndex+1;
  if(next>=lobbyData.players.length) next=0;

  updateDoc(ref,{
    turnIndex:next,
    "gameState.phase":"choose",
    "gameState.currentAnswer":"",
    "gameState.currentQuestion":""
  });
};
