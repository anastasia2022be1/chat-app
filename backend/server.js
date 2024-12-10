// Express importieren
import express from "express";
const app = express();

// damit express die daten aus dem body auswertet
//app.use(express.urlencoded());
app.use(express.json());


app.get('/', (req, res) => {
    res.send('Hallo, Welt!');
})

// Server starten
app.listen(3000, () => {
    console.log('Server läuft auf http://localhost:3000')
});