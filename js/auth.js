import { auth, db } from "./firebase.js";
import { signInAnonymously, onAuthStateChanged }
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { doc, setDoc }
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const usernameInput = document.getElementById("username");
const startBtn = document.getElementById("startGame");
const status = document.getElementById("status");

startBtn.onclick = async () => {
  const username = usernameInput.value.trim();

  if(username.length < 2){
    status.innerText = "Minimaal 2 letters!";
    return;
  }

  status.innerText = "Account maken...";

  const cred = await signInAnonymously(auth);
  const uid = cred.user.uid;

  // username opslaan in database
  await setDoc(doc(db, "users", uid), {
    username: username
  });

  localStorage.setItem("username", username);
  location.href = "lobby.html";
};

onAuthStateChanged(auth, user => {
  if(user){
    location.href = "lobby.html";
  }
});
