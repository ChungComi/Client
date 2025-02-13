import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import '../components/ui/css/writePost.css';
import customFetch from "../components/ui/customFetch.jsx";

const ModifyPost = () => {
  const { postId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  // 전달받은 state가 있으면 그 값을, 없으면 빈 문자열로 초기화
  const [title, setTitle] = useState(location.state?.title || '');
  const [content, setContent] = useState(location.state?.content || '');

  // 만약 location.state가 없는 경우(직접 접근 등)에는 다시 데이터를 불러옵니다.
  useEffect(() => {
    if (!location.state && postId) {
      customFetch(`/api/post/${postId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setTitle(data.result.data.title);
            setContent(data.result.data.content);
          } else {
            console.error('게시글 정보를 불러오지 못했습니다.', data);
          }
        })
        .catch((error) => console.error('Error fetching post info:', error));
    }
  }, [location.state, postId]);

  const handleSubmit = (e) => {
    e.preventDefault();

    // 현재 시간(수정시간)을 ISO 문자열 형태로 생성합니다.
    const modifiedAt = new Date().toISOString();
    const modifiedPost = { title, content, modifiedAt };

    customFetch(`/api/post/${postId}`, {
      method: 'PUT', // 수정에는 PUT 또는 PATCH를 사용합니다.
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(modifiedPost),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          navigate('/board');
        } else {
          console.error('글 수정 실패:', data);
        }
      })
      .catch((error) => console.error('글 수정 중 오류 발생:', error));
  };

  return (
    <div className="container">
      <h1>글 수정</h1>
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
        <button type="submit">수정 완료</button>
      </form>
    </div>
  );
};

export default ModifyPost;
