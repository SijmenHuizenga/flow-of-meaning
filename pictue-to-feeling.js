const vision = require('@google-cloud/vision');
const client = new vision.ImageAnnotatorClient();

function getFaceDetails(picturebase64) {
    return client
        .faceDetection({image: {content: picturebase64}})
        .then(results => {
            return results[0].faceAnnotations;
        })
}

exports.getFaceDetails = getFaceDetails