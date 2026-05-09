import { ensureLogin } from "./firebase.js";

const usernameInput = document.getElementById("username");
const startBtn = document.getElementById("startBtn");

startBtn.onclick = async () => {

  const username = usernameInput.value.trim();
  if(username.length < 2) return alert("Username te kort");

  localStorage.setItem("username", username);
  await ensureLogin();

  location.href = "lobby.html";
};
