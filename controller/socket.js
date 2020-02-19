// sources:
// https://cloud.ibm.com/apidocs/assistant/assistant-v2?code=node
// https://docs.google.com/spreadsheets/d/1QKZFLldQtYRXabLBym-oeTAs6VrhUeX9DeMMxKZ7BV8/edit#gid=0

// watson assistant auth + sdk
const AssistantV2 = require('ibm-watson/assistant/v2');
const { IamAuthenticator } = require('ibm-watson/auth');

let express = require('express');
let app = express();

//mongo database models – should also be corrected for new authentication
const {Bot} = require ('../models/bot');
let User_sessions_informations = require ('../models/user_sessions_informations');


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
        });

        socket.on('message', async function (message){

            socket.botMessage = JSON.parse(message);
            console.dir("socket save: " + socket.botMessage.userId);

           

            async function getClientInfo() {  
                try {
                    socket.clientSearch = await User_sessions_informations.findOne({ 'user_id': socket.botMessage.userId },).exec();                
                } catch(err) {
                    console.log(err);
                }
            }

            async function getBot1Auth() {
                try {
                    socket.botAuth1 =  await Bot.findOne({ 'name': socket.clientSearch.bot1 },).exec();
                } catch(err) {
                    console.log(err);
                }
            }

            async function getBot2Auth() {
                try {
                    socket.botAuth2 =  await Bot.findOne({ 'name': socket.clientSearch.bot2 },).exec();
                } catch(err) {
                    console.log(err);
                }
            }
             
            await getClientInfo();
            await getBot1Auth();
            await getBot2Auth();

            console.dir("clientSearch: " + socket.clientSearch);
            console.dir("botAuth1: " + socket.botAuth1);
            console.dir("botAuth2: " + socket.botAuth2);
            
            
            // using new authentication strategy for AssistantV2:
          
            const bot1 = new AssistantV2 ({
                version: '2019-02-28',
                authenticator: new IamAuthenticator({
                  apikey: socket.botAuth1.apikey,
                }),
                url: 'https://api.eu-de.assistant.watson.cloud.ibm.com',
                disableSslVerification: true, // disabling ssl verification for now
              });

            const bot2 = new AssistantV2 ({
                version: '2019-02-28',
                authenticator: new IamAuthenticator({
                  apikey: socket.botAuth2.apikey,
                }),
                url: 'https://api.eu-de.assistant.watson.cloud.ibm.com',
                disableSslVerification: true,
              });

            // experimenting with socket session
            socket.bot1 = bot1;
            socket.bot2 = bot2;
         
            
            // creating sessions for the respective bots:
            
            bot1.createSession({
                assistantId: socket.botAuth1.assistant_id
            })
            .then(res => {
                console.log(JSON.stringify(res.result.session_id, null, 2));


                // experimentation with socket session:
                socket.bot1Session = res.result.session_id;

                // create message as soon as session is created:
                socket.bot1.message({
                    assistantId: socket.botAuth1.assistant_id,
                    sessionId: socket.bot1Session ,
                    input: {
                      'message_type': 'text',
                      'text': JSON.stringify(socket.botMessage.content)
                      }
                    })
                    .then(res => {
                      console.log(JSON.stringify(res.result.output.generic, null, 2));
                      socket.botdata = {
                        content: res.result.output.generic[0].text,
                        type: 'botAnswer',
                        botPhoto: socket.botAuth1.image_path
                      }

                      socket.emit('message', socket.botAuth1.name, JSON.stringify(socket.botdata)); // let bot respond in client
                      socket.to(room).emit('message', socket.botAuth1.name, JSON.stringify(socket.botdata)); // let bot respond to room
                    })
                    .catch(err => {
                      console.log(err);
                    });

            })
            .catch(err => {
                console.log(err);
            });
            
            bot2.createSession({
                assistantId: socket.botAuth2.assistant_id
            })
            .then(res => {
                console.log(JSON.stringify(res.result.session_id, null, 2));
                socket.bot2Session = res.result.session_id;
            })
            .catch(err => {
                console.log(err);
            });

        })

        socket.on("callSecondBot", function (data) {
                      
            socket.botMessage = JSON.parse(data);

            callBot(socket.bot2, socket.botAuth2, socket.bot2Session, socket.botMessage,'botAnswer2');
        })

        socket.on("callFirstBot", function (data) {

            socket.botMessage = JSON.parse(data);

            callBot(socket.bot1, socket.botAuth1, socket.bot1Session, socket.botMessage,'botAnswer');
           
        })


        function callBot(bot, auth, session, messageData, type){
          bot.message({
              assistantId: auth.assistant_id,
              sessionId: session,
              input: {
                'message_type': 'text',
                'text': JSON.stringify(messageData.content)
                }
              })
              .then(res => {
                console.log(JSON.stringify(res.result.output.generic, null, 2));
                socket.botdata = {
                  content: res.result.output.generic[0].text,
                  type: type,
                  botPhoto: auth.image_path
                }
      
                socket.emit('message', auth.name, JSON.stringify(socket.botdata)); // let bot respond in client
                socket.to(room).emit('message', auth.name, JSON.stringify(socket.botdata)); // let bot respond to room
              })
              .catch(err => {
                console.log(err);
              });
         }
    })  
}
module.exports = socket;

