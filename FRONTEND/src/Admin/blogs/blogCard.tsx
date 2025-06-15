import { Calendar, ChevronRight, Pen, Trash2 } from "lucide-react";
import { CSSProperties } from "react";
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import { deleteBlog } from "@/service/admin/blogService"
import { sweetAlert } from '../../../Utils/CommonFunctions'

interface BlogPost {
    _id: string;
    title: string;
    authorName: string;
    discription: string;
    image: string;
    likes: string;
    createdAt?: string;
}
interface BlogCardProps {
    post: BlogPost;
    className?: string;
    style?: CSSProperties;
    handleDelete?: (id: string) => void;
}

const BlogCard = ({ post, className = "", style , handleDelete }: BlogCardProps) => {
    const navigate = useNavigate()
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

 

    return (
        <div
            className={`creative-card p-0 rounded-3xl overflow-hidden cursor-pointer group hover-3d transition-all duration-500 ${className}`}
            onClick={() => navigate("/admin/blog/details", { state: { id: post?._id } })}
            style={style}
        >
            <div className="relative overflow-hidden rounded-t-3xl">
                <div className="absolute top-3 right-3 flex gap-2 z-10">
                    <div
                        className="bg-black/50 hover:bg-black/70 text-white p-2 rounded-full cursor-pointer transition"
                        onClick={(e) => {
                            e.stopPropagation();
                            navigate("/admin/edit-blog", { state: { id: post?._id } });
                        }}
                    >
                        <Pen className="w-4 h-4" />
                    </div>
                    <div
                        className="bg-black/50 hover:bg-red-600 text-white p-2 rounded-full cursor-pointer transition"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleDelete?.(post._id);
                        }}
                    >
                        <Trash2 className="w-4 h-4" />
                    </div>
                </div>

                {/* Blog Image */}
                <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-48 sm:h-52 object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>



            <div className="p-6 sm:p-8">
                <div className="flex items-center text-gray-400 text-sm mb-4 font-light">
                    <Calendar className="w-4 h-4 mr-2" />
                    {formatDate(post?.createdAt)}
                </div>

                <h3 className="text-xl sm:text-2xl font-light text-white mb-4 leading-tight group-hover:text-cyan-300 transition-colors duration-300">
                    {post.title}
                </h3>

                <p
                    style={{ maxWidth: "100%" }}
                    className="clamp-4-lines text-gray-400 font-light leading-relaxed mb-6 group-hover:text-gray-300 transition-colors duration-300"
                    dangerouslySetInnerHTML={{ __html: post?.discription }}
                ></p>
                <div className="flex items-center text-cyan-400 font-light group-hover:text-cyan-300 transition-colors duration-300">
                    Read More
                    <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                </div>
            </div>
        </div>
    );
};

export default BlogCard;
