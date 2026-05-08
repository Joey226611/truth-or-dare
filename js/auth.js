import { auth, db } from "./firebase.js";
import { signInAnonymously } 
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { doc, setDoc } 
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

window.addEventListener("DOMContentLoaded", () => {

  const usernameInput = document.getElementById("username");
  const startBtn = document.getElementById("startGame");
  const status = document.getElementById("status");

  if(!startBtn){
    console.error("startGame button niet gevonden in HTML 😅");
    return;
  }

  startBtn.onclick = async () => {
    const username = usernameInput.value.trim();

    if(username.length < 2){
      status.innerText = "Minimaal 2 letters!";
      return;
    }

    status.innerText = "Account maken...";

    const cred = await signInAnonymously(auth);
    const uid = cred.user.uid;

    await setDoc(doc(db, "users", uid), {
      username: username
    });

    localStorage.setItem("username", username);
    location.href = "lobby.html";
  };

});
