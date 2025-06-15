const router = require("express").Router()
const { addBlogs, getBlogs, getBlogById, updateBlog, deleteBlog , getTopReatedBlog} = require('../../controllers/admin/blogsControllers')

router.post("/addBlogs", addBlogs);
router.post("/getBlogs", getBlogs); 
router.post("/getBlogById", getBlogById); 
router.post("/updateBlog", updateBlog); 
router.post("/deleteBlog", deleteBlog); 
router.post("/getTopReatedBlog", getTopReatedBlog); 







 

module.exports = router;