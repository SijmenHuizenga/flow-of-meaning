const fs = require('fs');
const textToSpeech = require('@google-cloud/text-to-speech');
const client = new textToSpeech.TextToSpeechClient();
const sanitize = require("sanitize-filename");

function downloadSpeechFile(text) {
    const request = {
        input: {text: text},
        voice: {languageCode: 'en-US', ssmlGender: 'NEUTRAL'},
        audioConfig: {audioEncoding: 'MP3'},
    };

    return client.synthesizeSpeech(request)
        .then(response => {
            let filename = "/sounds/" + sanitize(text) + '.mp3';
            let diskFilename = "public"+filename;

            if(fs.existsSync(diskFilename)) {
                return filename;
            }

            return new Promise((resolve, reject) => {
                fs.writeFile(diskFilename, response[0].audioContent, 'binary', function (err) {
                    if (err){
                        console.log(err)
                        reject(err);
                    }else
                        resolve(filename);
                });
            });
        });
}

exports.downloadSpeechFile = downloadSpeechFile