
const properties = [
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

function createScenarios() {
    let arr = [];
    for (let i in properties) {
        for (let ages in properties[i]["age"]) {
            for (let genders in properties[i]["gender"]) {
                for (let profs in properties[i]["prof"]) {
                    for (let dis in properties[i]["disability"]) {
                        arr.push([properties[i]["age"][ages], properties[i]["gender"][genders], properties[i]["prof"][profs], properties[i]["disability"][dis]]);
                    }
                }
            }
        }
    }
    return arr;
}

function displayScenarios() {
    const list = document.getElementById("scenarios");
    people.forEach(person => {
        let node = document.createElement("li");
        node.innerHTML = `<ul style="list-style-type: none"><li>Age: ${person[0]}</li><li>Gender: ${person[1]}</li><li>Profession: ${person[2]}</li><li>Disability: ${person[3]}</li><br></ul>`;
        node.id = "person";
        list.appendChild(node);
    });


}

const people = createScenarios();   // people[[age, gender, profession, disability], [..., ..., ..., ....], ...]