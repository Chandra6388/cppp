
import { useEffect, useState } from "react";
import BlogCard from "./blogCard";
import { Search, Calendar, Pen, Filter } from "lucide-react";
import { getBlogs, deleteBlog } from '@/service/admin/blogService'
import { SidebarProvider } from "@/components/ui/sidebar";
import Header from "@/components/layout/Header";
import MainSidebar from "@/components/layout/Sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import { sweetAlert } from '../../../Utils/CommonFunctions'

const Blog = () => {
  const navigate = useNavigate()
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [allBlogs, setAllBlogs] = useState([])
  const handleSidebarCollapseChange = (collapsed: boolean) => {
    setSidebarCollapsed(collapsed);
  };
  const handleMenuClick = () => setSidebarOpen(true);

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

  const handleDelete = async (blogId: string) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to delete this Blog?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#01c8a7",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await deleteBlog({ id: blogId });
          if (res.status) {
            sweetAlert("Success", "Blog has been deleted successfully", "success");
            getAllBlogs()
          } else {
            sweetAlert("Error", res.message || "Failed to delete blog", "error");
          }
        } catch (error) {
          console.error("Error in deleting user:", error);
          sweetAlert("Error", "An error occurred while deleting user", "error");
        }
      }
    });
  };

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
          <div className="mt-6 ml-8 flex justify-end mx-5">
            <Button
              type="button"
              onClick={() => navigate("/admin/add-blogs")}
              className="inline-flex w-auto px-6 py-2 bg-gradient-to-r from-[#01C8A9] to-[#01a088] text-white rounded-md"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-[#ffffff]"
              >
                <path d="M5 12h14"></path>
                <path d="M12 5v14"></path>
              </svg>
              Add New Blog
            </Button>
          </div>
          <div className="min-h-screen bg-gradient-to-br mt-8">
            <section className="pb-32 section-dark">
              <div className="mx-8">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                  {(allBlogs || []).map((post, index) => (
                    <BlogCard
                      key={post?._id}
                      post={post}
                      handleDelete={handleDelete} // ✅ Fix: use '=' not ':'
                      className="animate-fade-in-3d"
                      style={{
                        animationDelay: `${index * 100}ms`,
                        border: "1px solid #979797"
                      }}
                    />

                  ))}
                </div>
                {(allBlogs || []).length === 0 && (
                  <div className="text-center py-20">
                    <Calendar className="w-16 h-16 text-gray-500 mx-auto mb-6" />
                    <h3 className="text-2xl font-light text-gray-400 mb-4">No articles found</h3>
                    <p className="text-gray-500">Try adjusting your search terms or browse all articles</p>
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Blog;



