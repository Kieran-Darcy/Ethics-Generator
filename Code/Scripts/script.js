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

/*
scenario = {
    people: {groupA : [GroupA], groupB : [GroupB]},
    crossingType: "crossing" / "red light" / "green light",
    timer: true / false
}
 */

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

function randomPeople(people = createPeople()) {
    let randPeople = [];
    // picks 10 random people
    for(let i = 0; i < 10; i++) {   // pick 10 people randomly
        randPeople.push(people[Math.ceil(Math.random() * (people.length-1))]);
    }
    const variation = Math.round(Math.random()*2); // chooses a random number between 0 - 9
    const peopleA = randPeople.splice(0, 4+variation); // split into group A
    return {groupA : peopleA, groupB : randPeople};  // return groups
}

module.exports.makeScene = makeScenario;