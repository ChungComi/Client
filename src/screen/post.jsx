import React from 'react';
import '../components/ui/css/post.css';

const Post = () => {
    return (
        <div className="container">
            <h1 className="post-title">첫 번째 게시글</h1>
            <div className="post-meta">
                <span className="author">작성자: 관리자</span>
                <span className="views">조회수: 120</span>
            </div>
            <div className="post-content">
                <p>이곳에 게시글 본문이 들어갑니다. 여러 줄의 내용을 입력할 수 있습니다.</p>
            </div>
            <div className="comments-section">
                <h2>댓글</h2>
                <div className="comment">
                    <p><strong>사용자1:</strong> 좋은 글이네요!</p>
                </div>
                <div className="comment">
                    <p><strong>사용자2:</strong> 유용한 정보 감사합니다.</p>
                </div>
            </div>
        </div>
    );
};

export default Post;
