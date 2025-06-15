const db = require('../../models');
const blogsDB = db.blogsDB;


class Blogs {
    async addBlogs(req, res) {
        const { authorName, title, discription, image } = req.body
        if (!authorName) {
            return res.send({ status: false, message: "Author name is require" })
        }
        if (!title) {
            return res.send({ status: false, message: "Blog title is require" })
        }
        if (!discription) {
            return res.send({ status: false, message: "Blog discription is require" })
        }
        if (!image) {
            return res.send({ status: false, message: "blog image is require" })
        }

        try {
            const newBlog = await blogsDB({
                authorName,
                title,
                discription,
                image
            })

            await newBlog.save()
            return res.send({ status: true, message: "New blog added successfully.", data: newBlog });

        }
        catch (error) {
            return res.send({ status: false, message: "Internal server error. Please try again later.", error: error.message })
        }
    }

    async getBlogs(req, res) {
        try {
            const blogs = await blogsDB.find().sort({ createdAt: -1 });

            return res.status(200).send({
                status: true,
                message: "All blogs fetched successfully.",
                data: blogs,
            });

        } catch (error) {
            return res.status(500).send({
                status: false,
                message: "Internal server error. Please try again later.",
                error: error.message,
            });
        }
    }

    async getBlogById(req, res) {
        const { id } = req.body;

        if (!id) {
            return res.status(400).send({
                status: false,
                message: "Blog ID is required.",
            });
        }

        try {
            const blog = await blogsDB.find({ _id: id });

            if (!blog) {
                return res.status(404).send({
                    status: false,
                    message: "No blog found with the provided ID.",
                });
            }

            return res.status(200).send({
                status: true,
                message: "Blog fetched successfully.",
                data: blog,
            });

        } catch (error) {
            return res.status(500).send({
                status: false,
                message: "Internal server error. Please try again later.",
                error: error.message,
            });
        }
    }

    async updateBlog(req, res) {
        const { id, title, discription, image } = req.body
        if (!id) {
            return res.send({ status: false, message: "Blog ID is required to update the blog." })
        }
        if (!title) {
            return res.send({ status: false, message: "Please provide a blog title." })
        }
        if (!discription) {
            return res.send({ status: false, message: "Please enter a blog description." })
        }
        if (!image) {
            return res.send({ status: false, message: "Blog image is required." })
        }

        try {
            const updatedBlog = await blogsDB.findByIdAndUpdate(id, {
                title,
                discription,
                image
            })

            if (!updatedBlog) {
                return res.send({ status: false, message: "No blog found with the given ID. Please check and try again." })
            }

            return res.send({ status: true, message: "Your blog has been updated successfully.", data: updatedBlog })

        }
        catch (error) {
            return res.send({ status: false, message: "Oops! Something went wrong while updating the blog. Please try again later.", error: error.message })
        }
    }

    async deleteBlog(req, res) {
        const { id } = req.body;

        // Validate input
        if (!id) {
            return res.status(400).json({
                status: false,
                message: "Blog ID is required to delete the blog."
            });
        }

        try {
            const data = await blogsDB.findByIdAndDelete(id);

            if (!data) {
                return res.status(404).json({
                    status: false,
                    message: "No blog found with the given ID. Please check and try again."
                });
            }

            return res.status(200).json({
                status: true,
                message: "The blog has been deleted successfully.",
                data: []
            });

        } catch (error) {
            return res.status(500).json({
                status: false,
                message: "Something went wrong while deleting the blog. Please try again later.",
                error: error.message
            });
        }
    }

    async getTopReatedBlog(req, res) {
        try {
          const blogs = await blogsDB
            .find()
            .sort({ likes: -1 }) // Sort by likes descending
            .limit(3);           // Only top 5
      
          return res.status(200).json({
            status: true,
            message: "Top 5 blogs fetched successfully.",
            data: blogs,
          });
      
        } catch (error) {
          return res.status(500).json({
            status: false,
            message: "Internal server error. Please try again later.",
            error: error.message,
          });
        }
      }
      



}


module.exports = new Blogs();