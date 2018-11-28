
var watson = require('watson-developer-cloud');
var express = require('express');
var app = express();

//mongo database models
var Bot = require ('../models/bot');
var User_sessions_informations = require ('../models/user_sessions_informations');

//bot objects
var people = {};
var bot_array = {};
var botdata = {};
var botMessage = {};

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

//and action!

function socket(io) {

    io.on('connection', function (socket) {

        var room = ('room_' + socket.id); // generate dynamic room name
        socket.join(room);

        bot_id_1 = (socket.id + '_bot1');
        bot_id_2 = (socket.id + '_bot2');

        console.log(socket.id + ' connected to room ' + room); //for debuging in console

        console.log('a user connected lala');
        socket.on('new message', function (msg) {
            var data = {
                message: msg.message,
                username: msg.username,
                data: Date.now()
            };
            io.emit('chat message', data);
        });

        socket.on('disconnect', function () {
            console.log('user disconnected');
            delete bot_array.bot_id_1;
            console.log("bot_1 deleted");
            delete bot_array.bot_id_2;
            console.log("bot_2 deleted");
        });

        socket.on('message', async function (message) {
            botMessage[socket.id] = JSON.parse(message);

            console.log("message_json_esc: parse " + botMessage[socket.id].userId);

            async function getClientInfo() {  
                try {
                    clientSearch[socket.id] = await User_sessions_informations.findOne({ 'user_id': botMessage[socket.id].userId },).exec();                
                    console.log("getClientInfo function gives: " + clientSearch[socket.id]);
                } catch(err) {
                    alert(err);
                }
            }

            async function getBot1Auth() {
                try {
                    botAuth1[socket.id] = await Bot.findOne({ 'name': clientSearch[socket.id].bot1 },).exec();
                    console.log("getBot1Auth function gives: " + botAuth1[socket.id]);
                } catch(err) {
                    alert(err);
                }
            }

            async function getBot2Auth() {
                try {
                    botAuth2[socket.id] = await Bot.findOne({ 'name': clientSearch[socket.id].bot2 },).exec();
                    console.log("getBot2Auth function gives: " + botAuth2[socket.id]);
                } catch(err) {
                    alert(err);
                }
            }
             
            await getClientInfo();
            await getBot1Auth();
            await getBot2Auth();        

            console.log("what happend first?");
            bot_array[bot_id_1] = new watson.AssistantV1({
                username: botAuth1[socket.id].username_token, //"0d5046eb-cdff-4aaf-812c-061f7d396d0d", //username1,
                password: botAuth1[socket.id].password_token,//"cIVuLdIRCO4s", //password1, 
                version: '2018-07-10'
            });

            //Watson deklarierung bot
            console.log("credentials for " + botAuth2[socket.id].name + " are " + botAuth2[socket.id].username_token)
            bot_array[bot_id_2] = new watson.AssistantV1({
                username: botAuth2[socket.id].username_token,//"54b3e159-42a3-439b-9829-db3ca57d3f47", //username2,
                password: botAuth2[socket.id].password_token,//"DRMhV1QoPcoY",//password2,
                version: '2018-07-10'
            });

            console.log("what is the bot1 token?" + botAuth1[socket.id].workspace_id_token);

            socket.emit('message', people[socket.id], JSON.stringify(botMessage[socket.id])); // send to client
            socket.to(room).emit('message', people[socket.id], JSON.stringify(botMessage[socket.id])); // send to room

            bot_array[bot_id_1].message({
                workspace_id: botAuth1[socket.id].workspace_id_token, //"fa73acd9-16d4-42cb-935f-d0b13a25395d", //workspace_id1,
                context: context_bot1_update[socket.id],
                input: { 'text': JSON.stringify(botMessage[socket.id].content) }

            }, function (err, response) {
                if (err)
                    console.log('error:', err);
                else
                    botdata[socket.id] = {
                        content: response.output.text,
                        type: 'botAnswer',
                        botPhoto: botAuth1[socket.id].image_path
                    }

                console.log("wann kommt man hier hin? Und funktioniert das? ")
                
                socket.emit('message', botAuth1[socket.id].name, JSON.stringify(botdata[socket.id])); // let bot respond in client
                socket.to(room).emit('message', botAuth1[socket.id].name, JSON.stringify(botdata[socket.id])); // let bot respond to room

            });
        });

        socket.on("callSecondBot", function (data) {
            console.log("bin ich bei callseondbot?")
            botMessage[socket.id] = JSON.parse(data);

            context_bot2_update[socket.id] = context_bot2[socket.id]
            console.log(context_bot2_update[socket.id])

            bot_array[bot_id_2].message({
                workspace_id: botAuth2[socket.id].workspace_id_token, //"65719630-1501-4db2-95db-0448295faabf", //workspace_id2, //workspace_id2,
                context: context_bot2_update[socket.id],
                input: { 'text': JSON.stringify(botMessage[socket.id].content) }

            }, function (err, response) {
                if (err)
                    console.log('error:', err);
                else
                    botdata[socket.id] = {
                        content: response.output.text,
                        type: "botAnswer2",
                        botPhoto: botAuth2[socket.id].image_path
                    }
                context_bot2[socket.id] = response.context;

                socket.emit('message', botAuth2[socket.id].name, JSON.stringify(botdata[socket.id])); // let bot respond
                socket.to(room).emit('message', botAuth2[socket.id].name, JSON.stringify(botdata[socket.id])); // let bot respond
            });
        });

        socket.on("callFirstBot", function (data) {
            console.log("bin ich bei callFirstBot?")

            botMessage[socket.id] = JSON.parse(data);

            context_bot1_update[socket.id] = context_bot1[socket.id];
            console.log(context_bot1_update[socket.id])

            bot_array[bot_id_1].message({
                workspace_id: botAuth1[socket.id].workspace_id_token, //"fa73acd9-16d4-42cb-935f-d0b13a25395d", //workspace_id1,
                context: context_bot1_update[socket.id],
                input: { 'text': JSON.stringify(botMessage[socket.id].content) }

            }, function (err, response) {
                if (err)
                    console.log('error:', err);
                else
                    botdata[socket.id] = {
                        content: response.output.text,
                        type: "botAnswer",
                        botPhoto: botAuth1[socket.id].image_path
                    }

                context_bot1[socket.id] = response.context;

                socket.emit('message', botAuth1[socket.id].name, JSON.stringify(botdata[socket.id])); // let bot respond
                socket.to(room).emit('message', botAuth1[socket.id].name, JSON.stringify(botdata[socket.id])); // let bot respond
            });
        })
    });
};

module.exports = socket;
