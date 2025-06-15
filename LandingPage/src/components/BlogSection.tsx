import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { ChevronRight, BookOpen } from "lucide-react";
import { getBlogs } from '@/service/apiService'
import BlogCard from "./BlogCard";

const BlogSection = () => {
  const handleSeeMore = () => {
    window.location.href = "/blog";
  };

    const [allBlogs, setAllBlogs] = useState([])
  
   
  
    console.log("allBlogs", allBlogs)
  
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
    <section className="py-32 section-dark relative">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 right-1/3 w-80 h-80 bg-gradient-to-br from-purple-500/8 to-pink-500/8 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-cyan-500/8 to-blue-500/8 rounded-full blur-3xl animate-float" style={{
          animationDelay: '3s'
        }}></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-20">
          <div className="inline-flex items-center px-8 py-4 rounded-full creative-card mb-12 text-base font-light text-purple-300 backdrop-blur-2xl border border-purple-500/20">
            <BookOpen className="w-5 h-5 mr-3 animate-pulse" />
            Insights & Updates
          </div>
          <h2 className="text-5xl md:text-6xl font-light mb-8 text-white">
            Stay Updated. <span className="text-gradient-primary font-extrabold">Learn.</span> Innovate.
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto font-light leading-relaxed">
            Discover the latest trends, tips, and insights in email signature design and digital communication
          </p>
        </div>

        <div className="relative max-w-7xl mx-auto mb-16">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {allBlogs.map((post, index) => (
                <CarouselItem key={post._id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                  <BlogCard post={post} className="h-full" />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex -left-12 bg-white/10 border-white/20 text-white hover:bg-white/20" />
            <CarouselNext className="hidden md:flex -right-12 bg-white/10 border-white/20 text-white hover:bg-white/20" />
          </Carousel>
        </div>

        <div className="text-center">
          <Button 
            size="lg" 
            onClick={handleSeeMore}
            className="btn-dark-modern text-white font-light text-xl px-16 py-8 rounded-3xl hover:scale-105 transition-all duration-300 shadow-2xl group"
          >
            See More Articles
            <ChevronRight className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform duration-300" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default BlogSection;
