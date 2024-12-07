const express = require('express');
const BodyParser = require('body-parser');
const cors = require('cors');   //import il middleware cors (midware --> lavora tra l'OS e le applicazioni) 
const axios = require('axios');
var routerApi = require('./Routers/api');


//instanzio express 
const app = express();
const port = 3000;

/*body-parser permette la lettura dei body delle richieste, in questo caso lo leggo come json*/
app.use(BodyParser.json()); //configurazione di bodyparser per la gestione di json
app.use(BodyParser.urlencoded({ extended: true })); //configurazione di bodyparser per la gestione di form

app.use(cors());    //utilizzo il middleware cors
/*JS non rispetta i criteri di sicurezza quindi uso cors per gestire il numero di origini
 che possono accedere al mio server e per questo entra in gioco cors*/ 

/*app.post('/submit', (req, res) => {
    console.log("arrivato");    //debug per vedere se mi è arrivata una richiesta in console (penso in caso arrivi vuoto)
    console.log(req.body);  //visualizzo il json nel terminale
    res.json(req.body);*/

    app.use(routerApi);

    /*app.post(`/submit`, (req, res) => {
        //console.log(`arrivato'); 
        /*const request = req.body.inputText; //recuperiamo il testo inviato dal client 
        
        //console.log(request); // Visualizza il JSON nel terminale 
        const apikey = '6cae313022bed027333bd5fb2eb820bf';  //fornita dal sito https://home.openweathermap.org;
        //link della pagina web con la key associata
        const apiurl1 = `http://api.openweathermap.org/geo/1.0/direct?q=${request}&limit=5&appid=${apikey}`;

        axios.get(apiurl1)   //utilizzo axios per le chiamate asincrone all'api
            .then(function(response) {
                const cityData = response.data[0];   //ricevo i dati
                console.log(cityData);
                var lat = cityData.lat;
                var lon = cityData.lon;
                const apiurl2 = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apikey}`;
                axios.get(apiurl2)   //utilizzo axios per le chiamate asincrone all'api
                    .then(function(response) {
                        const weatherData = response.data;   //ricevo i dati
                        console.log(weatherData);
                        var dati = [parseFloat(weatherData.main.temp - 273.15).toFixed(1), weatherData.wind.speed];

                        //restituisco i dati alla pagina
                        var jsonRestituito = {
                            inputText: "Ho trovato questi dati della città che mi hai dato: ",
                            nome: weatherData.name,
                            nazione: weatherData.sys.country,
                            temperatura: dati[0],
                            vento: dati[1],
                            descrizione: weatherData.weather[0].description
                        }
                        res.json(jsonRestituito);
                    })
                    .catch(function(error) {
                        console.error(error);
                        dati = [0, 0];
                        var jsonRestituito2 = {
                            inputText: "La città che mi hai dato non esiste",
                            nome: request,
                            nazione: "Sconosciuta",
                            temperatura: dati[0],
                            vento: dati[1],
                            descrizione: "Sconosciuto"
                        }
                        res.json(jsonRestituito2);
                    });
            })
            .catch(function(error) {
                console.error(error);
                dati = [0, 0];
                var jsonRestituito2 = {
                    inputText: "La città che mi hai dato non esiste",
                    nome: request,
                    nazione: "Sconosciuta",
                    temperatura: dati[0],
                    vento: dati[1],
                    descrizione: "Sconosciuto"
                }
                res.json(jsonRestituito2);*/

                

                /*const apiurl = "https://api.kanye.rest";
                axios.get(apiurl)
                .then(function(response){
                    console.log('arrivato');
                    var jsonRestituito = response.data.quote;
                    res.json(jsonRestituito);
                })
                .catch(function(error) {
                    console.log(error);
                })*/

                
            //});
            

        /*axios.get(apiurl2)   //utilizzo axios per le chiamate asincrone all'api
            .then(function(error) {
                const weatherData = resonse.data;   //ricevo i dati
                console.log(weatherData);
                var dati = [parseFloat(weatherData.main.temp - 273.15).toFixed(1), weatherData.wind.speed];

                //restituisco i dati alla pagina
                var jsonRestituito = {
                    inputText: "Ho trovato questi dati della città che mi hai dato: ",
                    nome: weatherData.name,
                    nazione: weatherData.sys.country,
                    temperatura: dati[0],
                    vento: dati[1],
                    descrizione: weatherData.weather[0].description
                }
                res.json(jsonRestituito);
            })
            .catch(function(error) {
                console.error(error);
                dati = [0, 0];
                var jsonRestituito2 = {
                    inputText: "La città che mi hai dato non esiste",
                    nome: request,
                    nazione: "Sconosciuta",
                    temperatura: dati[0],
                    vento: dati[1],
                    descrizione: "Sconosciuto"
                }
                res.json(jsonRestituito2);
            });
    })*/


app.listen(port, "0.0.0.0", () => { //apro la porta del server e aspetto le richieste
    console.log(`Example app listening on port ${port}`)
})

