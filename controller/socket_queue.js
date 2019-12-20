//var watson = require('watson-developer-cloud');
var express = require('express');
var app = express();

// experiments with queue
let Queue = require('./Queue');
let jobQueue = new Queue();

// experiments with bee-queue
let BeeQueue = require('bee-queue');
let messageQueue = new BeeQueue('messages')
let job = messageQueue.createJob({foo: "test", bar: "baz"});

job
.timeout(3000)
.retries(2)
.save()
.then((job)=>{
    console.log("somethings happened!");
})

//mongo database models
const {Bot} = require ('../models/bot');
var User_sessions_informations = require ('../models/user_sessions_informations');

//bot objects
var people = {};
var bot_array = {};
var botdata = {};
var botMessage = {};

//let's try Maps instead
let bot_objects = new Map();
let ctext_bot1 = new Map();
let ctext_bot2= new Map();
let ctext_bot1_update = new Map();
let ctext_bot2_update = new Map();


//custom bot ids
let bot_id_1
let bot_id_2

//mongo search var
let clientSearch = {};
let botAuth1 = {}
let botAuth2 = {}

//for context updating 
let context_bot1 = {}
let context_bot1_update = {}
let context_bot2 = {}
let context_bot2_update = {}



function socket(io) {

    io.on('connection', function (socket) {
        
        var room = ('room_' + socket.id); // generate dynamic room name
        socket.join(room);

        bot_id_1 = (socket.id + '_bot1'); // index bot 1 for map
        bot_id_2 = (socket.id + '_bot2'); // index bot 2 for map

        console.log(socket.id + ' connected to room ' + room); // for debuging in console

        console.log('new user connected');

        // is this really needed?
        socket.on('new message', function (msg) {
            var data = {
                message: msg.message,
                username: msg.username,
                data: Date.now()
            };
            io.emit('chat message', data);
        });
        // ^^^ is this really needed? ^^^ 


        socket.on('disconnect', function () {
            console.log('user disconnected');

            // map delete!
            bot_objects.delete(bot_id_1);
            bot_objects.delete(bot_id_2);
        });

        // whole authentication and search for bot records in database begins
        // bot objects are then created
        socket.on('message', async function (message){


            botMessage[socket.id] = JSON.parse(message);

            console.log("message_json_esc: parse " + botMessage[socket.id].userId);
            console.dir(botMessage[socket.id]);

            async function getClientInfo() {  
                try {
                    clientSearch[socket.id] = await User_sessions_informations.findOne({ 'user_id': botMessage[socket.id].userId },).exec();                
                    //console.log("getClientInfo function gives: " + clientSearch[socket.id]);
                } catch(err) {
                    console.log(err);
                }
            }

            async function getBot1Auth() {
                try {
                    botAuth1[socket.id] = await Bot.findOne({ 'name': clientSearch[socket.id].bot1 },).exec();
                    //console.log("getBot1Auth function gives: " + botAuth1[socket.id]);
                } catch(err) {
                    console.log(err);
                }
            }

            async function getBot2Auth() {
                try {
                    botAuth2[socket.id] = await Bot.findOne({ 'name': clientSearch[socket.id].bot2 },).exec();
                    //console.log("getBot2Auth function gives: " + botAuth2[socket.id]);
                } catch(err) {
                    console.log(err);
                }
            }
             
            await getClientInfo();
            await getBot1Auth();
            await getBot2Auth(); 

            bot_objects.set(bot_id_1, new watson.AssistantV1({
                iam_apikey: botAuth1[socket.id].iam_apikey,
                version: '2018-09-20',
                url: 'https://gateway-fra.watsonplatform.net/assistant/api'
            }));

            bot_objects.set(bot_id_2, new watson.AssistantV1({
                iam_apikey: botAuth2[socket.id].iam_apikey,
                version: '2018-09-20',
                url: 'https://gateway-fra.watsonplatform.net/assistant/api'
            }));

            // what happens here? resends the static message back again to client:
            socket.emit('message', people[socket.id], JSON.stringify(botMessage[socket.id])); // send to client
            socket.to(room).emit('message', people[socket.id], JSON.stringify(botMessage[socket.id])); // send to room
            // ^^^^ this isn't needed! just for debugging on client side!^^^^


            ctext_bot1_update.set(bot_id_1);

            console.log("new job for the queue!");
            
            if(!running){
                console.log("nothing in queue, let's do it immediately");
                botCall (bot_objects.get(bot_id_1), botAuth1[socket.id], botMessage[socket.id], 'first');
            }
            // something is in job queue, so let's add it to it
            jobQueue.enqueue(botCall (bot_objects.get(bot_id_1),botAuth1[socket.id], botMessage[socket.id]), 'first');

        })

        socket.on("callSecondBot", function (data) {
            botMessage[socket.id] = JSON.parse(data);

            console.log("new job for the queue!");
            
            if(!running){
                console.log("nothing in queue, let's do it immediately");
                botCall (bot_objects.get(bot_id_2),botAuth2[socket.id], botMessage[socket.id], 'second');
            }
            // something is in job queue, so let's add it to it
            jobQueue.enqueue(botCall (bot_objects.get(bot_id_2), botAuth2[socket.id], botMessage[socket.id], 'second'));

        });

        socket.on("callFirstBot", function (data) {
            botMessage[socket.id] = JSON.parse(data);

            console.log("new job for the queue!");
            
            if(!running){
                console.log("nothing in queue, let's do it immediately");
                botCall (bot_objects.get(bot_id_1), botAuth1[socket.id], botMessage[socket.id], 'first');
            }
            // something is in job queue, so let's add it to it
            jobQueue.enqueue(botCall (bot_objects.get(bot_id_1), botAuth1[socket.id], botMessage[socket.id]), 'first');
            
        });


        
        // async queue action!

        let running = false;

        let botCall = function (botID, botAuth, message, order) {
            running = true;
            let type;

            if (order == 'first'){
                ctext_bot1_update.set(botID, ctext_bot1.get(botID));
                type = "botAnswer";
            }
            if (order == 'second'){
                ctext_bot2_update.set(botID, ctext_bot2.get(botID));
                type = "botAnswer2";
            }

            botID.message({
                workspace_id: botAuth.workspace_id,
                context: ctext_bot1_update.get(botID),
                input: { 'text': JSON.stringify(message.content),
                'options': {
                    'return_context': true
                }}

            }, function (err, response) {
                if (err)
                    console.log('error:', err);
                else {
                    botdata[socket.id] = { // should check if we really need such an array?
                        content: response.output.text,
                        context: ctext_bot1_update.get(botID),
                        type: type,
                        botPhoto: botAuth.image_path
                    }

                    if (order == 'first'){
                        ctext_bot1.set(botID, response.context);
                    }
                    if (order == 'second'){
                        ctext_bot2.set(botID, response.context);
                    }
                    }
                    
                    

                    socket.emit('message', botAuth.name, JSON.stringify(botdata[socket.id]));
                    socket.to(room).emit('message', botAuth.name, JSON.stringify(botdata[socket.id]));

                });


            if (!jobQueue.isEmpty()){
                console.log("job queue isn't empty, let's do the other jobs");
                jobQueue.dequeue();
            } else {
                console.log("job queue is empty!");
                running = false;
            }
        }
    

        

    })
}

module.exports = socket;