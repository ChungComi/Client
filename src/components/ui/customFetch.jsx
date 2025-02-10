// customFetch.js

/**
 * customFetch는 기본 fetch 함수에 JWT 토큰 자동 추가 등의 기능을 덧붙인 래퍼 함수입니다.
 * @param {string} url 요청할 URL
 * @param {object} options fetch 옵션 (method, body, 등)
 * @returns {Promise<Response>} fetch의 응답 Promise
 */
const customFetch = async (url, options = {}) => {
  // 로컬 스토리지나 다른 안전한 저장소에서 토큰을 가져옵니다.
  const token = localStorage.getItem("token");

  // 기본 헤더에 Content-Type을 추가하고, 토큰이 있다면 Authorization 헤더도 추가합니다.
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  // 옵션에 헤더를 병합하여 fetch 호출
  const response = await fetch(url, {
    ...options,
    headers,
  });

  // 필요에 따라 공통 에러 처리나 응답 파싱 로직을 추가할 수 있습니다.
  // 예를 들어, response.ok가 false일 때 오류 처리를 할 수 있습니다.
  if (!response.ok) {
    // 에러 처리 (여기서는 단순히 에러 메시지를 throw 함)
    const errorMessage = await response.text();
    throw new Error(errorMessage || "API 요청 중 오류 발생");
  }

  return response;
};

export default customFetch;