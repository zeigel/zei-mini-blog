var express = require("express");
var app = express();
var engine = require('ejs-locals');
var helpers = require('express-helpers')(app);

var User=require("./models/user.js");
var Post=require("./models/post.js");
var Comment=require("./models/comment.js");
var Tag=require("./models/tag.js");
var TIP= require("./models/tagsinpost.js");

app.configure(function(){
	app.use(express.bodyParser());
	app.use(express.cookieParser());
	app.use(express.session({secret: 'ADe91mGlS0123lK'}));
	app.use(express.static(__dirname + "/public"));
	app.use(app.router);


});

app.engine('ejs', engine);

app.set('view engine', 'ejs');//single template engine.
app.set('views', __dirname + '/views');
app.set('view options', { layout: '/views/layout.ejs' }); 
//console.log(app.get('view options'));
//app.use(express.logger());

var user = ["user","password"];
/*
app.get('/', function(request, response) {
  response.send('Hello World!');
});
*/

app.get("/",function(req,res){
	//console.log(req.session);
	req.session.lastPage = '/';
	Post.searchSomePost(0,5,function(posts){

		Tag.searchSomeTag(0,30,function(tags){
			for (var i = 0;i< posts.length; i++) {
			posts[i].author="Alberto";
		}
		
		res.render("index.ejs", {
			posts:posts,
			tags:tags,
			//test_value:"disc",
			//layout: __dirname+'/views/layout.ejs',
			locals: { errorMessage: "" }
		})

		});

		
	});
});
app.get("/cpost",function(req,res){	
	
	Post.searchSomePost(0,5,function(posts){

		Tag.searchSomeTag(0,5,function(tags){
			for (var i = 0;i< posts.length; i++) {
			posts[i].author="Alberto";
		}
		req.session.lastPage = '/';
		res.render("subpost.ejs", {
			posts:posts,
			tags:tags,
			locals: { errorMessage: "" }
		})

		});

		
	});
});

app.post("/cposts",function(req,res){
	Post.createPost(req.body.cpost,function(stat){
		//console.log(req.body.cpost);
		//console.log("resultado:"+stat);

		if(stat){
			var newtags=req.body.cpost.tags.split(",");
			console.log(newtags);
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

});

app.get("/login", function(req, res){

	req.session.lastPage = '/login';
	res.render("login.ejs", {
		layout:false,
		locals: { errorMessage: "" }
	});
});

app.post("/login", function(req, res){
	
	//console.log(req.body);
		
	if(req.body.user==user[0]&&req.body.pass==user[1]){
		if(req.session.lastPage){
			res.redirect(req.session.lastPage);
		}else{
			res.redirect('/');
		}
	}else{
		res.render("login.ejs", {
			layout:false,
			locals: { errorMessage: "Error: password wrong." }
		});
	}
});

app.get("/post/:id",function(req,res){

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
});

app.post("/comments",function(req,res){
	console.log(req.body.comment);
	//if(req.body.comment)
	Comment.createComment(req.body.comment,function(stat){
		console.log(stat);
		if(req.session.lastPage){
			res.redirect(req.session.lastPage);
		}else{
			res.redirect('/');
		}
	});

});

app.get("/tag/:id",function(req,res){

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
			//

		});

	});
});



var port = process.env.PORT || 5001;
app.listen(port, function() {
  console.log("Listening on " + port);
});
process.on('uncaughtException', function(err) {
    if(err.errno === 'EADDRINUSE')
         console.log("fuck");
    else
         console.log(err);
    process.exit(1);
});


