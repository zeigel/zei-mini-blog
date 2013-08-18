//importamos modulos para servidor web y adicionales
var express = require("express");
var app = express();
var engine = require('ejs-locals');
var helpers = require('express-helpers')(app);
//importamos los modelos para facilitar guardar en la base de datos
var User=require("./models/user.js");
var Post=require("./models/post.js");
var Comment=require("./models/comment.js");
var Tag=require("./models/tag.js");
var TIP= require("./models/tagsinpost.js");
var monfile = require("./models/mongoose.js");
var mongoose= monfile.mongoose;
var db= monfile.db;
//configuracion inicial de Express
app.configure(function(){
	app.use(express.bodyParser());
	app.use(express.cookieParser());//manejo de sesiones
	app.use(express.session({secret: 'ADe91mGlS0123lK'}));
	app.use(express.static(__dirname + "/public"));
	app.use(app.router);
});
//especificacion del engine para maejo de vistas y layouts
app.engine('ejs', engine);
app.set('view engine', 'ejs');//manejo de templates
app.set('views', __dirname + '/views');//especificacion del dir de vistas
app.set('view options', { layout: '/views/layout.ejs' }); //definicion del layout
//usuario para pruebas. Se requiere para crear un Post
var user = ["user","password"];

app.get("/",inicio);//Realiza render de los posts mas actuales.
app.get("/cpost",createPost);//Render del formulario para crer un post. se requiere hacer login
app.post("/cposts",createPostReciever);//Recibe por post los datos para subir un post
app.get("/login", login);//Vista para iniciar sesion
app.post("/login", loginReciever);//Recibe por post los datos para el inicio de sesion
app.get("/post/:id",searchPost);//Busqueda de un post por id especificado en la ruta
app.post("/comments",commentReciever);//Recibe por post los datos para crear un comentario
app.get("/tag/:id",searchTaggedPosts);//Busqueda de un tag por id especificado en la ruta

function inicio(req,res){
	req.session.lastPage = '/';
	TIP.searchPostsAndTags(function(posts,tags){
		for (var i = 0;i< posts.length; i++) {
			posts[i].author="Alberto";
		}
		res.render("index.ejs", {
			posts:posts,
			tags:tags,
			locals: { errorMessage: "" }
		});
	});
}

function createPost(req,res){
	if(req.session.logged){	
		TIP.searchPostsAndTags(function(posts,tags){
			for (var i = 0;i< posts.length; i++) {
				posts[i].author="Alberto";
			}
			req.session.lastPage = '/cpost';
			res.render("subpost.ejs", {
				posts:posts,
				tags:tags,
				locals: { errorMessage: "" }
			});
		});
	}else{
		res.redirect('/login');
	}
}

function createPostReciever(req,res){
	if(req.session.logged){
		Post.createPost(req.body.cpost,function(stat){
			if(stat){
				var newtags=req.body.cpost.tags.split(",");
				Tag.createTags(newtags,function(tags){
					TIP.addTagstoPost(newtags,stat);
				});
			}
			if(req.session.lastPage){
				res.redirect(req.session.lastPage);
			}else{
				res.redirect('/');
			}
		});
	}else{
		res.redirect('/login');
	}
}

function login(req, res){
	req.session.lastPage = '/login';
	res.render("login.ejs", {
		layout:false,
		locals: { errorMessage: "" }
	});
}

function loginReciever(req, res){
	if(req.body.user==user[0]&&req.body.pass==user[1]){
		if(req.session.lastPage){
			req.session.logged=true;
			res.redirect('/cpost');
		}else{
			res.redirect('/');
		}
	}else{
		res.render("login.ejs", {
			layout:false,
			locals: { errorMessage: "Error: Entrada invalida." }
		});
	}
}

function searchPost(req,res){
	TIP.searchPostsAndTags(function(posts,tags){
		Post.searchPost(req.params.id,function(post){
			if(post){
				TIP.searchTags(post.id,function(tagsofpost){
					post.author="Alberto";
					Comment.searchComment(req.params.id,function(comments){
						req.session.lastPage = '/post/'+req.params.id;
						res.render("post.ejs", {
							posts:posts,
							tags:tags,
							post:post,
							tagsofpost:tagsofpost,
							comments:comments,
							locals: { errorMessage: "" }
						});

					});
				});

			}else{
				req.session.lastPage = '/post/'+req.params.id;
				res.redirect("/");//redirigir a error
			}
		});
	});
}

function commentReciever(req,res){
	Comment.createComment(req.body.comment,function(stat){
		if(req.session.lastPage){
			res.redirect(req.session.lastPage);
		}else{
			res.redirect('/');
		}
	});
}

function searchTaggedPosts(req,res){
	TIP.searchPostsAndTags(function(posts,tags){
		TIP.searchPosts(req.params.id,function(myposts){
			req.session.lastPage = '/tag/'+req.params.id;
			if(myposts.length>0){
				res.render("postsbytag.ejs", {
					posts:posts,
					tags:tags,
					myposts:myposts,
					locals: { errorMessage: "" }
				});
			}else{
				res.render("postsbytag.ejs", {
					posts:posts,
					tags:tags,
					locals: { errorMessage: "" }
				});
			}
		});
	});
}

app.get("/noma",function(req,res){
	Tag.searchTag("server",function(tag){
		console.log(tag);
	});
	res.redirect('/login');
});

//inicio de escucha remoto. se especifica el puerto
var port = process.env.PORT || 5001;
//console.log(port);
//esperamos a establecer la conexion con la base de datos
mongoose.connection.on('open', function (ref) {
  console.log('Connected to mongo server.');
	app.listen(port, function() {
	  console.log("Listening on " + port);
	});
});
mongoose.connection.on('error', function (err) {
  console.log('Could not connect to mongo server!');
  console.log(err);
});



