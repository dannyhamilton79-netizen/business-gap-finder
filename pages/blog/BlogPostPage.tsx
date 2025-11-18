import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { view_page, click_button } from '../../utils/analytics';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';

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

const BlogPostPage: React.FC = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { blog, updateBlog } = useAppContext();
  const post = blog.posts.find(p => p.slug === slug);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (post) {
      view_page(`/blog/${slug}`);
      // Increment view count - a simple example of updating state
      const updatedPosts = blog.posts.map(p =>
        p.id === post.id ? { ...p, views: (p.views || 0) + 1 } : p
      );
      updateBlog({ posts: updatedPosts });
    }
  }, [slug, post]);

  if (!post) {
    return (
      <div className="text-center py-20">
        <h1 className="text-4xl font-bold">Post not found</h1>
        <p className="text-gray-600 mt-4">The article you're looking for doesn't exist.</p>
        <Button to="/blog" className="mt-8">Back to Blog</Button>
      </div>
    );
  }

  const relatedPosts = blog.posts.filter(p => post.related?.includes(p.slug));

  const handleShare = (platform: string) => {
    click_button(`Share on ${platform}`);
    const url = window.location.href;
    const text = `Check out this article: ${post.title}`;
    let shareUrl = '';
    switch (platform) {
      case 'X':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
        break;
      case 'LinkedIn':
        shareUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(post.title)}`;
        break;
    }
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <header className="mb-8">
        <Link to="/blog" className="text-accent font-semibold mb-4 inline-block">← Back to Blog</Link>
        <h1 className="text-4xl md:text-5xl font-extrabold text-primary mb-4">{post.title}</h1>
        <div className="flex items-center text-gray-500">
          <span>{post.author}</span>
          <span className="mx-2">•</span>
          <span>{formatDate(post.date)}</span>
          <span className="mx-2">•</span>
          <span>{post.readTime}</span>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
            {post.tags.map(tag => <Badge key={tag} color="blue">{tag}</Badge>)}
        </div>
      </header>

      <article 
        className="prose prose-lg max-w-none prose-headings:text-primary prose-p:text-gray-700 prose-strong:text-gray-800 prose-ul:list-disc prose-ul:pl-6 prose-li:my-1 prose-a:text-accent hover:prose-a:text-accent-hover"
        dangerouslySetInnerHTML={{ __html: post.body }}
      />
      
      <footer className="mt-12 pt-8 border-t">
        <div className="flex justify-between items-center">
            <p className="font-semibold">Share this article:</p>
            <div className="flex gap-2">
                <Button variant="outline" onClick={() => handleShare('X')}>X</Button>
                <Button variant="outline" onClick={() => handleShare('LinkedIn')}>LinkedIn</Button>
            </div>
        </div>
        
        {relatedPosts.length > 0 && (
            <div className="mt-12">
                <h3 className="text-2xl font-bold mb-4">Related Articles</h3>
                <div className="grid md:grid-cols-2 gap-6">
                    {relatedPosts.map(related => (
                        <Card key={related.id}>
                            <div className="p-6">
                                <h4 className="font-bold mb-2">{related.title}</h4>
                                <p className="text-sm text-gray-600 mb-4">{related.excerpt}</p>
                                <Link to={`/blog/${related.slug}`} className="text-accent font-semibold">Read More →</Link>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        )}
      </footer>

       <div className="text-center py-12 my-8 bg-gray-50 rounded-lg">
        <h3 className="text-2xl font-bold mb-2">Ready to turn your idea into income?</h3>
        <p className="text-gray-600 mb-6">Use our free tools to find and plan your next business.</p>
        <Button to="/find/quiz" variant="primary">Try Business Gap Finder Free</Button>
      </div>

    </div>
  );
};

export default BlogPostPage;