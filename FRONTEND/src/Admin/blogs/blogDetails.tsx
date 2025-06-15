import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Calendar, ArrowLeft, Facebook, Linkedin, Twitter, Mail } from "lucide-react";
import BlogCard from "./blogCard";
import { getBlogById } from '@/service/admin/blogService'
import { SidebarProvider } from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import MainSidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";

const BlogDetail = () => {
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const location = useLocation()
  const [Blog, setBlog] = useState([])
  useEffect(() => {
    getBlogs()
  }, [])


  const getBlogs = async () => {
    const req = { id: location?.state?.id }
    await getBlogById(req)
      .then((res) => {
        if (res.status) {
          setBlog(res.data)
        }
        else {
          setBlog([])
        }
      })
      .catch((error) => {
        console.log("Error in fetching blog data", error)
      })
  }


  if (Blog?.length == 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-light text-white mb-4">Post Not Found</h1>
          <Link to="/blog" className="text-cyan-400 hover:text-cyan-300">← Back to Blog</Link>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const shareUrl = window.location.href;
  const shareTitle = Blog?.[0]?.title;

  const handleShare = (platform: string) => {
    let url = '';
    switch (platform) {
      case 'facebook':
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
        break;
      case 'twitter':
        url = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`;
        break;
      case 'linkedin':
        url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
        break;
      case 'email':
        url = `mailto:?subject=${encodeURIComponent(shareTitle)}&body=${encodeURIComponent(shareUrl)}`;
        break;
    }
    if (url) window.open(url, '_blank');
  };
  const handleSidebarCollapseChange = (collapsed: boolean) => {
    setSidebarCollapsed(collapsed);
  };
  const handleMenuClick = () => setSidebarOpen(true);

  return (

    <SidebarProvider defaultOpen={!isMobile}>
      <div className="flex w-full min-h-screen bg-[#001430] font-sans">
        <MainSidebar
          open={sidebarOpen}
          onOpenChange={setSidebarOpen}
          onCollapseChange={handleSidebarCollapseChange}
        />

        <div
          className="flex flex-col flex-1 transition-all duration-300 ease-in-out"
          style={{
            width: "100%",
            marginLeft: isMobile ? 0 : sidebarCollapsed ? "70px" : "250px"
          }}
        >
          <Header onMenuClick={handleMenuClick} />
          <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
            <div className="pt-8 pb-20">
              <div className="px-4">
                <div className="mb-8">
                  <Link
                    to="/admin/all-blog"
                    className="inline-flex items-center text-cyan-400 hover:text-cyan-300 transition-colors duration-300"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Blog
                  </Link>
                </div>
                <div className="relative overflow-hidden rounded-3xl flex justify-center items-center mb-12">
                  <img
                    src={Blog?.[0]?.image}
                    alt={Blog?.[0]?.title}
                    className="w-auto max-w-full h-64 md:h-96 object-cover rounded-xl"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                </div>


                <div className="max-w-4xl mx-auto">
                  <div className="mb-12">
                    <h1 className="text-4xl md:text-5xl font-light text-white mb-6 leading-tight">
                      {Blog?.[0]?.title}
                    </h1>

                    <div className="flex flex-wrap items-center gap-6 text-gray-400 mb-8">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2" />
                        {formatDate(Blog?.[0]?.createdAt)}
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 mb-8">
                      <span className="text-gray-400 font-light">Share:</span>
                      <button
                        onClick={() => handleShare('facebook')}
                        className="p-2 rounded-full bg-white/5 hover:bg-blue-600/20 text-gray-400 hover:text-blue-400 transition-colors duration-300"
                      >
                        <Facebook className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleShare('twitter')}
                        className="p-2 rounded-full bg-white/5 hover:bg-blue-400/20 text-gray-400 hover:text-blue-400 transition-colors duration-300"
                      >
                        <Twitter className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleShare('linkedin')}
                        className="p-2 rounded-full bg-white/5 hover:bg-blue-500/20 text-gray-400 hover:text-blue-500 transition-colors duration-300"
                      >
                        <Linkedin className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleShare('email')}
                        className="p-2 rounded-full bg-white/5 hover:bg-gray-500/20 text-gray-400 hover:text-gray-300 transition-colors duration-300"
                      >
                        <Mail className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="creative-card p-8 md:p-12 rounded-3xl mb-16" style={{ border: "1px solid rgb(213 213 213)" }}>

                    <div className="prose prose-lg prose-invert max-w-none">
                      <p
                        className="font-light leading-relaxed mb-6 group-hover:text-gray-300 transition-colors duration-300 text-white"
                        dangerouslySetInnerHTML={{ __html: Blog?.[0]?.discription }}
                      ></p>
                    </div>
                  </div>
                  {Blog.length > 0 && (
                    <div>
                      <h3 className="text-3xl font-light text-white mb-8 text-center">Related Articles</h3>
                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 ">
                        {(Blog).map((relatedPost) => (
                          <BlogCard key={relatedPost.id} post={relatedPost} />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default BlogDetail;
