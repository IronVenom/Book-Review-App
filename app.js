var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var expressSanitizer = require("express-sanitizer");
var methodOverride = require("method-override");
var app = express();

// App Configs
mongoose.connect("mongodb://localhost/book_review_app");
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.use(expressSanitizer());

var bookSchema = mongoose.Schema({
	title: String,
	image: String,
	description: String,
	review: String,
	rating: String
});

var Book = mongoose.model("Book",bookSchema);

app.get("/",function(req,res){
	res.redirect("/books");
});

app.get("/books",function(req,res){
	Book.find({},function(err,books){
		if(err){
			console.log("Error!");
		} else {
			res.render("index",{books:books});
		}
	});
});

app.get("/books/new",function(req,res){
	res.render("new");
});

app.post("/books",function(req,res){
	req.body.book.title = req.sanitize(req.body.book.title);
	req.body.book.description = req.sanitize(req.body.book.description);
	req.body.book.review = req.sanitize(req.body.book.review);
	Book.create(req.body.book,function(err,newBook){
		if(err){
			res.render("new");
		} else {
			res.redirect("/books");
		}
	});
});

app.get("/books/:id",function(req,res){
	Book.findById(req.params.id,function(err,book){
		if(err){
			res.redirect("/books");
		} else {
			res.render("show",{book:book});
		}
	});
});

app.get("/books/:id/edit",function(req,res){
	Book.findById(req.params.id,function(err,book){
		if(err){
			res.redirect("/books");
		} else {
			res.render("edit",{book:book});
		}
	});
});

app.put("/books/:id",function(req,res){
	req.body.book.title = req.sanitize(req.body.book.title);
	req.body.book.description = req.sanitize(req.body.book.description);
	req.body.book.review = req.sanitize(req.body.book.review);
	Book.findByIdAndUpdate(req.params.id,req.body.book,function(err,updatedBook){
		if(err){
			res.redirect("/books");
		} else {
			res.redirect("/books/" + req.params.id);
		}
	});
});

app.delete("/books/:id",function(req,res){
	Book.findByIdAndRemove(req.params.id,function(err){
		if(err){
			res.redirect("/books");
		} else {
			res.redirect("/books");
		}
	});
});

var port = process.env.PORT || 3000;
app.listen(port,process.env.IP,function(){
	console.log("The Book Review App server has started")
})
