var monfile = require("./mongoose.js");
var mongoose= monfile.mongoose;
var db= monfile.db;

var Comment= new mongoose.Schema({
	id:{ type: Number, min: 1},
	name:{ type: String, min: 1, required: true},
	text:{ type: String, min: 1, required: true},
	date: Date,
	post_id:{ type: Number, min: 1},
});
var CommentModel = db.model('Comment', Comment);

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
		//console.log("comment: "+err+"/"+data);
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

/*
//Crear comment
createComment({
	"post_id":2,
	"text":"nuevo comentario post 2",
	"name":"zei"
},function(res){console.log("respuesta:"+res);})
//busca comment

searchComment(1,function(data){console.log(data);});
*/


module.exports.CommentModel =CommentModel;
module.exports.searchComment =searchComment;
module.exports.createComment =createComment;

