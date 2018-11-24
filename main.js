const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
const ptf = require("./pictue-to-feeling")
const scentences = require("./scentences")
const port = 3000

// const thingy = require("./tts")

app.use(cors())
app.use(bodyParser.text({limit: '5mb'}));
app.use(express.static('public'))

app.get('/api', (req, res) => res.send('Hello Interaction!'))

app.post('/api', (req, res) => {
    ptf.getFaceDetails(req.body)
        .then(faces => {
            let happy = 0;
            let neutral = 0;
            let sad = 0;
            faces.forEach(face => {
                if (face.joyLikelihood === "LIKELY" || face.joyLikelihood === "VERY_LIKELY") {
                    happy++;
                } else if (face.sorrowLikelihood === "LIKELY" || face.sorrowLikelihood === "VERY_LIKELY") {
                    sad++;
                } else {
                    neutral++;
                }
            });

            let mood = "neutral"
            if(happy > neutral && happy > sad) {
                mood = "happy"
            } else if(neutral > happy && neutral > sad) {
                mood = "neutral"
            } else if(sad > neutral && sad > happy) {
                mood = "sad"
            }

            let possibilities = scentences.data[mood]
            possibilities = possibilities["teens"];
            console.log(possibilities);
            let sentence = possibilities[Math.floor(Math.random() * possibilities.length)];
            console.log("returned : " + sentence)

            res.send({code: "ok", faces: faces, question: sentence})
        })
        .catch((err) => {
            res.send({code: "error", error: err})
        })
})


app.listen(port, () => console.log(`Example app listening on port ${port}!`))