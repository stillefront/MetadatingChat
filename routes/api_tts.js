var express = require('express');
var app = express();
const router = express.Router();

router.get('/', function(req,res, next)
{
    //für url-argumente
    var url= require('url');
    var q= url.parse(req.url, true).query;
    var request = require("request");
    var auth = 'Basic ' + Buffer.from("apikey" + ':' + "3yJ_E9hsh8dkRD8fbs0V4_kR04XySilX0mKHa0EPHM_H").toString('base64');
    var options = { method: 'GET',
        url: 'https://stream-fra.watsonplatform.net/text-to-speech/api/v1/synthesize',
        qs: { voice: q.voice, text: q.text },
        encoding: null,
        headers:{ 
            'cache-control': 'no-cache',
            Connection: 'keep-alive',
            'Accept-Encoding': 'gzip, deflate',
            Host: 'stream-fra.watsonplatform.net',
            'Postman-Token': 'a1d4cb8e-901e-45b1-a41b-39659a9d562f,e93c3a7d-b467-423f-9f63-0fee98b8871c',
            'Cache-Control': 'no-cache',
            Accept: '*/*',
            'User-Agent': 'PostmanRuntime/7.17.1',
            Authorization: auth } };
    request(options, function (error, response, body) {
        if (error)throw new Error(error);
//        respons
 //       res.write('1: Test<br>');
        res.writeHead(200, { 'Content-Type':'audio/ogg'});
        const buffer = Buffer.from(body, 'binary');
        res.write(buffer,'binary');
        res.end(null, 'binary');
    })
});

module.exports = router;