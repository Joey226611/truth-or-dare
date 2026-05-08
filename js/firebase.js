<script type="module">
// Firebase imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// JOUW FIREBASE CONFIG HIER PLAKKEN
const firebaseConfig = {
  apiKey: "AIzaSyDbe2tlgFAK6RN9IWup89xRYPfla-xYcD0",
  authDomain: "doen-of-waarheid.firebaseapp.com",
  projectId: "doen-of-waarheid",
  storageBucket: "doen-of-waarheid.firebasestorage.app",
  messagingSenderId: "376352032094",
  appId: "1:376352032094:web:75e132428744df268efbcf"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
</script>
