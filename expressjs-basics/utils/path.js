const path = require("path");

//This gives the path to the file which is responsible for running the application.
// console.log(process.mainModule.filename); = app.js
module.exports = path.dirname(process.mainModule.filename);
