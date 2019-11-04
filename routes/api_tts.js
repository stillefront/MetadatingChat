var express = require('express');
var app = express();
const router = express.Router();
var rp = require('request-promise');
const xmlbuilder = require('xmlbuilder');

authToken = "";

router.get('/', function(req,res, next)
{
    var url= require('url');
    var q= url.parse(req.url, true).query;
    
    let xml_body = xmlbuilder.create('speak')
    .att('version', '1.0')
    .att('xml:lang', 'en-us')
    .ele('voice')
    .att('xml:lang', 'en-us')
    .att('name', q.voice)
    .txt(q.text)
    .end();

    // Convert the XML into a string to send in the TTS request.
    var ttsBody = xml_body.toString();

    let options = {
        method: 'POST',
        baseUrl: 'https://westus.tts.speech.microsoft.com/',
        url: 'cognitiveservices/v1',
        headers: {
            'Authorization': 'Bearer ' + authToken,
            'cache-control': 'no-cache',
            'User-Agent': 'YOUR_RESOURCE_NAME',
            'X-Microsoft-OutputFormat': 'riff-24khz-16bit-mono-pcm',
            'Content-Type': 'application/ssml+xml'
        },
        body: xml_body.toString(),
        encoding: null
    }

    success = false;
    rp(options)
        .then(function(body){
            // fetched audio from ms azure, return it to user
            res.writeHead(200, { 'Content-Type':'audio/x-wav'});
            const buffer = Buffer.from(body, 'binary');
            res.write(body,'binary');
            res.end(null, 'binary');
        })
        .catch(function(err){
            // could not fetch content from azure
            if( err.statusCode == 401 ){
                // authentication error, try to get another auth token
                console.log("fetch new auth token for microsoft azure and try again") ;

                let optionsAuth = {
                    method: "POST",
                    baseUrl: "https://westus.api.cognitive.microsoft.com",
                    url: "sts/v1.0/issueToken",
                    headers: {
                        "Ocp-Apim-Subscription-Key": "5cbc8bc72f534656a469df9e33e6040d"
                    }
                };

                rp(optionsAuth)
                    .then(function(body){
                        // authentication succesful, try fetch audio once again
                        authToken = body;
                        console.log("got ms azure authentication token. do tts request to azure again");

                        let options = {
                            method: 'POST',
                            baseUrl: 'https://westus.tts.speech.microsoft.com/',
                            url: 'cognitiveservices/v1',
                            headers: {
                                'Authorization': 'Bearer ' + authToken,
                                'cache-control': 'no-cache',
                                'User-Agent': 'YOUR_RESOURCE_NAME',
                                'X-Microsoft-OutputFormat': 'riff-24khz-16bit-mono-pcm',
                                'Content-Type': 'application/ssml+xml'
                            },
                            body: xml_body.toString(),
                            encoding: null
                        }

                        rp(options)
                            .then(function(body){
                                // fetched audio from ms azure, return it to user
                                res.writeHead(200, { 'Content-Type':'audio/x-wav'});
                                const buffer = Buffer.from(body, 'binary');
                                res.write(body,'binary');
                                res.end(null, 'binary');
                            })
                            .catch(function(err){
                                // fetching audio failed a second time, this time return error
                                res.writeHead(500);
                                res.write("second request to ms azure failed");
                                console.log("second request to azure failed with status " + err.statusCode);
                                res.end();
                            });
                    })
                    .catch(function(err){
                        // authentication failed
                        res.write("authentication failed");
                        console.log("authentication failed");
                        res.end();
                    });
            } else{
                // first request to ms tts failed with an error that was not an authorization error. 
                // so this request should just fail.
                res.writeHead(500);
                res.write("External API returns status " + err.statusCode);
                res.end();
            }
        });
});

module.exports = router;