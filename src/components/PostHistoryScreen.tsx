import React, { useState, useEffect } from "react";
import "../components/screens.css";
import { API_BASE_URL } from "../lib/apiConfig";

export function PostHistoryScreen() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: { session } } = await (window as any).supabase.auth.getSession();
      if (!session) {
        setError('You must be logged in');
        setLoading(false);
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/posts/history`, {
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch post history');
      }

      const data = await response.json();
      setPosts(Array.isArray(data.posts) ? data.posts : []);
      setLoading(false);
    } catch (err: any) {
      setError(err.message || 'Error fetching posts');
      setLoading(false);
    }
  };

  const handleReRoast = (postId: string) => {
    const post = posts.find(p => p.id === postId);
    if (post) {
      // Navigate to roast screen with this post
      console.log('Re-roasting post:', post);
    }
  };

  if (loading) {
    return (
      <div className="screen-container">
        <div className="screen-header">
          <h2>Post History</h2>
          <p>Your recent posts and performance</p>
        </div>
        <div style={{ textAlign: "center", padding: "40px", color: "var(--t2)" }}>
          Loading posts...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="screen-container">
        <div className="screen-header">
          <h2>Post History</h2>
          <p>Your recent posts and performance</p>
        </div>
        <div style={{ textAlign: "center", padding: "40px", color: "var(--bad)" }}>
          Error: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="screen-container">
      <div className="screen-header">
        <h2>Post History</h2>
        <p>Your recent posts and performance</p>
      </div>
      <div className="posts-list">
        {posts.length > 0 ? (
          posts.map((post: any) => (
            <div key={post.id} className="post-item">
              <div className="post-content">
                <p>{post.content || post.text}</p>
              </div>
              <div className="post-meta">
                <div className="meta-item">
                  <span className="label">Score</span>
                  <span className="score" style={{color: (post.score || post.roastScore) >= 80 ? "#22c55e" : "#eab308"}}>
                    {post.score || post.roastScore || 0}
                  </span>
                </div>
                <div className="meta-item">
                  <span className="label">Engagements</span>
                  <span className="value">{post.engagements || 0}</span>
                </div>
                <div className="meta-item">
                  <span className="label">Date</span>
                  <span className="value">{post.createdAt ? new Date(post.createdAt).toLocaleDateString() : 'Unknown'}</span>
                </div>
                <button className="btn-small" onClick={() => handleReRoast(post.id)}>Re-roast</button>
              </div>
            </div>
          ))
        ) : (
          <div style={{ textAlign: "center", padding: "40px", color: "var(--t2)" }}>
            No posts yet. Start roasting!
          </div>
        )}
      </div>
    </div>
  );
}

export default PostHistoryScreen;
