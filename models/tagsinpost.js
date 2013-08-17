var monfile = require("./mongoose.js");
var mongoose= monfile.mongoose;
var db= monfile.db;

//depende de los modelos de post y tag
var postfile = require("./post.js");
var tagfile = require("./tag.js");

//post methods
var PostModel =postfile.PostModel;
var searchPost =postfile.searchPost;
var createPost =postfile.createPost;
var searchSomePost =postfile.searchSomePost;

//tag methods
var TagModel = tagfile.TagModel;
var searchTag = tagfile.searchTag;
var createTag = tagfile.createTag;

//generación del esquema y el modelo
var TagsInPost = new mongoose.Schema({
	id:{ type: Number, min: 1},
	post_id:{ type: Number, min: 1},
	tag_id:{ type: Number, min: 1},
});

var TagsInPostModel = db.model('TagsInPost', TagsInPost);

/*
Genera la relación entre un post y un tag.
recibe:
	data: un objeto con los ids de post y tag de quienes se quiere la relacion
	callback: la función a donde regresamos el resultado
regresa:
	boolean: depende de la insersión.
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
/**
Realiza la busqueda de las tags de a partir de un post. El resultado de la funcion
lo manda a la funcion callback
recibe:
	post_id: El id del post del que queremos los tags
	callback: La función a donde mandamos la respuesta
regresa
	arr: con los tags del post
*/
function searchTags(post_id,callback){
	TagsInPostModel.find({"post_id":post_id},function(err,data){
		//console.log(data);
		if(data!=null)
		{
			var relations=[];
			for(var i=0;i<data.length;i++){
				relations[i]=data[i].tag_id;
			}
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

function addTagstoPost(tags,post){
	tagfile.searchTags(tags,function(ctag){
		
		for(var i=0;i<ctag.length;i++){
			addTagtoPost({"tag_id":ctag[i].id,"post_id":post.id},function(res){
				//console.log(res);
			});/**/
		}
	});

}

function searchPostsAndTags(callback){
	postfile.searchSomePost(0,7,function(posts){

		tagfile.searchSomeTag(0,20,function(tags){
			for (var i = 0;i< posts.length; i++) {
			posts[i].author="Alberto";
			}
			callback(posts,tags);
		
		});
	});
}

function searchPosts(tag_id,callback){
	TagsInPostModel.find({"tag_id":tag_id},function(err,data){
		//console.log(data);
		if(data!=null)
		{
			var relations=[];
			for(var i=0;i<data.length;i++){
				relations[i]=data[i].post_id;
			}
			PostModel.find({"id":{$in:relations}},function(errr,posts){
				callback(posts);
			})
		}
		else
		{
			callback(false);
		}
	});
}

/*
var mytags="tec,tag".split(",");
console.log("mytags:"+mytags);
var mypost={id:5};console.log("roar"+mypost.id);
addTagstoPost(mytags,mypost);*/
/*
TagsInPostModel.findOne({"post_id":3,"tag_id":2},function(err,rel){
	console.log(rel+":"+err);
	});
*//*
//relaciona tag a un post
addTagtoPost({"post_id":2,"tag_id":2},function(res){console.log(res);});

//busca las tags de un post

searchTags(2,function(res){console.log(res);});
*/
module.exports.TagsInPostModel =TagsInPostModel;
module.exports.addTagtoPost =addTagtoPost;
module.exports.addTagstoPost =addTagstoPost;
module.exports.searchTags =searchTags;
module.exports.searchPosts =searchPosts;
module.exports.searchPostsAndTags =searchPostsAndTags;