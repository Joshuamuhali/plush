import { useParams } from 'react-router-dom';

interface BlogPostData {
  id: number;
  title: string;
  content: string;
  date: string;
  author: string;
  image: string;
  slug: string;
}

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  
  // In a real app, you would fetch this data based on the slug
  const post: BlogPostData = {
    id: 1,
    title: '10 Tips for First-Time Home Buyers',
    content: `
      <p>Buying your first home is an exciting milestone, but it can also be overwhelming. Here are some essential tips to help you navigate the process with confidence:</p>
      
      <h2 className="text-2xl font-bold mt-6 mb-4">1. Determine Your Budget</h2>
      <p>Before you start looking at properties, get pre-approved for a mortgage to understand how much you can afford. Don't forget to factor in additional costs like property taxes, insurance, and maintenance.</p>
      
      <h2 className="text-2xl font-bold mt-6 mb-4">2. Research Neighborhoods</h2>
      <p>Consider factors like commute times, school districts, and local amenities. Visit neighborhoods at different times of day to get a feel for the area.</p>
      
      <h2 className="text-2xl font-bold mt-6 mb-4">3. Work with a Real Estate Agent</h2>
      <p>A good agent can guide you through the process, negotiate on your behalf, and help you find properties that match your criteria.</p>
      
      <p className="mt-6">Remember, buying a home is a big decision. Take your time and don't rush into anything that doesn't feel right.</p>
    `,
    date: 'September 5, 2025',
    author: 'Jane Doe',
    image: '/placeholder.svg',
    slug: 'first-time-home-buyers-tips'
  };

  if (!post) {
    return <div>Post not found</div>;
  }

  return (
    <article className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
        <div className="flex items-center text-muted-foreground">
          <span>By {post.author}</span>
          <span className="mx-2">•</span>
          <time dateTime={post.date}>{post.date}</time>
        </div>
      </div>
      
      <div className="mb-12 h-96 bg-muted rounded-lg overflow-hidden">
        <img 
          src={post.image} 
          alt={post.title}
          className="w-full h-full object-cover"
        />
      </div>
      
      <div 
        className="prose lg:prose-lg max-w-none"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
      
      <div className="mt-12 pt-8 border-t">
        <h2 className="text-2xl font-bold mb-4">About the Author</h2>
        <div className="flex items-center">
          <div className="w-16 h-16 rounded-full bg-muted mr-4 overflow-hidden">
            <img 
              src="/placeholder.svg" 
              alt={post.author}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h3 className="font-semibold">{post.author}</h3>
            <p className="text-muted-foreground">Real Estate Expert</p>
          </div>
        </div>
      </div>
    </article>
  );
};

export default BlogPost;
