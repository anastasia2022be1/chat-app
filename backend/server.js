// Express importieren
import express from "express";
const app = express();

// damit express die daten aus dem body auswertet
//app.use(express.urlencoded());
app.use(express.json());

// Eine einfache Route
app.get('/api', (req, res) => {
    res.send('hi guys!');
});

// Server starten
app.listen(3000, () => {
    console.log('Server läuft auf http://localhost:3000');
});