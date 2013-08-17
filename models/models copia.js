var mongoose = require("mongoose");
var mongoUri = process.env.MONGOLAB_URI ||
  process.env.MONGOHQ_URL ||
  'mongodb://localhost/blog-test';

var db= mongoose.connect(mongoUri);


var User= new mongoose.Schema({
	id: { type: Number, min: 1},
	name : { type: String, min: 5},
	pass : { type: String, min: 4},
	email : { type: String, min: 5}
});

var Post= new mongoose.Schema({
	id:{ type: Number, min: 1},
	title:{ type: String, min: 1},
	text:{ type: String, min: 1},
	date:Date,
	user_id: { type: Number, min: 1},
});

var Comment= new mongoose.Schema({
	id:{ type: Number, min: 1},
	name:{ type: String, min: 1},
	text:{ type: String, min: 1},
	date: Date,
	post_id:{ type: Number, min: 1},
});
var Tag= new mongoose.Schema({
	id:{ type: Number, min: 1},
	text:{ type: String, min: 1},
	post_id:{ type: Number, min: 1},
});

var TagsInPost = new mongoose.Schema({
	id:{ type: Number, min: 1},
	post_id:{ type: Number, min: 1},
	tag_id:{ type: Number, min: 1},
});
/*
mongoose.model('User', User);
mongoose.model('Post', Post);
mongoose.model('Comment', Comment);
mongoose.model('Tag', Tag);
Generación de los modelos usando la conexión con moongose
*/
var UserModel = db.model("User",User);
var PostModel = db.model('Post', Post);
var CommentModel = db.model('Comment', Comment);
var TagModel = db.model('Tag', Tag);
var TagsInPostModel = db.model('TagsInPost', TagsInPost);

/*
* USUARIO
*
*
*
*/	

/*Busqueda de usuarios. Si lo encuentra regresa el modelo.
En caso constrario regresa falso.

recibe: 
	id : id del usuario
	callback: función a la que regresa el resultado
regresa:
	boolean/User dependiendo si encontró o no al usuario.
*/
function searchUser(id,callback){
	UserModel.find({"id":id},function(err,data){
		if(data!=null){
			callback(data);
		}
		else
		{
			callback(false);
		}
	});
}
/*
Proceso de Creación de usuario. Inserta un usuario a la coleccion
siempre y cuando el id no se repita. 

recibe:
	data: información del modelo.
	callback: funcion a quien regresa la respuesta.
regresa:
	boolean si realizó o no la insersión.
*/
function createUser(data,callback){
	searchUser(data.id, function(data2){
		if(data2==false){

			var myUserModel = new UserModel();

			myUserModel.id=data.id;
			myUserModel.name=data.name;
			myUserModel.pass =data.pass;
			myUserModel.email =data.email;
			myUserModel.save(function(err){
				if(err)
					callback(false);
				else
					callback(true);
			});
		}else
			console.log(false);
	});
}


/**
POST
*
*
*
*
*/

/*Busqueda de Post. Si lo encuentra regresa el modelo.
En caso constrario regresa falso.

recibe: 
	id : id del post
	callback: función a la que regresa el resultado
regresa:
	boolean/User dependiendo si encontró o no al usuario.
*/
function searchPost(id,callback){
	PostModel.find({"id":id},function(err,data){
		if(data!=null){
			callback(data);
		}
		else
		{
			callback(false);
		}
	});
}
/*
Proceso de Creación de Post. Inserta un Post a la coleccion.

recibe:
	data: información del modelo.
	callback: funcion a quien regresa la respuesta.
regresa:
	boolean si realizó o no la insersión.
*/
function createPost(data,callback){

	PostModel.findOne({}, {}, { sort: { '_id' : -1 } }, function(err, post) {
		var myPostModel = new PostModel();
		if(post!=null){
			myPostModel.id=post.id+1;
		}else{
			myPostModel.id=1;
		}
			myPostModel.title=data.title;
			myPostModel.text=data.text;
			myPostModel.date=new Date();
			myPostModel.user_id=data.user_id;
			myPostModel.save(function(errr){
				if(errr)
					callback(false);
				else
					callback(true);
			});
	});
}
/*
Busqueda de Posts en rango empezando por el mas actual.

recibe:
	from: Desde qué post se inicia.
	to: a partir de from, cuantos posts regresa.
	callback: funcion a quien regresa la respuesta.
regresa:
	boolean si realizó o no la insersión.
*/
function searchSomePost(from, to, callback){
	PostModel.find().sort("-_id").skip(from).limit(to).exec(function(err,data){
		if(data!=null){
			callback(data);
		}
		else
		{
			callback(false);
		}
	});
	
}

