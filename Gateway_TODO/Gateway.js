const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');

app.use(cors());
app.use(bodyParser.json());

const services = {
    auth: 'http://localhost:3003',
    game: 'http://localhost:3002',
    api: 'http://localhost:3000'
};

app.use(async (req, res, next) => {
    /**
     * Questo middleware si occupa di instradare le richieste ai vari servizi.
     * La richiesta viene inoltrata al servizio specificato nell'header 'x-service'.
     * Se l'header 'x-service' non  presente o non corretto, viene restituito un errore 400.
     */
    const service = services[req.header('x-service')];
    console.log("passato dal gateway");
    if (!service) {
        return res.status(400).send({ error: 'x-service header is missing or invalid' });
    }
    const url = `${service}${req.url}`;
    console.log("url: " + url);
    /**
     * Prendo la richiesta originale e la inoltro al servizio corrispondente.
     * La response ricevuta dal servizio viene inoltrata al client.
     */
    const { method, headers, body } = req;
    const response = await axios({
        url,
        method,
        headers,
        data: body
    });
    res.send(response.data);
});

app.listen(3001, '0.0.0.0', () => {
    console.log('Gateway listening on port 3001');
});
