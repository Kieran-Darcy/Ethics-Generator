const express = require('express');
const session = require('express-session');
const mysql = require('mysql');
const app = express();
const port = 80;
app.use(express.static(__dirname));
app.use(express.urlencoded({extended: true}));
let currentScenario = {};
let timer = 0;
app.use(session({
    name: 'sid',
    resave: false,
    saveUninitialized: false,
    secret: 'i,am,a,secret',
    cookie: {
        sameSite: true,
        secure: false,
        maxAge: 1000 * 60 * 60 * 2 // 1s -> 1min -> 1hour -> 2hours
    }
}));

// Create connection
const connection = mysql.createConnection({
    host: "94.192.253.196",
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
    if (!req.session.userID) {
        res.sendFile('register.html', {root: __dirname})
    } else {
        next()
    }
};

const checkOver18 = (req, res, next) => {
    if (!req.session.ofAge) {
        res.send(`
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>
<script>
let o18 = confirm("You need to be over 18 to use this website. \\nPress OK to confirm you are over 18.");
$.post("over18", {ofAge: o18}, data => {
    window.location.href = data;
}
);
</script>`)
    } else {
        next()
    }
};

function sortPeople(groupAB, groupC) {
    let people = groupAB;
    //const variation = Math.round(Math.random() - Math.random()); // chooses a random number between -1 - 1
    const peopleA = people.splice(0, Math.round(people.length / 2) /*+ variation*/); // split into group A
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
    const numOfPeople = 2 + (Math.round(Math.random() * (10 - 2)));
    getPeople(numOfPeople, groupAB => {
        getPeople((numOfPeople > 4) ? 1 + Math.round(Math.random() * (4 - 1)) : 0, groupC => {
            getCrossing(crossing => {
                query(`SELECT COUNT(id) FROM results WHERE id = '${id}'`, count => {
                    return count[0]["COUNT(id)"] < 5 ?
                        response({
                            people: sortPeople(groupAB, groupC),  //  {groupA : [GroupA], groupB : [GroupB], groupC : [GroupC]}
                            crossingType: crossing,  // crossing / green light / red light
                            timer: Math.random() >= 0.5,
                            questionNum: count[0]["COUNT(id)"] + 1   // questions answered
                        }) : response('results.html')
                })
            })
        })
    })
}

function saveResults(id, scene, choice, time) {
    if (time) {
        query(`INSERT INTO results (id, scenario, choice, timer) VALUES ('${id}', '${scene}', '${choice}', ${time})`)
    } else {
        query(`INSERT INTO results (id, scenario, choice) VALUES ('${id}', '${scene}', '${choice}')`)
    }
}

function getResults(id, response) {
    query(`SELECT *
           FROM results`, results => {
        results.forEach(result => {
            result.scenario = JSON.parse(result.scenario)
        });
        return response({results: results, user: id})
    })
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

function getMin(arr) {
    let max = null;
    for (let key in arr) {
        if (max) {
            if (arr[max] > arr[key]) {
                max = key
            }
        } else {
            max = key;
        }
    }
    return max;
}

function getStats(people) {
    let choices = {
        a: 0,
        b: 0,
        c: 0
    };
    let mostKilledAge = {
        Infant: 0,
        Child: 0,
        Adult: 0,
        Elderly: 0
    };
    let mostFavouredAge = {
        Infant: 0,
        Child: 0,
        Adult: 0,
        Elderly: 0
    };
    let mostKilledPerson = {};
    people.forEach(result => {
        if (result.choice === 'a') {
            choices.a++;
            result.scenario.people.groupA.forEach(person => {
                mostKilledAge[person.age]++;
                if (mostKilledPerson[JSON.stringify(person)]) {
                    mostKilledPerson[JSON.stringify(person)]++;
                } else {
                    mostKilledPerson[JSON.stringify(person)] = 1;
                }
            });
            result.scenario.people.groupB.forEach(person => mostFavouredAge[person.age]++);
            result.scenario.people.groupC.forEach(person => mostFavouredAge[person.age]++)
        } else if (result.choice === 'b') {
            choices.b++;
            result.scenario.people.groupB.forEach(person => {
                mostKilledAge[person.age]++;
                if (mostKilledPerson[JSON.stringify(person)]) {
                    mostKilledPerson[JSON.stringify(person)]++;
                } else {
                    mostKilledPerson[JSON.stringify(person)] = 1;
                }
            });
            result.scenario.people.groupA.forEach(person => mostFavouredAge[person.age]++);
            result.scenario.people.groupC.forEach(person => mostFavouredAge[person.age]++)
        } else {
            choices.c++;
            result.scenario.people.groupC.forEach(person => {
                mostKilledAge[person.age]++;
                if (mostKilledPerson[JSON.stringify(person)]) {
                    mostKilledPerson[JSON.stringify(person)]++;
                } else {
                    mostKilledPerson[JSON.stringify(person)] = 1;
                }
            });
            result.scenario.people.groupA.forEach(person => mostFavouredAge[person.age]++);
            result.scenario.people.groupB.forEach(person => mostFavouredAge[person.age]++)
        }
    });
    return {
        mostKilledPerson: JSON.parse(getMax(mostKilledPerson)),
        mostPickedOption: getMax(choices),
        mostHatedAge: getMax(mostKilledAge),
        mostFavouredAge: getMin(mostKilledAge),
        results: people
    }
}

app.get('/', (req, res) => {
    res.sendFile('homepage.html', {root: __dirname})
});

app.get('/scenario1', checkOver18, redirectLogin, (req, res) => {
    res.sendFile('Scenario1.html', {root: __dirname})
});

app.get('/homepage', (req, res) => {
    res.sendFile('homepage.html', {root: __dirname})
});

app.get('/results', checkOver18, (req, res) => {
    res.sendFile('results.html', {root: __dirname})
});

app.get('/getResults', (req, res) => {
    getResults(req.session.userID, results => {
        res.send({
            all : getStats(results.results),
            personal : getStats(results.results.filter(result => {return result.id===results.user}))
        })
    });
});

app.get('/CSS/background.png', (req, res) => {
    res.sendFile('Res/background.png', {root: __dirname})
});

app.get('/scene', (req, res) => {
    makeScene(req.session.userID, results => {
        timer = Date.now();
        currentScenario = results;
        res.send(currentScenario)
    })
});

app.get('/newUser', (req, res) => {
    res.sendFile('register.html', {root: __dirname})
});

app.post('/register', (req, res) => {
    const {username} = req.body;
    if(!(/^[a-zA-Z]/.test(username))) {res.send(false)
    } else {
        checkUser(username.toLowerCase(), exists => {
            if (!exists) {
                req.session.userID = username.toLowerCase();
                res.send(exists)
            } else {
                res.send(exists)
            }
        })
    }

});

app.post('/choice', (req, res) => {
    const {option, timer} = req.body;
    // if the option isn't null add it to the database along with the question
    if (option) {
        saveResults(req.session.userID, (JSON.stringify(currentScenario)), option, timer);    // uncomment when ready
    }
    res.send(option !== undefined);
});

app.post('/over18', (req, res) => {
    const {ofAge} = req.body;
    req.session.ofAge = JSON.parse(ofAge);
    res.send("homepage")
});

app.listen(port, () => console.log(`Starting server at http://localhost:80`));
