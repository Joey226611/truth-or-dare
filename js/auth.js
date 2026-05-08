import { auth } from "./firebase.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const email = document.getElementById("email");
const password = document.getElementById("password");
const status = document.getElementById("status");

document.getElementById("register").onclick = async () => {
  try {
    await createUserWithEmailAndPassword(auth, email.value+"@game.nl", password.value);
    location.href = "lobby.html";
  } catch(e) {
    status.innerText = e.message;
  }
};

document.getElementById("login").onclick = async () => {
  try {
    await signInWithEmailAndPassword(auth, email.value+"@game.nl", password.value);
    location.href = "lobby.html";
  } catch(e) {
    status.innerText = e.message;
  }
};
