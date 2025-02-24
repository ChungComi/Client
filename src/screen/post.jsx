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
    const [newComment, setNewComment] = useState("");

    // 대댓글 입력창 상태: top-level 댓글에 대한 대댓글 입력 값과 표시 여부
    const [childCommentInputs, setChildCommentInputs] = useState({}); // { [parentCommentId]: string }
    const [childInputVisibility, setChildInputVisibility] = useState({}); // { [parentCommentId]: boolean }

    // 댓글 수정 상태: 각 댓글의 수정 입력 값과 표시 여부
    const [editCommentInputs, setEditCommentInputs] = useState({}); // { [commentId]: string }
    const [editInputVisibility, setEditInputVisibility] = useState({}); // { [commentId]: boolean }

    // 게시글 정보 가져오기
    const getPostInfo = () => {
        if (postId) {
            customFetch(`/api/post/${postId}`)
                .then((res) => res.json())
                .then((data) => {
                    console.log(data.result);
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

    // 게시글에 대한 댓글 등록 함수
    const registerComment = async () => {
        if (!newComment.trim()) {
            alert("댓글 내용을 입력해주세요.");
            return;
        }
        try {
            const response = await customFetch(`/api/comment/${postId}`, {
                method: "POST",
                headers: {
                    'Content-Type': 'text/plain'
                },
                body: newComment
            });
            const data = await response.json();
            if (data.success) {
                getPostInfo();
                setNewComment("");
            } else {
                console.error("댓글 등록 실패", data);
            }
        } catch (error) {
            console.error("댓글 등록 오류", error);
        }
    };

    // top-level 댓글에 대한 대댓글 등록 함수 (부모 댓글의 id를 이용)
    const registerChildComment = async (parentCommentId) => {
        const childContent = childCommentInputs[parentCommentId];
        if (!childContent || !childContent.trim()) {
            alert("대댓글 내용을 입력해주세요.");
            return;
        }
        try {
            const response = await customFetch(`/api/comment/child/${parentCommentId}`, {
                method: "POST",
                headers: {
                    'Content-Type': 'text/plain'
                },
                body: childContent
            });
            const data = await response.json();
            if (data.success) {
                getPostInfo();
                setChildCommentInputs(prev => ({ ...prev, [parentCommentId]: "" }));
                setChildInputVisibility(prev => ({ ...prev, [parentCommentId]: false }));
            } else {
                console.error("대댓글 등록 실패", data);
            }
        } catch (error) {
            console.error("대댓글 등록 오류", error);
        }
    };

    // 댓글 좋아요 함수 (좋아요 엔드포인트가 있다고 가정)
    const likeComment = async (commentId) => {
        try {
            const response = await customFetch(`/api/comment/like/${commentId}`, {
                method: "POST"
            });
            const data = await response.json();
            if (data.success) {
                getPostInfo();
            } else {
                console.error("좋아요 실패", data);
            }
        } catch (error) {
            console.error("좋아요 요청 오류", error);
        }
    };

    // 댓글 삭제 함수
    const deleteComment = async (commentId) => {
        try {
            const response = await customFetch(`/api/comment/${commentId}`, {
                method: "DELETE"
            });
            const data = await response.json();
            if (data.success) {
                getPostInfo();
            } else {
                console.error("댓글 삭제 실패", data);
            }
        } catch (error) {
            console.error("댓글 삭제 오류", error);
        }
    };

    // 댓글 수정 함수
    const modifyComment = async (commentId) => {
        const newContent = editCommentInputs[commentId];
        if (!newContent || !newContent.trim()) {
            alert("수정할 내용을 입력해주세요.");
            return;
        }
        try {
            const response = await customFetch(`/api/comment/${commentId}`, {
                method: "PUT",
                headers: {
                    'Content-Type': 'text/plain'
                },
                body: newContent
            });
            const data = await response.json();
            if (data.success) {
                getPostInfo();
                setEditInputVisibility(prev => ({ ...prev, [commentId]: false }));
            } else {
                console.error("댓글 수정 실패", data);
            }
        } catch (error) {
            console.error("댓글 수정 오류", error);
        }
    };

    // top-level 댓글에 대해 대댓글 입력창 토글
    const toggleChildInput = (commentId) => {
        setChildInputVisibility(prev => ({
            ...prev,
            [commentId]: !prev[commentId]
        }));
    };

    // 댓글 수정 입력창 토글
    const toggleEditInput = (commentId, currentContent) => {
        setEditInputVisibility(prev => ({ ...prev, [commentId]: !prev[commentId] }));
        // 최초 토글 시 기존 내용을 기본값으로 설정
        if (!editCommentInputs[commentId] && currentContent) {
            setEditCommentInputs(prev => ({ ...prev, [commentId]: currentContent }));
        }
    };

    // 컴포넌트 마운트 시 게시글과 회원 정보 불러오기
    useEffect(() => {
        getPostInfo();
        refreshMemberInfo();
    }, []);

    // 재귀적으로 대댓글(자식 댓글) 렌더링 (대댓글에도 수정/삭제 버튼 추가)
    const renderChildComments = (childComments) => {
        return childComments.map((child) => (
            <div key={child.id} className="child-comment" style={{ marginLeft: "20px", borderLeft: "1px solid #ccc", paddingLeft: "10px" }}>
                <p>
                    <strong>{child.member.name}</strong>: {child.content}
                </p>
                <div className="comment-actions">
                    <span className="like-count">{child.likes}</span>
                    <button className="like-button" onClick={() => likeComment(child.id)}>좋아요</button>
                    {child.member.id === myId && (
                        <>
                            <button className="edit-button" onClick={() => toggleEditInput(child.id, child.content)}>수정</button>
                            <button className="delete-button" onClick={() => deleteComment(child.id)}>삭제</button>
                        </>
                    )}
                </div>
                {editInputVisibility[child.id] && (
                    <div className="comment-edit-form">
                        <textarea
                            value={editCommentInputs[child.id] || ""}
                            onChange={(e) =>
                                setEditCommentInputs(prev => ({ ...prev, [child.id]: e.target.value }))
                            }
                            rows="2"
                            style={{ width: "100%", marginTop: "0.5rem" }}
                        />
                        <button onClick={() => modifyComment(child.id)} style={{ marginTop: "0.5rem" }}>수정 완료</button>
                    </div>
                )}
                {child.childrenComments && child.childrenComments.length > 0 && renderChildComments(child.childrenComments)}
            </div>
        ));
    };

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
                                    <button className="delete-button" onClick={() => {
                                        customFetch(`/api/post/${postId}`, { method: "DELETE" })
                                            .then((res) => res.json())
                                            .then((data) => {
                                                if (data.success) {
                                                    navigate('/board');
                                                } else {
                                                    console.error('게시글 삭제 실패');
                                                }
                                            })
                                            .catch((error) => console.error('삭제 오류:', error));
                                    }}>
                                        삭제
                                    </button>
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
                            post.comments.map((comment) => (
                                <div className="comment" key={comment.id}>
                                    <p>
                                        <strong>{comment.member.name}</strong>: {comment.content}
                                    </p>
                                    <div className="comment-actions">
                                        <span className="like-count">{comment.likes}</span>
                                        <button className="like-button" onClick={() => likeComment(comment.id)}>좋아요</button>
                                        {comment.member.id === myId && (
                                            <>
                                                <button className="edit-button" onClick={() => toggleEditInput(comment.id, comment.content)}>수정</button>
                                                <button className="delete-button" onClick={() => deleteComment(comment.id)}>삭제</button>
                                            </>
                                        )}
                                    </div>
                                    {editInputVisibility[comment.id] && (
                                        <div className="comment-edit-form">
                                            <textarea
                                                value={editCommentInputs[comment.id] || ""}
                                                onChange={(e) =>
                                                    setEditCommentInputs(prev => ({ ...prev, [comment.id]: e.target.value }))
                                                }
                                                rows="2"
                                                style={{ width: "100%", marginTop: "0.5rem" }}
                                            />
                                            <button onClick={() => modifyComment(comment.id)} style={{ marginTop: "0.5rem" }}>수정 완료</button>
                                        </div>
                                    )}
                                    <div className="comment-actions">
                                        {/* top-level 댓글에만 대댓글 입력창 토글 버튼 표시 */}
                                        <button className="reply-button" onClick={() => toggleChildInput(comment.id)}>대댓글 작성</button>
                                    </div>
                                    {childInputVisibility[comment.id] && (
                                        <div className="child-comment-form">
                                            <textarea
                                                value={childCommentInputs[comment.id] || ""}
                                                onChange={(e) =>
                                                    setChildCommentInputs(prev => ({ ...prev, [comment.id]: e.target.value }))
                                                }
                                                placeholder="대댓글을 입력하세요..."
                                                rows="2"
                                                style={{ width: "100%", marginTop: "0.5rem" }}
                                            />
                                            <button onClick={() => registerChildComment(comment.id)} style={{ marginTop: "0.5rem" }}>
                                                대댓글 등록
                                            </button>
                                        </div>
                                    )}
                                    {comment.childrenComments && comment.childrenComments.length > 0 && renderChildComments(comment.childrenComments)}
                                </div>
                            ))
                        ) : (
                            <p>댓글이 없습니다.</p>
                        )}
                        {/* 게시글에 대한 댓글 입력창 */}
                        <div className="comment-form">
                            <textarea
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="댓글을 입력하세요..."
                                rows="3"
                                style={{ width: "100%", marginTop: "1rem" }}
                            />
                            <button onClick={registerComment} style={{ marginTop: "0.5rem" }}>
                                댓글 등록
                            </button>
                        </div>
                    </section>
                </article>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};

export default Post;
