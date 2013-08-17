//Preparando mongoose para manejo de base de datos
var mongoose = require("mongoose");
var mongoUri = //process.env.MONGOLAB_URI ||
 // process.env.MONGOHQ_URL ||
  //'mongodb://localhost/blog-test';//local
  'mongodb://Zeigel:Jirachi00@ds041198.mongolab.com:41198/blog';//pseudo prod
var db= mongoose.connect(mongoUri);

console.log("DataBase on: "+mongoUri);
module.exports.mongoose =mongoose;
module.exports.db =db;