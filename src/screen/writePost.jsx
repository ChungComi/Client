import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../components/ui/css/writePost.css';
import customFetch from "../components/ui/customFetch.jsx";

const WritePost = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    const newPost = { title, content };

    // 글 작성 API 호출 (POST 요청)
    customFetch('/api/post', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newPost),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          // 글 작성 성공 시 게시판 페이지로 이동
          navigate('/board');
        } else {
          console.error('글 작성 실패:', data);
        }
      })
      .catch((error) => console.error('글 작성 중 오류 발생:', error));
  };

  return (
    <div className="container">
      <h1>글쓰기</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">제목</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="제목을 입력하세요"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="content">내용</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="내용을 입력하세요"
            required
          />
        </div>
        <button type="submit">등록</button>
      </form>
    </div>
  );
};

export default WritePost;
