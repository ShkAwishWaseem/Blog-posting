require("dotenv").config()
const express = require('express');
const app = express();
const path = require("path")
const userRoute  =  require("./routes/user");
const blogRoute  =  require("./routes/blog");
const mongoose = require("mongoose");
const { log } = require('console');
const cookieParser = require('cookie-parser');
const { checkForAuthenticationCookie } = require('./middlewares/authentication');
const Blog = require("./models/blog")
// const PORT = process.env.PORT || 8000;


// EJS files
app.set("view engine" ,  "ejs");
app.set("views" , path.resolve('./views'));

// MiddleWares
app.use(express.urlencoded({extended:false}));
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"))
app.use(express.static(path.resolve("./public")))


// MongoDb connection 
mongoose.connect("mongodb://localhost:27017/blogs")
.then(() => log('MongoDb  Connected'))

// "mongodb://localhost:27017/blogs"
// Routes
app.get('/' ,async(req,res) => {
     const allBlogs = await Blog.find({})
     res.render("home" , {
          user : req.user,
          blogs : allBlogs
     }) 
})

app.use("/user" , userRoute )
app.use("/blog" , blogRoute )

app.listen(8000 , () =>  console.log("Server is Listening on PORT 8000"))