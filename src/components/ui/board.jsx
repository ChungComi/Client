import React from 'react';
import '../ui/css/board.css';

const Board = () => {
    return (
        <div className="container">
            <h1>게시판</h1>
            <div className="board-actions">
                <button className="write-button">글쓰기</button>
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
                    <tr>
                        <td>1</td>
                        <td><a href="#">첫 번째 게시글</a></td>
                        <td>관리자</td>
                        <td>2025-02-07</td>
                        <td>120</td>
                    </tr>
                    <tr>
                        <td>2</td>
                        <td><a href="#">두 번째 게시글</a></td>
                        <td>사용자1</td>
                        <td>2025-02-07</td>
                        <td>85</td>
                    </tr>
                    </tbody>
                </table>
                <div className="pagination">
                    <a href="#" className="page-link">1</a>
                    <a href="#" className="page-link">2</a>
                    <a href="#" className="page-link">3</a>
                    <a href="#" className="page-link">4</a>
                    <a href="#" className="page-link">5</a>
                </div>
                <div className="search-bar">
                    <select id="searchType">
                        <option value="title">제목</option>
                        <option value="author">작성자</option>
                    </select>
                    <input type="text" id="searchInput" placeholder="검색어 입력" />
                    <button className="search-button">검색</button>
                </div>
            </div>
        </div>
    );
};

export default Board;
