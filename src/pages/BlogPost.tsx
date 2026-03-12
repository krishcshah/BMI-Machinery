import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Calendar, User, ArrowRight } from "lucide-react";
import { blogPosts, BlogPost as BlogPostType } from "../data/blogPosts";
import StickySidebar from "../components/StickySidebar";

// Reusable Catalogue Integration Component
const CatalogueCTA = ({ category }: { category: string }) => {
  if (!category) return null;
  
  const encodedTag = encodeURIComponent(category);

  return (
    <div className="my-12 bg-blue-50 border border-blue-100 rounded-2xl p-8 text-center shadow-sm">
      <h3 className="text-2xl font-bold text-slate-900 mb-4">
        Looking for {category} Machinery?
      </h3>
      <p className="text-slate-600 mb-6 max-w-2xl mx-auto">
        Browse our current inventory of high-quality, pre-owned {category.toLowerCase()} machines imported directly from Europe.
      </p>
      <Link
        to={`/catalogue?category=${encodedTag}`}
        className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-md shadow-blue-600/20 group"
      >
        View {category} Machines
        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
      </Link>
    </div>
  );
};

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 px-4">
        <h1 className="text-4xl font-extrabold text-slate-900 mb-4">Post Not Found</h1>
        <p className="text-slate-600 mb-8">The article you are looking for does not exist.</p>
        <Link to="/blog" className="text-blue-600 font-medium hover:underline flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Back to Blog
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <div className="mb-8">
          <Link to="/blog" className="text-slate-500 hover:text-blue-600 font-medium flex items-center gap-2 text-sm transition-colors w-fit">
            <ArrowLeft className="w-4 h-4" /> Back to Blog
          </Link>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Main Content Area */}
          <article className="lg:w-2/3 bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
            
            {/* Hero Image */}
            <div className="aspect-[21/9] w-full overflow-hidden relative">
              <img
                src={post.imageUrl}
                alt={post.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>
              <div className="absolute bottom-6 left-6 right-6">
                <span className="inline-block bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full mb-3 uppercase tracking-wider">
                  {post.category}
                </span>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white leading-tight drop-shadow-md">
                  {post.title}
                </h1>
              </div>
            </div>

            <div className="p-8 md:p-12">
              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-6 text-sm text-slate-500 mb-10 pb-6 border-b border-slate-100">
                <span className="flex items-center gap-2 font-medium">
                  <User className="w-4 h-4 text-blue-500" />
                  {post.author}
                </span>
                <span className="flex items-center gap-2 font-medium">
                  <Calendar className="w-4 h-4 text-blue-500" />
                  {new Date(post.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                </span>
              </div>

              {/* Article Content */}
              <div className="prose prose-lg prose-slate max-w-none prose-headings:font-bold prose-headings:text-slate-900 prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6 prose-p:text-slate-600 prose-p:leading-relaxed prose-a:text-blue-600 hover:prose-a:text-blue-800 prose-img:rounded-xl prose-li:text-slate-600">
                {post.content.split('[CATALOGUE_CTA]').map((part, index, array) => (
                  <div key={index}>
                    <div dangerouslySetInnerHTML={{ __html: part }} />
                    {index < array.length - 1 && (
                      <div className="not-prose">
                        <CatalogueCTA category={post.category} />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Catalogue CTA Integration (Bottom) */}
              <div className="mt-12">
                <CatalogueCTA category={post.category} />
              </div>
            </div>
          </article>

          {/* Sidebar */}
          <div className="lg:w-1/3">
            <StickySidebar />
          </div>

        </div>
      </div>
    </div>
  );
}
