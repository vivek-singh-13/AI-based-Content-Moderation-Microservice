import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import axios from 'axios';
import '../styles/PostPage.css';

const VITE_URL = import.meta.env.VITE_BACKEND_URL;

function PostPage({ token }) {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [text, setText] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPostAndComments = async () => {
      try {
        const postResponse = await axios.get(`${VITE_URL}/posts/${id}`);
        setPost(postResponse.data.post);

        const commentsResponse = await axios.get(`${VITE_URL}/comments?postId=${id}`);
        setComments(commentsResponse.data);
      } catch (error) {
        if (error.response && error.response.status === 403) {
          localStorage.removeItem('token');
          navigate('/login');
        } else {
          console.error("Error fetching data:", error);
        }
      }
    };
    fetchPostAndComments();
  }, [id, navigate, token]);

  const handleCommentSubmit = async () => {
    if (!token) {
      navigate('/login');
      return;
    }
    try {
      const response = await axios.post(`${VITE_URL}/comments`,
        { text, postId: id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setText('');
      if (!response.data.flagged) {
        setComments([...comments, { text, _id: Date.now() }]);
      } else {
        alert("Your comment was flagged for moderation.");
      }
    } catch (error) {
      
      console.error("Error submitting comment:", error);
    }

    console.log(id);
    //console.log(postId);
  };

  return (
    <div className="post-container">
      {post ? (
        <div className="post-content">
          <h1 className="post-title">{post.title}</h1>
          <p className="post-body">{post.content}</p>
        </div>
      ) : (
        <p className="loading-message">Loading post...</p>
      )}
      <h2 className="comments-title">Comments</h2>
      {comments.length > 0 ? (
        <div className="comments-section">
          {comments.map(comment => (
            <p key={comment._id} className="comment">{comment.text}</p>
          ))}
        </div>
      ) : (
        <p className="no-comments">No comments yet.</p>
      )}
      <textarea className='comment-input' value={text} onChange={e => setText(e.target.value)} placeholder="Write a comment..."></textarea>
      <button className='submit-btn' onClick={handleCommentSubmit}>Submit Comment</button>
    </div>
  );
}

export default PostPage;
