import { auth } from "./firebase.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const username = document.getElementById("email");
const password = document.getElementById("password");
const status = document.getElementById("status");

// echte email maken van username
function makeEmail(name){
  return name.replace(/\s/g,"").toLowerCase() + "@doenofwaarheid.app";
}

document.getElementById("register").onclick = async () => {
  try {
    const email = makeEmail(username.value);
    await createUserWithEmailAndPassword(auth, email, password.value);
    location.href = "lobby.html";
  } catch(e) {
    status.innerText = e.message;
    console.error(e);
  }
};

document.getElementById("login").onclick = async () => {
  try {
    const email = makeEmail(username.value);
    await signInWithEmailAndPassword(auth, email, password.value);
    location.href = "lobby.html";
  } catch(e) {
    status.innerText = e.message;
    console.error(e);
  }
};
