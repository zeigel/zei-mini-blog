var mongoose = require("mongoose");
var mongoUri = process.env.MONGOLAB_URI ||
  process.env.MONGOHQ_URL ||
  'mongodb://localhost/blog-test';
var db= mongoose.connect(mongoUri);

module.exports.mongoose =mongoose;
module.exports.db =db;

console.log(db);
