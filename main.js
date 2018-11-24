const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
const ptf = require("./pictue-to-feeling")
const scentences = require("./scentences")
const port = 3000
const tts = require("./tts")

var httpServer;

app.use(cors())
app.use(bodyParser.text({limit: '5mb'}));
app.use(express.static('public'))

app.get('/api', (req, res) => res.send('Hello Interaction!'))

app.post('/api', (req, res) => {
    findMood(req.body)
        .then((data) =>
            Object.assign(data, {question: findQuestion(data.mood)}))
        .then((data) =>
            tts.downloadSpeechFile(data.question)
                .then(filename => Object.assign(data, {filename: filename})))
        .then((data) =>
            res.send(Object.assign(data, {code: "ok"}))
        )
        .catch((err) => {
            res.send({code: "error", error: err})
        })
})

process.on('SIGTERM', function onSigterm() {
    console.info('Got SIGTERM. Graceful shutdown start', new Date().toISOString())
    shutdown()
})

function shutdown() {
    httpServer.close(function onServerClosed(err) {
        if (err) {
            console.error(err)
            process.exit(1)
        }
    })
}

function findQuestion(mood) {
    let possibilities = scentences.data[mood]
    possibilities = possibilities["teens"];
    return possibilities[Math.floor(Math.random() * possibilities.length)];
}

function findMood(imagebase64) {
    return ptf.getFaceDetails(imagebase64)
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
            if (happy > neutral && happy > sad) {
                mood = "happy"
            } else if (neutral > happy && neutral > sad) {
                mood = "neutral"
            } else if (sad > neutral && sad > happy) {
                mood = "sad"
            }
            return {mood: mood, faces: faces};
        });
}

httpServer = require('http').createServer(app);
httpServer.listen(port);