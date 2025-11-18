import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import { view_page, click_button } from '../utils/analytics';

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  // Add a day to counteract potential timezone issues where parsing might yield the previous day.
  date.setUTCDate(date.getUTCDate() + 1);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const isNewPost = (dateString: string) => {
    const postDate = new Date(dateString).getTime();
    const twoWeeksAgo = new Date().getTime() - (14 * 24 * 60 * 60 * 1000);
    return postDate > twoWeeksAgo;
};


const BlogPage: React.FC = () => {
  const { blog } = useAppContext();
  const [posts, setPosts] = useState(blog.posts);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 5; // 1 featured + 4 grid

  useEffect(() => {
    view_page('/blog');
  }, []);

  const featuredPost = posts.find(p => p.featured) || posts[0];
  const otherPosts = posts.filter(p => p.id !== featuredPost.id);
  const paginatedPosts = otherPosts.slice((currentPage - 1) * (postsPerPage - 1), currentPage * (postsPerPage - 1));

  const allCategories = [...new Set(posts.map(p => p.category))];

  return (
    <div className="max-w-6xl mx-auto">
      <header className="text-center py-12">
        <h1 className="text-5xl font-extrabold text-primary mb-4">The Founder’s Journal</h1>
        <p className="text-xl text-gray-600">Real lessons, practical tools, and stories from entrepreneurs like you.</p>
      </header>

      {featuredPost && (
        <Card className="mb-12 grid md:grid-cols-2 overflow-hidden">
          <div className="p-8 flex flex-col justify-center">
            <div className="flex gap-2 mb-4">
              <Badge color="yellow" className="self-start">Featured Post</Badge>
              {isNewPost(featuredPost.date) && <Badge color="green">New</Badge>}
            </div>
            <h2 className="text-3xl font-bold mb-4">{featuredPost.title}</h2>
            <p className="text-gray-600 mb-6">{featuredPost.excerpt}</p>
            <div className="flex items-center text-sm text-gray-500 mb-6">
              <span>{featuredPost.author}</span>
              <span className="mx-2">•</span>
              <span>{formatDate(featuredPost.date)}</span>
              <span className="mx-2">•</span>
              <span>{featuredPost.readTime}</span>
            </div>
            <Button to={`/blog/${featuredPost.slug}`} onClick={() => click_button('Read More', `/blog/${featuredPost.slug}`)}>
              Read More
            </Button>
          </div>
          {/* Optional Image for featured post */}
          {/* <div className="bg-gray-200 h-64 md:h-auto"></div> */}
        </Card>
      )}

      <div className="grid lg:grid-cols-3 gap-8">
        <main className="lg:col-span-2">
          <div className="grid md:grid-cols-2 gap-8">
            {paginatedPosts.map(post => (
              <Card key={post.id} className="flex flex-col">
                <div className="p-6 flex-grow">
                  <div className="flex flex-wrap gap-2 mb-2 items-center">
                    {post.tags.slice(0, 2).map(tag => <Badge key={tag}>{tag}</Badge>)}
                    {isNewPost(post.date) && <Badge color="green">New</Badge>}
                  </div>
                  <h2 className="text-xl font-bold mb-2">{post.title}</h2>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">{post.excerpt}</p>
                </div>
                <div className="p-6 pt-0 mt-auto">
                  <Link to={`/blog/${post.slug}`} className="font-semibold text-accent hover:text-accent-hover" onClick={() => click_button('Read More', `/blog/${post.slug}`)}>
                    Read More →
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </main>
        
        <aside className="space-y-6">
          <Card className="p-6">
            <h3 className="font-bold text-lg mb-4">Categories</h3>
            <ul className="space-y-2">
              {allCategories.map(cat => (
                <li key={cat}><a href="#" className="text-accent hover:underline">{cat}</a></li>
              ))}
            </ul>
          </Card>
          <Card className="p-6">
            <h3 className="font-bold text-lg mb-4">Write for Us</h3>
            <p className="text-sm text-gray-600">Have a story to share? We'd love to hear from you. <a href="#" className="text-accent hover:underline">Get in touch</a>.</p>
          </Card>
        </aside>
      </div>

      <div className="text-center py-12">
        <Button to="/find/quiz" variant="secondary">Ready to find your business idea? Try the free quiz.</Button>
      </div>
    </div>
  );
};

export default BlogPage;