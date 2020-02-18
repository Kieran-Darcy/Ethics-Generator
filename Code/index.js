const express = require('express');
const mysql = require('mysql');
// const script = require(__dirname + '/Scripts/script.js');
const app = express();
const port = 80;
app.use(express.static(__dirname));
app.use(express.urlencoded({extended: true}));
let currentScenario = {};

// Create connection
const connection = mysql.createConnection({
    host: "151.231.205.6",
    user: "user",
    password: "password",
    database: "ethicsgenerator",
    multipleStatements: true
});

/*const connection = mysql.createConnection({
    host: "dragon.kent.ac.uk",
    user: "kd333",
    password: "lar/nar",
    database: "kd333",
    multipleStatements: true
});*/

function sortPeople(groupAB, groupC) {
    let people = groupAB;
    const variation = Math.round(Math.random() - Math.random()); // chooses a random number between -1 - 1
    const peopleA = people.splice(0, Math.round(people.length/2) /*+ variation*/); // split into group A
    return {groupA: peopleA, groupB: people, groupC: groupC} // return groups
}

// Complete query with callback
function query(statement, request) {
    connection.query(statement, (err, results) => {
        if (err) throw err;
        return (request === undefined) ? null : request(results);
    });
}

function getPeople(numOfPeople = 10, response) {
    query(`SELECT * FROM person ORDER BY RAND() LIMIT ${numOfPeople}`, results => {
        return response(results)
    });
}

function getCrossing(response) {
    query('SELECT * FROM crossings ORDER BY RAND() LIMIT 1', result => {
        return response(result[0].crossing)
    });
}

// Make a scene for 2 group Scenarios
function makeScene(response) {
    const numOfPeople = 2+(Math.round(Math.random()*(10-2)));
    getPeople(numOfPeople, groupAB => {
        getPeople((numOfPeople > 4) ? 1+Math.round(Math.random()*(4-1)) : 0, groupC => {
            getCrossing(result => {
                return response({
                    people: sortPeople(groupAB, groupC),  //  {groupA : [GroupA], groupB : [GroupB], groupC : [GroupC]}
                    crossingType: result,  // crossing / green light / red light
                    timer: Math.random() >= 0.5
                })
            })
        })
    })
}

function saveResults(id, scene, choice) {
    query(`INSERT INTO results (id, scenario, choice) VALUES ('${id}', '${scene}', '${choice}')`)
}

function getResults(id, response) {
    query(`SELECT * FROM results WHERE id = '${id}'`, results => {
        return response(results)
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
}
insertData();*/

app.get('/', (req, res) => {
    res.sendFile('Scenario1.html', {root: __dirname})
});

app.get('/CSS/background.png', (req, res) => {
    res.sendFile('Res/background.png', {root: __dirname})
});

app.get('/scene', (req, res) => {
    /*    currentScenario = script.makeScene();
        res.send(currentScenario)*/
    makeScene(results => {
        currentScenario = results;
        res.send(currentScenario)
    })
});

app.post('/choice', (req, res) => {
    const option = req.body.option;
    // if the option isn't null add it to the database along with the question
    if (option !== undefined) {
        let id = "fakeID";
        saveResults(id, (JSON.stringify(currentScenario)), option);
    }
    res.send(option !== undefined);
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
