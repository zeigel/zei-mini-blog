//Archivo de prueba de comandos dado el hecho que deben importarse.
var monfile = require("./mongoose.js");
var mongoose= monfile.mongoose;
var db= monfile.db;

var userfile = require("./user.js");
var postfile = require("./post.js");
var commentfile = require("./comment.js");
var tagfile = require("./tag.js");
var tipfile = require("./tagsinpost.js");



//busca un usuario
userfile.searchUser(1,function(res){console.log("---user: "+res);});
postfile.searchSomePost(0,5,function(posts){
	console.log("---posts: "+posts);
});

commentfile.searchComment(1,function(data){console.log("---comments: "+data);});
tagfile.searchTag("nodejs",function(res){console.log("---tag"+res);});
tipfile.searchTags(2,function(res){console.log("---tags P1"+res);});
/*
//crear usuario...
createUser({"id":2,"name":"lierof","pass":"password","email":"celtic.guardian.14@gmail.com"},
	function(res){
		console.log(res);
	});
*/

