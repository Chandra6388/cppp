
import { useEffect, useState } from "react";
import { blogCategories } from "@/data/blogData";
import BlogCard from "@/components/BlogCard";
import { Search, Calendar, BookOpen, Filter } from "lucide-react";
import { getBlogs } from '@/service/apiService'

const Blog = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [allBlogs, setAllBlogs] = useState([])

  const filteredPosts = allBlogs?.filter(post => {
    const matchesSearch = post?.title?.toLowerCase()?.includes(searchTerm.toLowerCase()) ||
      post?.authorName?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch
  });


  useEffect(() => {
    getAllBlogs()
  }, [])

  const getAllBlogs = async () => {
    const req = {}
    await getBlogs(req)
      .then((res) => {
        if (res.status) {
          setAllBlogs(res.data)
        }
        else {
          setAllBlogs([])
        }

      })
      .catch((error) => {
        console.log("Error in fetching blog data", error)
      })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <section className="pt-32 pb-20 section-dark relative">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-cyan-500/10 to-purple-500/10 rounded-full blur-3xl animate-float"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-8 py-4 rounded-full creative-card mb-12 text-base font-light text-purple-300 backdrop-blur-2xl border border-purple-500/20">
              <BookOpen className="w-5 h-5 mr-3 animate-pulse" />
              Knowledge Hub
            </div>
            <h1 className="text-5xl md:text-6xl font-light mb-8 text-white">
              Email Signature <span className="text-gradient-primary font-extrabold">Insights</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto font-light leading-relaxed">
              Expert insights, tips, and trends to help you master the art of professional email communication
            </p>
          </div>
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500/50 transition-colors duration-300"
              />
            </div>
          </div>
        </div>
      </section>
      <section className="pb-32 section-dark">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {filteredPosts?.map((post, index) => (
              <BlogCard
                key={post?._id}
                post={post}
                className="animate-fade-in-3d"
                style={{
                  animationDelay: `${index * 100}ms`
                }}
              />
            ))}
          </div>

          {filteredPosts?.length === 0 && (
            <div className="text-center py-20">
              <Calendar className="w-16 h-16 text-gray-500 mx-auto mb-6" />
              <h3 className="text-2xl font-light text-gray-400 mb-4">No articles found</h3>
              <p className="text-gray-500">Try adjusting your search terms or browse all articles</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Blog;
