import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  image: string;
  slug: string;
}

const Blog = () => {
  const [posts] = useState<BlogPost[]>([
    {
      id: 1,
      title: '10 Tips for First-Time Home Buyers',
      excerpt: 'Learn the essential tips and tricks for navigating the real estate market as a first-time home buyer.',
      date: 'September 10, 2025',
      readTime: '5 min read',
      image: '/placeholder.svg',
      slug: 'first-time-home-buyer-tips'
    },
    {
      id: 2,
      title: 'The Future of Smart Homes',
      excerpt: 'Discover how smart home technology is changing the way we live and what it means for property values.',
      date: 'August 28, 2025',
      readTime: '4 min read',
      image: '/placeholder.svg',
      slug: 'future-smart-homes'
    },
    {
      id: 3,
      title: 'Investment Properties: A Beginner\'s Guide',
      excerpt: 'Everything you need to know about getting started with real estate investment properties.',
      date: 'August 15, 2025',
      readTime: '6 min read',
      image: '/placeholder.svg',
      slug: 'investment-properties-guide'
    }
  ]);

  return (
    <div className="min-h-screen">
      <Navigation />
      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-7xl mx-auto"
        >
          <div className="container mx-auto px-4 py-12">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold mb-4">Our Blog</h1>
              <p className="text-xl text-muted-foreground mb-8">Insights, tips, and news about real estate</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <Card key={post.id} className="flex flex-col h-full">
                  <div className="h-48 bg-muted">
                    <img 
                      src={post.image} 
                      alt={post.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardHeader>
                    <div className="flex justify-between items-center text-sm text-muted-foreground mb-2">
                      <span>{post.date}</span>
                      <span>{post.readTime}</span>
                    </div>
                    <CardTitle className="text-xl">{post.title}</CardTitle>
                    <CardDescription>{post.excerpt}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="text-muted-foreground">{post.excerpt}</p>
                  </CardContent>
                  <CardFooter>
                    <Button asChild variant="link" className="p-0 h-auto">
                      <Link to={`/blog/${post.slug}`}>
                        Read More <span className="ml-1">→</span>
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
};

export default Blog;
