const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { GoogleGenAI } = require('@google/genai');
const app = express();
app.use(bodyParser.json());
app.use(cors());

const ai = new GoogleGenAI({ apiKey: "AIzaSyAC0dqabeKGJUEIyNwiYIsK_ZuA1I7v4wU" });  //api key data da gemini

app.post('/genera', async (req, res) => {
  try {
    const contents  = req.body.search;
    const response = await ai.models.generateContent({ model: "gemini-2.0-flash", contents });  //definisco il modello di AI usato e prendo la richiesta dal body
    console.log(response.text);
    res.json(response.text);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Errore durante la generazione del contenuto' });
  }
});

app.listen(3003, () => {
  console.log('AI listening on port 3003');
});
