//setup
var builder = require('botbuilder');
const restify = require('restify');

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url);
});

// Create chat connector for communicating with the Bot Framework Service
var connector = new builder.ChatConnector({
    appId: process.env.MicrosoftAppId,
    appPassword: process.env.MicrosoftAppPassword
});

// Receive messages from the user and respond by echoing each message back (prefixed with 'You said:')
var bot = new builder.UniversalBot(connector);

// Listen for messages from users
server.post('/api/messages', connector.listen());

// global variables
var terms = ["Fall 2018", "Winter 2018"];

// in-memory storage
var inMemoryStorage = new builder.MemoryBotStorage();

// root dialog employing waterfall dialog
bot.dialog('/', [(session, args) => {

  savedAddress = session.message.address;
  builder.Prompts.choice(session,
              'Please select a term to begin:',
              [terms[0], terms[1]],
              { listStyle: builder.ListStyle.button });},

  (session, result) => {
        if(result.response) {
            switch(result.response.entity) {
                case terms[0]:
                    // call course generation dialog for fall
                    session.send("You have chosen the " + terms[0] + " semester.");
                    break;
                case terms[1]:
                    // call course generation dialog for winter
                    session.send("You have chosen the " + terms[1] + " semester.");
                    break;
            }
            session.beginDialog('courseSearch:/', result.response.entity);
        } //TODO: Add a goodbye checker here (no need for quit)
  }]);

bot.set('storage', inMemoryStorage);

// sub-dialog to call
bot.library(require('./dialogs/course-search'));
