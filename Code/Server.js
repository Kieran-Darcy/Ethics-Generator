const express = require('express')
const mysql = require('mysql')
const app = express()
const port = 80

let con =

app.use(express.static(__dirname))
app.get('/', (req, res) => {
    res.sendFile('ScenarioGenerator.html', {root: __dirname})
})
app.listen(port, () => console.log(`Example app listening on port ${port}!`))