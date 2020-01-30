const conditionP = [ // Conditions for People
    {
        age: ["infant"],
        gender: ["male", "female"],
        prof: [""],
        disability: [""]
    },
    {
        age: ["child"],
        gender: ["male", "female"],
        prof: [""],
        disability: ["", "wheelchair", "blind", "crutches"]
    },
    {
        age: ["adult"],
        gender: ["male", "female"],
        prof: ["", "homeless", "business person"],
        disability: ["", "wheelchair", "blind", "crutches"]
    },
    {
        age: ["elderly"],
        gender: ["male", "female"],
        prof: ["", "homeless", "business person"],
        disability: ["", "wheelchair", "blind", "crutches"]
    }
];

const crossings = ["crossing", "red light", "green light"];

function Person(age, gender, profession, disability) {
    this.age = age;
    this.gender = gender;
    this.profession = profession;
    this.disability = disability;
}

/*function makeCondition2PS() {
    return { // Conditions for 2 Person Scenarios
        people: createPeople2(),  //  [[personA, personB], [..., ...], ...]
        crossingType: ["crossing", "red light", "green light"],
        timer: [true, false]
    }
}*/

function makeScenario() {
    return { // Conditions for 2 group Scenarios
        people: randomPeople(),  //  {groupA : [GroupA], groupB : [GroupB]}
        crossingType: crossings[Math.floor(Math.random()*crossings.length)],
        timer: Math.random() >= 0.5
    }
}

function createPeople() {   // create people -  [Person(Age, Gender, Profession, Disability), Person(...), ...]
    let arr = [];
    for (let i = 0; i < conditionP.length; i++) {
        for (let ages = 0; ages < conditionP[i]["age"].length; ages++) {
            for (let genders = 0; genders < conditionP[i]["gender"].length; genders++) {
                for (let profs = 0; profs < conditionP[i]["prof"].length; profs++) {
                    for (let dis = 0; dis < conditionP[i]["disability"].length; dis++) {
                        //                  [Age,                           Gender,                         Profession,                     Disability]
                        arr.push(new Person(conditionP[i]["age"][ages], conditionP[i]["gender"][genders], conditionP[i]["prof"][profs], conditionP[i]["disability"][dis]))
                    }
                }
            }
        }
    }
    return arr
}

function randomPeople(people = createPeople()) { //fix!!!
    let randPeople = [];
    for(let i = 0; i < 10; i++) {   // pick 10 people randomly
        randPeople.push(people[Math.ceil(Math.random() * (people.length-1))]);
    }

    // make split point at index 5 - 8???
    const half = Math.ceil(Math.random() * randPeople.length-1);
    const peopleA = randPeople.splice(0, half); // split into group A
    return {groupA : peopleA, groupB : randPeople};  // return groups
}

/*
// takes an array of Person objects
function createPeople2(people = createPeople()) {  // create pairs of people
    let arr = [];
    for (let personA = 0; personA < people.length - 1; personA++) {
        for (let personB = personA + 1; personB < people.length; personB++) {
            arr.push([people[personA], people[personB]])
        }
    }
    return arr
}

// takes makeCondition2PS() as a parameter
function createSceneVars2P(condition2PS = makeCondition2PS()) {
    let scenario = [];
    for (let person = 0; person < condition2PS["people"].length; person++) {
        for (let crossType = 0; crossType < condition2PS["crossingType"].length; crossType++) {
            for (let timed = 0; timed < condition2PS["timer"].length; timed++) {
                scenario.push([condition2PS["people"][person][0], condition2PS["people"][person][1], condition2PS["crossingType"][crossType], condition2PS["timer"][timed]])
            }
        }
    }
    return scenario
}

let peeps = [];
let num = 0;

function displayScene2P(scenes = createSceneVars2P()) {
    const list = document.getElementById("scenarios");
    scenes.forEach(scene => {
        let li = document.createElement("li");
        const personA = `(AgeGroup: <strong>${scene[0].age}</strong>, Gender: <strong>${scene[0].gender}</strong>, Profession: <strong>${scene[0].profession}</strong>, Disability: <strong>${scene[0].disability}</strong>)`;
        const personB = `(AgeGroup: <strong>${scene[1].age}</strong>, Gender: <strong>${scene[1].gender}</strong>, Profession: <strong>${scene[1].profession}</strong>, Disability: <strong>${scene[1].disability}</strong>)`;
        li.innerHTML = `You're approaching a <strong>${scene[2]}</strong> and see a pedestrian ahead, so the car goes to brake, when suddenly the brakes in the car stop working; the car has 3 options: <br> A = Proceed in the same lane and Kill <span id="a${num}" onmouseover="displayPerson(this)" onmouseout="revertDisplay(this)">PersonA</span> <br> B = Swerve to other side of road and Kill <span id="b${num}" onmouseover="displayPerson(this)" onmouseout="revertDisplay(this)" >PersonB</span> <br> C = Swerve into a building and Kill Yourself <br> Time = <strong>${scene[3]}</strong>`;
        list.appendChild(li);
        list.appendChild(document.createElement("br"));
        num++;
        peeps.push([personA, personB])
    })
}

function displayPerson(tag, p = peeps) {
    const id = tag.id;
    if (id[0] === "a") {
        tag.innerHTML = p[id.slice(1, id.length)][0];
        console.log(tag.innerHTML)
    } else {
        tag.innerHTML = p[id.slice(1, id.length)][1];
        console.log(tag.innerHTML)
    }
}

function revertDisplay(tag) {
    const id = tag.id;
    if (id[0] === "a") {
        tag.innerHTML = "PersonA";
        console.log(tag.innerHTML)
    } else {
        tag.innerHTML = "PersonB";
        console.log(tag.innerHTML)
    }
}*/

module.exports.makeScene = makeScenario;