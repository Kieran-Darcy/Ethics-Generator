const express = require('express');
const session = require('express-session');
const mysql = require('mysql');
const app = express();
const port = 80;
app.use(express.static(__dirname));
app.use(express.urlencoded({extended: true}));
let currentScenario = {};
app.use(session({
    name: 'sid',
    resave: false,
    saveUninitialized: false,
    secret: 'i,am,a,secret',
    cookie: {
        sameSite: true,
        secure: false,
        maxAge: undefined   //1000 * 60 * 60 * 2 // 1s -> 1min -> 1hour -> 2hours
    }
}));

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

const redirectLogin = (req, res, next) => {
    req.session.userID = 'fakeuser';    // please delete when production ready
    if(!req.session.userID) {
        res.sendFile('register.html', {root: __dirname})
    } else {
        next()
    }
};

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
        return (!request) ? null : request(results);
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
function makeScene(id, response) {
    const numOfPeople = 2+(Math.round(Math.random()*(10-2)));
    getPeople(numOfPeople, groupAB => {
        getPeople((numOfPeople > 4) ? 1+Math.round(Math.random()*(4-1)) : 0, groupC => {
            getCrossing(crossing => {
                query(`SELECT COUNT(id) FROM results WHERE id = '${id}'`,count => {
                    return count > 15 ?
                    response({
                        people: sortPeople(groupAB, groupC),  //  {groupA : [GroupA], groupB : [GroupB], groupC : [GroupC]}
                        crossingType: crossing,  // crossing / green light / red light
                        timer: Math.random() >= 0.5,
                        questionNum: count+1   // questions answered
                    }) : response('results.html')
                })
            })
        })
    })
}

function saveResults(id, scene, choice) {
    query(`INSERT INTO results (id, scenario, choice) VALUES ('${id}', '${scene}', '${choice}')`)
}

function getResults(id, response) {
    if(!id) {
        query(`SELECT * FROM results`, results => {
            results.forEach(result => {
                result.scenario = JSON.parse(result.scenario)
            });
            return response(results)
        })
    } else {
        query(`SELECT * FROM results WHERE id = '${id}'`, results => {
            results.forEach(result => {
                result.scenario = JSON.parse(result.scenario)
            });
            return response(results)
        })
    }
}

function checkUser(username, response) {
    query(`SELECT id FROM results WHERE id = '${username}'`, result => {
        return response(result[0])
    })
}

function getMax(arr) {
    let max = null;
    for (let key in arr) {
        if (max) {
            if (arr[max] < arr[key]) {
                max = key
            }
        } else {
            max = key;
        }
    }
    return max;
}

function mostHated(people) {
    let count = {};
    people.forEach(result => {
        if (result.choice === 'a') {
            result.scenario.people.groupA.forEach(person => {
                if (count[JSON.stringify(person)]) {
                    count[JSON.stringify(person)]++;
                } else {
                    count[JSON.stringify(person)] = 1;
                }
            })
        } else if (result.choice === 'b') {
            result.scenario.people.groupB.forEach(person => {
                if (count[JSON.stringify(person)]) {
                    count[JSON.stringify(person)]++;
                } else {
                    count[JSON.stringify(person)] = 1;
                }
            })
        } else {
            result.scenario.people.groupC.forEach(person => {
                if (count[JSON.stringify(person)]) {
                    count[JSON.stringify(person)]++;
                } else {
                    count[JSON.stringify(person)] = 1;
                }
            })
        }
    });
    return JSON.parse(getMax(count))
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

app.get('/', redirectLogin, (req, res) => {
    res.sendFile('Scenario1.html', {root: __dirname})
});

app.get('/scenario1', redirectLogin, (req, res) => {
    res.sendFile('Scenario1.html', {root: __dirname})
});

app.get('/homepage', (req, res) => {
    res.sendFile('homepage.html', {root: __dirname})
});

app.get('/results', redirectLogin, (req, res) => {
    res.sendFile('results.html', {root: __dirname})
});

app.get('/getResults', (req, res) => {
    getResults(req.session.userID, results => {
        res.send(mostHated(results))
    });
});

app.get('/CSS/background.png', (req, res) => {
    res.sendFile('Res/background.png', {root: __dirname})
});

app.get('/scene', (req, res) => {
    makeScene(req.session.userID,results => {
        currentScenario = results;
        res.send(currentScenario)
    })
});

app.post('/register', (req, res) => {
    const {username} = req.body;
    checkUser(username.toLowerCase(), exists => {
        if (!exists) {
            req.session.userID = username.toLowerCase();
            res.send(exists)
        } else {
            res.send(exists)
        }
    })
});

app.post('/choice', (req, res) => {
    const option = req.body.option;
    // if the option isn't null add it to the database along with the question
    if (option) {
       //saveResults(req.session.userID, (JSON.stringify(currentScenario)), option);    // uncomment when ready
    }
    res.send(option !== undefined);
});

app.listen(port, () => console.log(`Starting server at http://localhost:80`));
