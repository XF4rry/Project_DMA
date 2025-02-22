const express = require('express');
const BodyParser = require('body-parser');
const cors = require('cors');   //import il middleware cors (midware --> lavora tra l'OS e le applicazioni) 
const axios = require('axios');
var routerApi = require('./Routers/api');
var routerLogin = require('./Routers/login')
const ejs = require('ejs');


//instanzio express 
const app = express();
const port = 3000;
//app.set('view engine', 'ejs');
/*body-parser permette la lettura dei body delle richieste, in questo caso lo leggo come json*/
app.use(BodyParser.json()); //configurazione di bodyparser per la gestione di json
app.use(BodyParser.urlencoded({ extended: true })); //configurazione di bodyparser per la gestione di form
app.set('view engine', 'ejs');
app.use(cors());    //utilizzo il middleware cors
/*JS non rispetta i criteri di sicurezza quindi uso cors per gestire il numero di origini
 che possono accedere al mio server e per questo entra in gioco cors*/ 
/*app.post('/submit', (req, res) => {
    console.log("arrivato");    //debug per vedere se mi è arrivata una richiesta in console (penso in caso arrivi vuoto)
    console.log(req.body);  //visualizzo il json nel terminale
    res.json(req.body);*/

    app.use(routerApi);
    app.use(routerLogin);

app.listen(port, "0.0.0.0", () => { //apro la porta del server e aspetto le richieste
    console.log(`Example app listening on port ${port}`)
})

