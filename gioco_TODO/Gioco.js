const express = require('express');
const app = express();
const port = 3002;
const fs = require('fs');

const firebaseConfig = {
  apiKey: "AIzaSyBPYEFH9F6JwguI4DGTTXXDl0JA6cJZ4mQ",
  authDomain: "spotydma.web.app",
  projectId: "spotydma",
  storageBucket: "spotydma.firebasestorage.app",
  messagingSenderId: "833117624421",
  appId: "1:833117624421:web:e66b3fe3251d82ecb5ce8c",
  measurementId: "G-H2B0CFKM4Y"
};

const { initializeApp } = require("firebase/app");
const { getFirestore } = require("firebase/firestore");
const data = require('./spotifymonthly-data.js');
const appFirebase = initializeApp(firebaseConfig);
const db = getFirestore(app);

//aggiungi ad una collection

const { collection, addDoc } = require("firebase/firestore");

async function createUser(db, nuovoPunteggio, nickname) {
  try {
    const docRef = await addDoc(collection(db, "classifica"), nuovoPunteggio, nickname);
    console.log("punteggio aggiunto: ", docRef.id);
  } catch (e) {
    console.error("Error adding points: ", e);
  }
}

// Example usage:
//const newUser = { name: "Alice", email: "alice@example.com" };
//createUser(db, newUser);

//legge da una collection
async function getUsers(db) {
  const querySnapshot = await getDocs(collection(db, "classifica"));
  querySnapshot.forEach((doc) => {
    console.log(`${doc.id} => ${JSON.stringify(doc.data())}`);
  });
}

//getUsers(db);


app.use(express.json());

app.post('/saveScore', (req, res) => {
    const score = req.body.score;
    const nick = req.body.nick;
    console.log(score);
    createUser(db, score, nick);
    res.sendStatus(200);
});

app.post('/getData', (req, res) => {
    res.json(data);
})

app.listen(port, "0.0.0.0", () => {
    console.log(`Higher or Lower game server running on port ${port}`);
});

    