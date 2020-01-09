const express = require('express');
const mysql = require('mysql');
const people = require('./Scripts/script.js');
const app = express();
const port = 80;
app.use(express.static(__dirname));

// Create connection
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
}

/*
app.get('/', (req, res) => {
    //res.sendFile('ScenarioGenerator.html', {root: __dirname})

});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));*/
