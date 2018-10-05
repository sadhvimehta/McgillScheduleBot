var builder = require('botbuilder');

const library = new builder.Library('courseSearch');

library.dialog('/', [
    (session, args) => {
        builder.Prompts.text(session,
            "Please type the course name/title to check availabilites or type the name of the faculty you would like to search by.");
    }
])

module.exports = library; // need this line to reference dialog in other files
