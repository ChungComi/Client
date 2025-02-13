import React, { useState, useEffect } from 'react';
import '../components/ui/css/board.css';
import customFetch from "../components/ui/customFetch.jsx";
import { useNavigate } from "react-router-dom";

const Board = () => {
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchInput, setSearchInput] = useState("");
  const [searchType, setSearchType] = useState("title"); // 기본값 '제목'
  const navigate = useNavigate();

  // 특정 페이지 번호에 맞춰 게시글 데이터를 요청합니다.
  const fetchPosts = (pageNum) => {
    customFetch(`/api/post/page/${pageNum}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setPosts(data.result.data);
        } else {
          console.log('게시글이 존재하지 않습니다.');
        }
      })
      .catch((error) => console.error('Error fetching posts:', error));
  };

  // 컴포넌트가 처음 마운트될 때 총 게시글 수를 요청합니다.
  useEffect(() => {
    customFetch('/api/post')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          // 응답 구조가 data.result.data로 post 개수를 반환한다고 가정
          const postNum = data.result.data;
          const pages = Math.floor(postNum / 10) + 1;
          setTotalPages(pages);
        } else {
          console.error('총 게시글 수를 불러오지 못했습니다.');
        }
      })
      .catch((error) =>
        console.error('Error fetching total posts number:', error)
      );
  }, []);

  // currentPage가 변경될 때마다 해당 페이지의 게시글 데이터를 요청합니다.
  useEffect(() => {
    fetchPosts(currentPage);
  }, [currentPage]);

  // 페이지 링크 클릭 시 currentPage를 업데이트합니다.
  const handlePageClick = (pageNum) => (e) => {
    e.preventDefault();
    setCurrentPage(pageNum);
  };

  const handleSearch = () => {
    // 검색 옵션에 따라 엔드포인트 선택
    let endpoint = "";
    if (searchType === "title") {
      endpoint = `/api/post/title/${searchInput}`;
    } else if (searchType === "author") {
      endpoint = `/api/post/member/${searchInput}`;
    }
    if(searchInput === ""){
        alert("검색어를 입력해주세요")
    }else{
    console.log("검색 엔드포인트:", endpoint);
    customFetch(endpoint)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.success) {
          setPosts(data.result.data);
        } else {
          alert(data.result.message);
        }
      })
      .catch((error) => console.error('Error during search:', error));
      }
  };

  return (
    <div className="container">
      <h1>게시판</h1>
      <div className="board-actions">
        <button className="write-button" onClick={() => navigate("/writePost")}>
          글쓰기
        </button>
      </div>
      <div className="board">
        <table>
          <thead>
            <tr>
              <th>번호</th>
              <th>제목</th>
              <th>작성자</th>
              <th>작성일</th>
              <th>조회수</th>
            </tr>
          </thead>
          <tbody>
            {posts.length === 0 ? (
              <tr>
                <td colSpan="5">게시글이 없습니다.</td>
              </tr>
            ) : (
              posts.map((post, index) => (
                <tr key={post.id || index}>
                  <td>{index + 1}</td>
                  <td>
                    <div className="post" onClick={() => navigate(`/post/${post.id}`)}>
                      {post.title}
                    </div>
                  </td>
                  <td>{post.memberName}</td>
                  <td>
                    {post.registeredAt
                      ? post.registeredAt.slice(0, 16).replace("T", " ")
                      : ''}
                  </td>
                  <td>{post.views}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        <div className="pagination">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
            <a
              key={pageNum}
              href="#"
              className={`page-link ${currentPage === pageNum ? 'active' : ''}`}
              onClick={handlePageClick(pageNum)}
            >
              {pageNum}
            </a>
          ))}
        </div>
        <div className="search-bar">
          <select
            id="searchType"
            value={searchType}
            onChange={(e) => setSearchType(e.target.value)}
          >
            <option value="title">제목</option>
            <option value="author">작성자</option>
          </select>
          <input
            type="text"
            id="searchInput"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="검색어 입력"
          />
          <button className="search-button" onClick={() => handleSearch()}>
            검색
          </button>
        </div>
      </div>
    </div>
  );
};

export default Board;
