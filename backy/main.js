const express = require('express')
const app = express()
const cors = require('cors')
const ptf = require("./pictue-to-feeling")
const bodyParser = require('body-parser')
const port = 3000

// const thingy = require("./tts")


app.use(cors())
app.use(bodyParser.text({limit: '5mb'}));

app.get('/', (req, res) => res.send('Hello Interaction!'))

app.post('/', (req, res) => {
    ptf.getFaceDetails(req.body)
        .then(faces => {
            faces.forEach((face, i) => {
                console.log(face)
            });
            res.send({code: "ok", faces: faces})
        })
        .catch((err) => {
            res.send({code: "err", error: err})
        })
})


app.listen(port, () => console.log(`Example app listening on port ${port}!`))