/*
* COMMENTS
*
*
*
*/	

/*
Proceso de Creación de Comentario. Inserta un Comentario a la coleccion.

recibe:
	data: información del modelo.
	callback: funcion a quien regresa la respuesta.
regresa:
	boolean si realizó o no la insersión.
*/
function createComment(data,callback){

	CommentModel.findOne({}, {}, { sort: { '_id' : -1 } }, function(err, comment) {
		console.log("comment: "+err+"/"+data);
		var myCommentModel = new CommentModel();
		if(comment!=null){
			myCommentModel.id=comment.id+1;
		}else{
			myCommentModel.id=1;
		}
			myCommentModel.post_id=data.post_id;
			myCommentModel.text=data.text;
			myCommentModel.date=new Date();
			myCommentModel.name=data.name;

			myCommentModel.save(function(errr){
				if(errr)
					callback(false);
				else
					callback(true);
			});
	});
}
/*Busqueda de Comentarios de un post. Si encuentra regresa el arreglo de modelos.
En caso constrario regresa falso.

recibe: 
	id : id del post
	callback: función a la que regresa el resultado
regresa:
	boolean/User dependiendo si encontró o no al usuario.
*/
function searchComment(post_id,callback){
	CommentModel.find({"post_id":post_id},function(err,data){
		if(data!=null){
			callback(data);
		}
		else
		{
			callback(false);
		}
	});
}
/**
* TAGS
*
*
*
*/


function searchTag(text,callback){
	TagModel.find({"text":text},function(err,data){
		if(data!=null){
			callback(data);
		}
		else
		{
			callback(false);
		}
	});
}

function createTag(data,callback){
	searchTag(data.text,function(res){
		if(res==false){

			TagModel.findOne({}, {}, { sort: { '_id' : -1 } }, function(err, tag) {
				var myTagModel = new TagModel();
				if(tag!=null){
					myTagModel.id=tag.id+1;
				}else{
					myTagModel.id=1;
				}
			

				myTagModel.text=data.text;
				myTagModel.save(function(err){
					if(err)
						callback(false);
					else
						callback(true);
				});
			});
		}
		else{
			callback(false);
		}
	});
}

/**tags in posts**

*/

function addTagtoPost(data,callback){
	TagsInPostModel.findOne({"post_id":data.post_id,"tag_id":data.tag_id},function(err,rel){
		if(rel==null)
		{
			TagsInPostModel.findOne({}, {}, { sort: { '_id' : -1 } }, function(err, post) {
				var myTIP= new TagsInPostModel();
				if(post!=null){
					myTIP.id=post.id+1;
				}else{
					myTIP.id=1;
				}
				myTIP.tag_id=data.tag_id;
				myTIP.post_id=data.post_id;

				myTIP.save(function(err){
					callback(true);
				});
			});
		}
		else{
			callback(false);
		}
	});
}

function searchTags(post_id,callback){
	TagsInPostModel.find({"post_id":post_id},function(err,data){
		console.log(data);
		if(data!=null)
		{
			var relations=[];
			for(var i=0;i<data.length;i++){
				relations[i]=data[i].tag_id;
			}
			//var tags;
			TagModel.find({"id":{$in:relations}},function(errr,tags){
				callback(tags);
			})
		}
		else
		{
			callback(false);
		}
	});
}

/*
//crear usuario...
createUser({"id":2,"name":"lierof","pass":"password","email":"celtic.guardian.14@gmail.com"},
	function(res){
		console.log(res);
	});
*/

/*
//crear un post nuevo...
createPost({
	"title":"Mi segund blog",
	"text":"segunda insersion",
	"user_id":1,
	},function(res){
		console.log(res);
});

//buscar ultimos 5 posts.
searchSomePost(0,5,function(posts){
	console.log(posts);
});
*/

/*
//Crear comment
createComment({
	"post_id":2,
	"text":"nuevo comentario post 2",
	"name":"zei"
},function(res){console.log("respuesta:"+res);})
//busca comment

searchComment(2,function(data){console.log(data);});
*/

/*
//crear tags
createTag({
	"text":"servidor",
	},function(res){console.log(res);})
//busca tag por nombre
searchTag("",function(res){console.log(res);});
*/

/*
//relaciona tag a un post
addTagtoPost({"post_id":1,"tag_id":2},function(res){console.log(res);});

//busca las tags de un post

searchTags(2,function(res){console.log(res);});
*/


module.exports.mongoose =mongoose;
module.exports.db =db;

