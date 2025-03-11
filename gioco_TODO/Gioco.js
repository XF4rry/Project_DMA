const express = require('express');
const app = express();
const port = 3002;

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const appFirebase = initializeApp(firebaseConfig);
const db = getFirestore(app);

//aggiungi ad una collection
import { collection, addDoc } from "firebase/firestore";

async function createUser(db, nuovoPunteggio) {
  try {
    const docRef = await addDoc(collection(db, "classifica"), nuovoPunteggio);
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

app.post('/guess', (req, res) => {
   
});

app.listen(port, () => {
    console.log(`Higher or Lower game server running on port ${port}`);
});

    