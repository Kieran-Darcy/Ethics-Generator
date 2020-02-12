const express = require('express');
const mysql = require('mysql');
const script = require(__dirname+'/Scripts/script.js');
const app = express();
const port = 80;
app.use(express.static(__dirname));
app.use(express.urlencoded({extended: true}));

/*// Create connection
const connection = mysql.createConnection({
    host: "94.0.241.58",
    user: "user",
    password: "password",
    database: "ethicsgenerator",
    multipleStatements: true
});*/

const connection = mysql.createConnection({
    host: "dragon.kent.ac.uk",
    user: "kd333",
    password: "lar/nar",
    database: "kd333",
    multipleStatements: true
});

function randomPeople() {
    let randPeople = [];
    // picks 10 random people
    for(let i = 0; i < 10; i++) {   // pick 10 people randomly
        randPeople.push(people[Math.ceil(Math.random() * (people.length-1))]);
    }
    const variation = Math.round(Math.random()*2); // chooses a random number between 0 - 9
    const peopleA = randPeople.splice(0, 4+variation); // split into group A
    return {groupA : peopleA, groupB : randPeople};  // return groups
}

// Complete query with callback
function query(statement, request) {
    connection.query(statement, (err, results) => {
        if (err) throw err;
        return request(results);
    });
}

// Complete query without callback
function query(statement) {
    connection.query(statement, (err, result) => {
        if (err) throw err;
    });
}

function getPeople(numOfPeople = 10, response) {
    query(`SELECT * FROM person ORDER BY RAND() LIMIT ${numOfPeople}`, results => {
        return response(results)
    });
}

function getCrossing(response) {
    query('SELECT * FROM crossings ORDER BY RAND() LIMIT 1', result => {
        return response(result[0].crossings)
    });
}

// Make a scene for 2 group Scenarios
function makeScene(response) {
    getPeople(10, people => {
        getCrossing(result => {
            return response({
                people: randomPeople(people),  //  {groupA : [GroupA], groupB : [GroupB]}
                crossingType: result[0].crossings,  // crossing / green light / red light
                timer: Math.random() >= 0.5
            })
        })
    })
}

// Insert people to the table
/*function insertData() {
    script.createPeople().forEach(person => {
        let statement = `INSERT INTO person (age, gender, profession, disability) VALUES ('${person.age}', '${person.gender}', '${person.profession}', '${person.disability}')`;
        query(statement)
    });
    script.crossings.forEach(crossings => {
        let statement = `INSERT INTO crossings (crossing) VALUES ('${crossings}')`;
        query(statement)
    });
    console.log("Statement complete!");
}*/

app.get('/', (req, res) => {
    res.sendFile('Scenario1.html', {root: __dirname})
});

app.get('/CSS/background.png', (req, res) => {
    res.sendFile('background.png', {root: __dirname})
});

app.get('/scene', (req, res) => {
    res.send(script.makeScene())
/*    makeScene(results => {
        res.send(results)
    })*/
});

app.post('/choice', (req, res) => {
    const option = req.body.option;
    // if the option isn't null add it to the database along with the question
    res.send(option !== undefined)
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
