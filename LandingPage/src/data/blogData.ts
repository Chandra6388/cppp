
export interface BlogPost {
  _id: string;
  title: string;
  authorName: string;
  discription: string;
  image: string;
  likes: string;
  createdAt?: string; 
}

 


export const blogCategories = [
  { name: "All", slug: "all" },
  { name: "Latest", slug: "latest" },
  { name: "Popular", slug: "popular" },
  { name: "Design", slug: "design" },
  { name: "Analytics", slug: "analytics" },
  { name: "Tips", slug: "tips" }
];
