var monfile = require("./mongoose.js");
var mongoose= monfile.mongoose;
var db= monfile.db;

var Tag= new mongoose.Schema({
	id:{ type: Number, min: 1},
	text:{ type: String, min: 1, required: true},
});

var TagModel = db.model('Tag', Tag);

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
					else{
						TagModel.findOne({"id":myTagModel.id},function(errr,newtag){
							callback(newtag);
						});
					}
				});
			});
		}
		else{
			callback(false);
		}
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
function searchSomeTag(from, to, callback){
	TagModel.find().sort("-_id").skip(from).limit(to).exec(function(err,data){
		if(data!=null){
			callback(data);
		}
		else
		{
			callback(false);
		}
	});
	
}
function createTags(texts,callback){
	privinstag(texts,0,0,function(succ){
		if(succ>0){
			TagModel.find().sort("-_id").skip(0).limit(succ).exec(function(err,data){
				callback(data);
			});
		}else{
			callback(false);
		}
	});
}
function privinstag(texts,n,succ,callback){
	if(n<texts.length){
		createTag({"text":texts[n]},function(tag){
			if(tag){
				//console.log(tag);
				succ++;	
			}
			privinstag(texts,n+1,succ,callback);
		});
	}else{
		callback(succ);
	}
}

function searchTags(texts,callback){
	var arr=[];
	privseatag(texts,0,arr,function(tags){
		callback(tags);
	});
}

function privseatag(texts,n,tags,callback){
	if(n<texts.length){
		searchTag(texts[n],function(tag){
			if(tag.length){
				tags[tags.length]=tag[0];
			}
			privseatag(texts,n+1,tags,callback);

		});
	}else{
		callback(tags);
	}

}
/*
searchTags(['este', 'es', 'pez', 'tag', 'server'],function(tags)
	{
		console.log("tags recolectadas:"+tags);
	});
*/
/*
console.log("________________");
createTags(['este', 'es', 'un', 'tag', 'server'],function(tags)
	{
		console.log("tags insertadas"+tags);
	});
*/
/*
//crear tags
createTag({
	"text":"servidor",
	},function(res){console.log(res);})
//busca tag por nombre
searchTag("nodejs",function(res){console.log(res);});
*/


module.exports.TagModel =TagModel;
module.exports.searchTag =searchTag;
module.exports.searchTags =searchTags;
module.exports.searchSomeTag =searchSomeTag;
module.exports.createTag =createTag;
module.exports.createTags =createTags;

