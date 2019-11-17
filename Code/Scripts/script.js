const conditionP = [ // Conditions for People
    {
        age: ["infant"],
        gender: ["male", "female"],
        prof: ["standard"],
        disability: ["none"]
    },
    {
        age: ["child"],
        gender: ["male", "female"],
        prof: ["standard"],
        disability: ["none", "wheelchair", "blind", "crutches"]
    },
    {
        age: ["adult"],
        gender: ["male", "female"],
        prof: ["standard", "homeless", "business person"],
        disability: ["none", "wheelchair", "blind", "crutches"]
    },
    {
        age: ["elderly"],
        gender: ["male", "female"],
        prof: ["standard", "homeless", "business person"],
        disability: ["none", "wheelchair", "blind", "crutches"]
    }
];

let condition2PS = { // Conditions for 2 Person Scenarios
    people: createPeople2(createPeople()),  //  [[personA, personB], [..., ...], ...]
    crossingType: ["crossing", "red light", "green light"],
    timer: [true, false]
};


function createPeople() {   // create people
    let arr = [];
    for (let i in conditionP) {
        for (let ages in conditionP[i]["age"]) {
            for (let genders in conditionP[i]["gender"]) {
                for (let profs in conditionP[i]["prof"]) {
                    for (let dis in conditionP[i]["disability"]) {
                        //                  [Age,                           Gender,                         Profession,                     Disability]
                        arr.push([conditionP[i]["age"][ages], conditionP[i]["gender"][genders], conditionP[i]["prof"][profs], conditionP[i]["disability"][dis]]);
                    }
                }
            }
        }
    }
    return arr;
}

function createPeople2(people) {  // create pairs of people
    let arr = [];
    for (let personA = 0; personA < people.length-1; personA++) {
        for(let personB = personA+1; personB < people.length; personB++) {
            arr.push([people[personA], people[personB]]);
        }
    }
    return arr;
}

function createSceneVars2P() {
    let scenario = [];
    for(let person = 0; person < condition2PS["people"].length; person++) {
        for(let crossType = 0; crossType < condition2PS["crossingType"].length; crossType++) {
            for(let timed = 0; timed < condition2PS["timer"].length; timed++) {
                scenario.push([condition2PS["people"][person][0], condition2PS["people"][person][1], condition2PS["crossingType"][crossType], condition2PS["timer"][timed]]);
            }
        }
    }
    return scenario;
}

function displayScene2P(scenes) {
    const list = document.getElementById("scenarios");
    scenes.forEach(scene => {
        let node = document.createElement("li");
        node.innerHTML = `You're approaching a ${scene[2]}, your unable to stop, you can turn left and kill an ${scene[0][0]} or turn right and kill an ${scene[1][0]}.`;
        list.appendChild(node);
    });
}

// people = createPeople();   // people[[age, gender, profession, disability], [..., ..., ..., ....], ...]
function start() {
    const sceneVars2P = createSceneVars2P();  // scenario2P[[personA, personB, crossingType, timer], [..., ..., ..., ...], ...]
    displayScene2P(sceneVars2P);
}
