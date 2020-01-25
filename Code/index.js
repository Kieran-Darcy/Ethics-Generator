const express = require('express');
const mysql = require('mysql');
const script = require('./Scripts/script.js');
const app = express();
const port = 80;
app.use(express.static(__dirname));
app.use(express.urlencoded({extended: true}));

/*// Create connection
const connection = mysql.createConnection({
    host: "192.168.1.1",
    user: "user",
    password: "password",
    database: "ethicsgenerator"
});

// Connect and return result of query
function connect() {
    connection.connect(err => {
        if (err) throw err;
        console.log("Connected to database");
    });
}

// Complete query
function query(statement) {
    connection.query(statement, (err, result) => {
        if (err) throw err;
        return result
    })
}

// Insert people to the table
function insertPeople() {
    connect();
    people.forEach(person => {
        let statement = `INSERT INTO person (age, gender, profession, disability) VALUES ('${person.age}', '${person.gender}', '${person.profession}', '${person.disability}')`;
        console.log(query(statement))
    });
    console.log("Statement complete!");
    connection.end()
}*/

app.get('/', (req, res) => {
    res.sendFile('Scenario1.html', {root: __dirname})
});

app.get('/CSS/background.png', (req, res) => {
    res.sendFile('Res/background.png', {root: __dirname})
});

app.get('/scene', (req, res) => {
    res.send(script.makeScene());
});

app.post('/choice', (req, res) => {
    const option = req.body.option;
    // if the option isn't null add it to the database along with the question
    res.send(option !== undefined)
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
