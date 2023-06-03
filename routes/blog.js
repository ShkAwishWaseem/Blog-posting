const {Router}= require("express");
const router = Router();
const multer = require("multer");
const path = require("path");
const Blog = require("../models/blog")
const Comment = require("../models/comments")




// Integration Of multer

const storage = multer.diskStorage({
     destination: function (req, file, cb) {
       cb(null, path.resolve(`./public/uploads`))
     },
     filename: function (req, file, cb) {
       const fileName = `${Date.now()} - ${file.originalname}`;
       cb(null ,fileName)
     }
   })
   
const upload = multer({ storage: storage })


//Routes
router.get('/add-new'  , (req,res) => {
     return res.render("addBlog" , {
          user : req.user
     })
})


router.get("/:id" , async(req,res) => {
     const id = req.params.id
     const blog = await Blog.findById(id).populate("createdBy");
     const comments = await Comment.find({blogId : req.params.id}).populate("createdBy")
     // console.log(blog);
     console.log(comments);
     return res.render("blogs" , {
          user : req.user,
          blog : blog,
          comments : comments
     })
})


router.post('/post-data' , upload.single('coverImage') ,  async(req,res) => {
     const {title,body} = req.body;
     // if ( ! title || !body ) {
          
     // }
   const blog = await  Blog.create( {
          title,
          body,
          createdBy: req.user._id,
          coverImageUrl : `/uploads/${req.file.filename}`
     })
     return res.redirect(`/`)
})




// Comment
router.post("/comment/:blogId" , async(req,res) => {
     const comment = await Comment.create({
          content : req.body.content,
          blogId : req.params.blogId,
          createdBy : req.user._id
     });
     return res.redirect(`/blog/${req.params.blogId}`);
     
})
module.exports = router  
