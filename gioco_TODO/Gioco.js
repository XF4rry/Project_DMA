const express = require('express');
const app = express();
const port = 3002;


app.use(express.json());

app.post('/guess', (req, res) => {
   
});

app.listen(port, () => {
    console.log(`Higher or Lower game server running on port ${port}`);
});

    