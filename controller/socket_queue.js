// sources:
// https://cloud.ibm.com/apidocs/assistant/assistant-v2?code=node
// https://docs.google.com/spreadsheets/d/1QKZFLldQtYRXabLBym-oeTAs6VrhUeX9DeMMxKZ7BV8/edit#gid=0



// watson assistant auth + sdk
const AssistantV2 = require('ibm-watson/assistant/v2');
const { IamAuthenticator } = require('ibm-watson/auth');

// map for storing the bot instances and their session IDs
let assistantList = new Map();
let sessionList = new Map();

let express = require('express');
let app = express();

//mongo database models – should also be corrected for new authentication
const {Bot} = require ('../models/bot');
let User_sessions_informations = require ('../models/user_sessions_informations');

// blown up stuff, which should be ommitted as soon as possible
let botMessage = {};
let clientSearch = {};
let botAuth1 = {};
let botAuth2 = {};
let botdata = {};



// experimentation with bee-queue
const Queue = require('bee-queue');
const addQueue = new Queue('addition');




function socket(io) {

    // a room name is generated for the chosen bots on connection
    io.on('connection', function (socket){
        let room = ('room_' + socket.id);
        socket.join(room);

        bot_id_1 = (socket.id + '_bot1');
        bot_id_2 = (socket.id + '_bot2');

        console.log('new user connected');
        console.log(socket.id + ' connected to room ' + room);

        socket.on('disconnect', function () {
            console.log(socket.id + 'user disconnected');

            // delete bots
            assistantList.delete(bot_id_1);
            assistantList.delete(bot_id_2);

        });

        socket.on('message', async function (message){
            botMessage[socket.id] = JSON.parse(message);

            // queue stuff
            const job = addQueue.createJob(message);
            job
            .timeout(3000)
            .retries(2)
            .save()
            .then((job) => {
                console.log("hier ist was tolles passiert!");
            });

            addQueue.process(function (job, done){
              console.log('processing job ' + job.id);
              return done(null, JSON.parse(job.message));
            })
            

            console.log("message_json_esc: parse " + botMessage[socket.id].userId);
            console.dir(botMessage[socket.id]);

            async function getClientInfo() {  
                try {
                    clientSearch[socket.id] = await User_sessions_informations.findOne({ 'user_id': botMessage[socket.id].userId },).exec();                
                } catch(err) {
                    console.log(err);
                }
            }

            async function getBot1Auth() {
                try {
                    botAuth1[socket.id] = await Bot.findOne({ 'name': clientSearch[socket.id].bot1 },).exec();
                } catch(err) {
                    console.log(err);
                }
            }

            async function getBot2Auth() {
                try {
                    botAuth2[socket.id] = await Bot.findOne({ 'name': clientSearch[socket.id].bot2 },).exec();
                } catch(err) {
                    console.log(err);
                }
            }
             
            await getClientInfo();
            await getBot1Auth();
            await getBot2Auth();
            
            
            // using new authentication strategy for AssistantV2:
          
            const bot1 = new AssistantV2 ({
                version: '2019-02-28',
                authenticator: new IamAuthenticator({
                  apikey: botAuth1[socket.id].iam_apikey,
                }),
                url: 'https://api.eu-de.assistant.watson.cloud.ibm.com',
                disableSslVerification: true, // disabling ssl verification for now
              });

            const bot2 = new AssistantV2 ({
                version: '2019-02-28',
                authenticator: new IamAuthenticator({
                  apikey: botAuth2[socket.id].iam_apikey,
                }),
                url: 'https://api.eu-de.assistant.watson.cloud.ibm.com',
                disableSslVerification: true,
              });

            assistantList.set(bot_id_1, bot1);
            assistantList.set(bot_id_2, bot2);
         
            
            // creating sessions for the respective bots:
            
            bot1.createSession({
                assistantId: botAuth1[socket.id].workspace_id
            })
            .then(res => {
                console.log(JSON.stringify(res.result.session_id, null, 2));
                sessionList.set(bot_id_1, res.result.session_id);

                // create message as soon as session is created:
                assistantList.get(bot_id_1).message({
                    assistantId: botAuth1[socket.id].workspace_id,
                    sessionId: sessionList.get(bot_id_1),
                    input: {
                      'message_type': 'text',
                      'text': JSON.stringify(botMessage[socket.id].content)
                      }
                    })
                    .then(res => {
                      console.log(JSON.stringify(res.result.output.generic, null, 2));
                      botdata[socket.id] = {
                        content: res.result.output.generic[0].text,
                        type: 'botAnswer',
                        botPhoto: botAuth1[socket.id].image_path
                      }

                      socket.emit('message', botAuth1[socket.id].name, JSON.stringify(botdata[socket.id])); // let bot respond in client
                      socket.to(room).emit('message', botAuth1[socket.id].name, JSON.stringify(botdata[socket.id])); // let bot respond to room
                    })
                    .catch(err => {
                      console.log(err);
                    });

            })
            .catch(err => {
                console.log(err);
            });
            

            bot2.createSession({
                assistantId: botAuth2[socket.id].workspace_id
            })
            .then(res => {
                console.log(JSON.stringify(res.result.session_id, null, 2));
                sessionList.set(bot_id_2, res.result.session_id);
            })
            .catch(err => {
                console.log(err);
            });

        })


        socket.on("callSecondBot", function (data) {
            
            botMessage[socket.id] = JSON.parse(data);

            assistantList.get(bot_id_2).message({
                assistantId: botAuth2[socket.id].workspace_id,
                sessionId: sessionList.get(bot_id_2),
                input: {
                  'message_type': 'text',
                  'text': JSON.stringify(botMessage[socket.id].content)
                  }
                })
                .then(res => {
                  console.log(JSON.stringify(res.result.output.generic, null, 2));
                  botdata[socket.id] = {
                    content: res.result.output.generic[0].text,
                    type: 'botAnswer2',
                    botPhoto: botAuth1[socket.id].image_path
                  }

                  socket.emit('message', botAuth2[socket.id].name, JSON.stringify(botdata[socket.id])); // let bot respond in client
                  socket.to(room).emit('message', botAuth2[socket.id].name, JSON.stringify(botdata[socket.id])); // let bot respond to room
                })
                .catch(err => {
                  console.log(err);
                });


        })

        socket.on("callFirstBot", function (data) {

            botMessage[socket.id] = JSON.parse(data);

            assistantList.get(bot_id_1).message({
                assistantId: botAuth1[socket.id].workspace_id,
                sessionId: sessionList.get(bot_id_1),
                input: {
                  'message_type': 'text',
                  'text': JSON.stringify(botMessage[socket.id].content)
                  }
                })
                .then(res => {
                  console.log(JSON.stringify(res.result.output.generic, null, 2));
                  botdata[socket.id] = {
                    content: res.result.output.generic[0].text,
                    type: 'botAnswer',
                    botPhoto: botAuth1[socket.id].image_path
                  }

                  socket.emit('message', botAuth1[socket.id].name, JSON.stringify(botdata[socket.id])); // let bot respond in client
                  socket.to(room).emit('message', botAuth1[socket.id].name, JSON.stringify(botdata[socket.id])); // let bot respond to room
                })
                .catch(err => {
                  console.log(err);
                });
        })



    })

    
}

module.exports = socket;

