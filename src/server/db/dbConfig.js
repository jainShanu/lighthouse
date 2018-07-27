const mongoose = require("mongoose");
var uri = "mongodb://localhost:27017/UniversityDB";
mongoose.connect(uri);
var db =mongoose.connection;
module.exports = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));     
db.once("open",function(){
   console.log("Connection to db successful");
       
});