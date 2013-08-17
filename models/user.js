var monfile = require("./mongoose.js");
var mongoose= monfile.mongoose;
var db= monfile.db;


var User= new mongoose.Schema({
	id: { type: Number, min: 1},
	name : { type: String, min: 5},
	pass : { type: String, min: 4},
	email : { type: String, min: 5}
});
var UserModel = db.model("User",User);

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
/*

//busca un usuario
searchUser(1,function(res){console.log(res);});


//crear usuario...
createUser({"id":2,"name":"lierof","pass":"password","email":"celtic.guardian.14@gmail.com"},
	function(res){
		console.log(res);
	});
*/
module.exports.UserModel =UserModel;
module.exports.searchUser =searchUser;
module.exports.createUser =createUser;


