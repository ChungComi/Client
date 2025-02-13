import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import customFetch from "../components/ui/customFetch.jsx";
import '../components/ui/css/post.css';

const Post = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [myId, setMyId] = useState("");
  const [registerId, setRegisterId] = useState("");

  // 게시글 정보 가져오기
  const getPostInfo = () => {
    if (postId) {
      customFetch(`/api/post/${postId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setPost(data.result.data);
            // 게시글 작성자의 id 저장
            setRegisterId(data.result.data.member.id);
          } else {
            console.error('게시글을 불러오지 못했습니다.');
          }
        })
        .catch((error) => console.error('Error fetching post:', error));
    }
  };

  // 회원 정보 불러오기 (현재 로그인한 회원의 id)
  const refreshMemberInfo = () => {
    customFetch("/api/member/onlyId", { method: "GET" })
      .then(response => response.json())
      .then(data => {
        if (data.success && data.result) {
          const id = data.result.data;
          setMyId(id);
        } else {
          console.error("회원 정보를 가져오지 못했습니다.", data);
        }
      })
      .catch(error => console.error("회원 정보 요청 중 에러 발생:", error));
  };

  // 컴포넌트 마운트 시 게시글 정보와 회원 정보를 불러옵니다.
  useEffect(() => {
    getPostInfo();
    refreshMemberInfo();
  }, [postId]);

  const deletePost = () => {
          if (postId) {
            customFetch(`/post/${postId}`, {method: "DELETE"})
              .then((res) => res.json())
              .then((data) => {
                if (data.success) {
                    navigate('/board');
                } else {
                  console.error('게시글을 삭제하지 못했습니다');
                }
              })
              .catch((error) => console.error('Error fetching delete:', error));
          }
  }

  return (
    <div className="container">
      {post ? (
        <article>
          <header className="post-header">
            <h1 className="post-title">{post.title}</h1>
            <div className="post-meta">
              <div className="post-details">
                <span className="author">작성자: {post.member.name}</span>
                <span className="views">조회수: {post.views === null ? 0 : post.views}</span>
              </div>
              {registerId === myId && (
                <div className="post-actions">
                  <button
                    className="edit-button"
                    onClick={() =>
                      navigate(`/modifyPost/${postId}`, { state: { title: post.title, content: post.content } })
                    }
                  >
                    수정
                  </button>
                  <button className="delete-button" onClick={()=>{deletePost()}}>삭제</button>
                </div>
              )}
            </div>
          </header>
          <section className="post-content">
            <p>{post.content}</p>
          </section>
          <section className="comments-section">
            <h2>댓글</h2>
            {post.comments && post.comments.length > 0 ? (
              post.comments.map((comment, idx) => (
                <div className="comment" key={idx}>
                  <p>
                    <strong>{comment.author}:</strong> {comment.text}
                  </p>
                </div>
              ))
            ) : (
              <p>댓글이 없습니다.</p>
            )}
          </section>
        </article>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Post;
