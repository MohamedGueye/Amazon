import firebase from "firebase";

const firebaseConfig = {
    apiKey: "AIzaSyDJ8qoqYN-pwL-LVCo64a8BDEhuVlpyUIU",
    authDomain: "amazo-f6403.firebaseapp.com",
    projectId: "amazo-f6403",
    storageBucket: "amazo-f6403.appspot.com",
    messagingSenderId: "1011049984665",
    appId: "1:1011049984665:web:9bd95bab95ccfc50cf3e08"
  };

  // Initialize App
  const app = !firebase.apps.length ? firebase.initializeApp(firebaseConfig) : firebase.app();

  // Database
  const db = app.firestore();

  export default db;