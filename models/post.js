var monfile = require("./mongoose.js");
var mongoose= monfile.mongoose;
var db= monfile.db;

var Post= new mongoose.Schema({
	id:{ type: Number, min: 1},
	title:{ type: String, min: 1, required: true},
	text:{ type: String, min: 1, required: true},
	date:Date,
	user_id: { type: Number, min: 1},
});

var PostModel = db.model('Post', Post);

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
			callback(data[0]);
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
				console.log(errr);
				if(errr)
					callback(false);
				else{
					PostModel.findOne({}, {}, { sort: { '_id' : -1 } }, function(err, newpost) {
						callback(newpost);
					});
				}
					
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


module.exports.PostModel =PostModel;
module.exports.searchPost =searchPost;
module.exports.createPost =createPost;
module.exports.searchSomePost =searchSomePost;

