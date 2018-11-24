const express = require('express')
const app = express()
const port = 3000
const thingy = require("./thingy")

// app.get('/', (req, res) => res.send('Hello World!'))

thingy.main().then(console.log).catch(console.error);

app.listen(port,
    () => console.log(`Example app listening on port ${port}!`)
)