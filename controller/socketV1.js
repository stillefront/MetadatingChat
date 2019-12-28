
var watson = require('watson-developer-cloud');
var express = require('express');
var app = express();

//mongo database models
const {Bot} = require ('../models/bot');
var User_sessions_informations = require ('../models/user_sessions_informations');

//bot objects
var people = {};
var botdata = {};
var botMessage = {};

//let's try Maps instead
let bot_objects = new Map();
let ctext_bot1 = new Map();
let ctext_bot2= new Map();
let ctext_bot1_update = new Map();
let ctext_bot2_update = new Map();


let bot_names = new Map();

//custom bot ids
var bot_id_1
var bot_id_2


//mongo search var
var clientSearch = {};
var botAuth1 = {}
var botAuth2 = {}

//for context updating 
var context_bot1 = {}
var context_bot1_update = {}
var context_bot2 = {}
var context_bot2_update = {}



function socket(io) {

    io.on('connection', function (socket) {

        var room = ('room_' + socket.id); // generate dynamic room name
        socket.join(room);

        bot_id_1 = (socket.id + '_bot1');
        bot_id_2 = (socket.id + '_bot2');

        console.log(socket.id + ' connected to room ' + room); //for debuging in console

        console.log('new user connected');

        
        socket.on('disconnect', function () {
            console.log('user disconnected');

            // map delete!
            bot_objects.delete(bot_id_1);
            bot_objects.delete(bot_id_2);

            bot_names.delete(bot_id_1);
            bot_names.delete(bot_id_2);

            /*
            delete bot_array.bot_id_1;
            console.log("bot_1 deleted");
            delete bot_array.bot_id_2;
            console.log("bot_2 deleted");
            */
        });

        socket.on('message', async function (message) {
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


            // approach with map:

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

            // save names for debugging:
            bot_names.set(bot_id_1, botAuth1[socket.id].name);
            bot_names.set(bot_id_2, botAuth2[socket.id].name);

            // list all saved bots from map [bot_id] : [name]:

            for (let elem of bot_names.entries()) {
                console.log(`${elem[0]}: ${elem[1]}`);
                };
            
            

           socket.emit('message', people[socket.id], JSON.stringify(botMessage[socket.id])); // send to client
           socket.to(room).emit('message', people[socket.id], JSON.stringify(botMessage[socket.id])); // send to room

           ctext_bot1_update.set(bot_id_1);

            bot_objects.get(bot_id_1).message({
                workspace_id: botAuth1[socket.id].workspace_id, //"fa73acd9-16d4-42cb-935f-d0b13a25395d", //workspace_id1,
                context: ctext_bot1_update.get(bot_id_1), // context: context_bot1_update[socket.id]
                input: { 'text': JSON.stringify(botMessage[socket.id].content),
                'options': {
                    'return_context': true
                } }

            }, function (err, response) {
                if (err)
                    console.log('error:', err);
                else
                    botdata[socket.id] = {
                        content: response.output.text,
                        type: 'botAnswer',
                        botPhoto: botAuth1[socket.id].image_path
                    }
                
                console.log("initial message");
                console.dir("context_bot1:" + JSON.stringify(ctext_bot1_update.get(bot_id_1)));
                
                
                
                socket.emit('message', botAuth1[socket.id].name, JSON.stringify(botdata[socket.id])); // let bot respond in client
                socket.to(room).emit('message', botAuth1[socket.id].name, JSON.stringify(botdata[socket.id])); // let bot respond to room

            });
        });

        socket.on("callSecondBot", function (data) {
            botMessage[socket.id] = JSON.parse(data); 
            
            //!!
            // empfangene messages werden wirklich jedes mal überschrieben, da sie nicht an eine botID oder SocketID gebunden sind!
            //!!


            //context_bot2_update[socket.id] = context_bot2[socket.id]
            ctext_bot2_update.set(bot_id_2, ctext_bot2.get(bot_id_2));

            console.dir("context_bot2:" + JSON.stringify(ctext_bot2.get(bot_id_2)));

            bot_objects.get(bot_id_2).message({
                workspace_id: botAuth2[socket.id].workspace_id, //"65719630-1501-4db2-95db-0448295faabf", //workspace_id2, //workspace_id2,
                context: ctext_bot2_update.get(bot_id_2), // context: context_bot2_update[socket.id]
                input: { 'text': JSON.stringify(botMessage[socket.id].content),
                'options': {
                    'return_context': true
                } }

            }, function (err, response) {
                if (err)
                    console.log('error:', err);
                else
                    botdata[socket.id] = {
                        content: response.output.text,
                        type: "botAnswer2",
                        botPhoto: botAuth2[socket.id].image_path
                    }
                //context_bot2[socket.id] = response.context;
               ctext_bot2.set(bot_id_2, response.context);
                
                console.log(bot_names.get(bot_id_2) + " called");
                console.dir("context bot2" + JSON.stringify(ctext_bot2_update.get(bot_id_2)));

                socket.emit('message', botAuth2[socket.id].name, JSON.stringify(botdata[socket.id])); // let bot respond
                socket.to(room).emit('message', botAuth2[socket.id].name, JSON.stringify(botdata[socket.id])); // let bot respond
            });
        });

        socket.on("callFirstBot", function (data) {

            botMessage[socket.id] = JSON.parse(data);
            

            //context_bot1_update[socket.id] = context_bot1[socket.id];
            //console.log(context_bot1_update[socket.id])

            ctext_bot1_update.set(bot_id_1, ctext_bot1.get(bot_id_1));

            console.log(bot_names.get(bot_id_1) + " called");
            console.dir("context bot1" + JSON.stringify(ctext_bot1.get(bot_id_1)));

            bot_objects.get(bot_id_1).message({ // bot_array[bot_id_1].message({ 
                workspace_id: botAuth1[socket.id].workspace_id, //"fa73acd9-16d4-42cb-935f-d0b13a25395d", //workspace_id1,
                context: ctext_bot1_update.get(bot_id_1),
                input: { 'text': JSON.stringify(botMessage[socket.id].content),
                'options': {
                    'return_context': true
                }}

            }, function (err, response) {
                if (err)
                    console.log('error:', err);
                else
                    botdata[socket.id] = {
                        content: response.output.text,
                        type: "botAnswer",
                        botPhoto: botAuth1[socket.id].image_path
                    }

                //context_bot1[socket.id] = response.context; // vlt. fängt es an hier zu brennen?
                ctext_bot1.set(bot_id_1, response.context); //er bekommt am anfang gar keinen response?!

                //debug
                console.log(bot_names.get(bot_id_1) + " called");
                console.dir("context bot1" + JSON.stringify(ctext_bot1.get(bot_id_1)));

                console.dir(botdata[socket.id]);
                

                socket.emit('message', botAuth1[socket.id].name, JSON.stringify(botdata[socket.id])); // let bot respond
                socket.to(room).emit('message', botAuth1[socket.id].name, JSON.stringify(botdata[socket.id])); // let bot respond
            });
        })
    });
};

module.exports = socket;