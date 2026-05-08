import { auth, db } from "./firebase.js";
import { doc, onSnapshot, updateDoc } 
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { truthQuestions } from "./questions.js";

const lobbyID = localStorage.getItem("lobbyID");
const lobbyRef = doc(db, "lobbies", lobbyID);
const myUID = auth.currentUser.uid;

const truthBtn = document.getElementById("truthBtn");
const dareBtn = document.getElementById("dareBtn");
const questionArea = document.getElementById("questionArea");

function randomQuestions(){
    return truthQuestions.sort(()=>0.5-Math.random()).slice(0,2);
}

onSnapshot(lobbyRef, async (docSnap) => {
    const lobby = docSnap.data();
    const game = lobby.gameState;

    // speler lijst
    const list = document.getElementById("playerList");
    list.innerHTML="";
    lobby.players.forEach(p => list.innerHTML += `<li>${p.username}</li>`);

    // start game
    if(lobby.status==="playing" && !game){
        await updateDoc(lobbyRef,{
            gameState:{
                phase:"choose",
                currentPlayer:lobby.players[0].uid
            }
        });
        return;
    }

    if(!game) return;

    const currentPlayer = lobby.players.find(p=>p.uid===game.currentPlayer);
    document.getElementById("turnPlayer").innerText =
      currentPlayer.username + " is aan de beurt!";

    // PHASE 1 — speler kiest waarheid
    if(game.phase==="choose"){
        questionArea.innerHTML="";
        if(game.currentPlayer===myUID){
            truthBtn.style.display="block";
            dareBtn.style.display="block";
        } else {
            truthBtn.style.display="none";
            dareBtn.style.display="none";
            questionArea.innerHTML="<p>Wachten tot speler kiest...</p>";
        }
    }

    // PHASE 2 — andere speler kiest vraag
    if(game.phase==="pickQuestion"){
        truthBtn.style.display="none";
        dareBtn.style.display="none";

        if(game.askedBy===myUID){
            const [q1,q2] = randomQuestions();

            questionArea.innerHTML=`
                <h3>Kies een vraag</h3>
                <button class="qbtn">${q1}</button>
                <button class="qbtn">${q2}</button>
                <input id="customQ" placeholder="Eigen vraag">
                <button id="sendCustom">Verstuur eigen vraag</button>
            `;

            document.querySelectorAll(".qbtn").forEach(btn=>{
                btn.onclick=()=>sendQuestion(btn.innerText);
            });

            document.getElementById("sendCustom").onclick=()=>{
                sendQuestion(document.getElementById("customQ").value);
            }
        } else {
            questionArea.innerHTML="<p>Andere speler kiest vraag...</p>";
        }
    }

    // PHASE 3 — speler antwoord
    if(game.phase==="answering"){
        if(game.currentPlayer===myUID){
            questionArea.innerHTML=`
                <h3>${game.question}</h3>
                <input id="answerInput" placeholder="Typ je antwoord">
                <button id="sendAnswer">Verstuur antwoord</button>
            `;
            document.getElementById("sendAnswer").onclick=sendAnswer;
        } else {
            questionArea.innerHTML="<p>Speler is aan het antwoorden...</p>";
        }
    }

    // PHASE 4 — antwoord tonen + next turn
    if(game.phase==="showAnswer"){
        questionArea.innerHTML=`
            <h3>Vraag:</h3>
            <p>${game.question}</p>
            <h3>Antwoord:</h3>
            <p>${game.answer}</p>
            <button id="nextTurn">Volgende beurt</button>
        `;

        document.getElementById("nextTurn").onclick=nextTurn;
    }
});

truthBtn.onclick = async () => {
    const lobbySnap = await lobbyRef.get();
};

truthBtn.onclick = async () => {
    const lobbySnap = await lobbyRef;
    const data = (await lobbyRef.get()).data();

    const other = data.players.find(p=>p.uid!==myUID);

    await updateDoc(lobbyRef,{
        gameState:{
            phase:"pickQuestion",
            mode:"truth",
            currentPlayer:myUID,
            askedBy:other.uid
        }
    });
};

async function sendQuestion(q){
    await updateDoc(lobbyRef,{
        "gameState.phase":"answering",
        "gameState.question":q
    });
}

async function sendAnswer(){
    const ans = document.getElementById("answerInput").value;
    await updateDoc(lobbyRef,{
        "gameState.phase":"showAnswer",
        "gameState.answer":ans
    });
}

async function nextTurn(){
    const snap = await lobbyRef.get();
    const lobby = snap.data();

    let nextIndex = (lobby.turnIndex+1) % lobby.players.length;

    await updateDoc(lobbyRef,{
        turnIndex:nextIndex,
        "gameState.phase":"choose",
        "gameState.currentPlayer":lobby.players[nextIndex].uid
    });
}
