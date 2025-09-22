// ======================================
// 댓글 데이터 타입을 정의합니다.
// 이 타입은 컴포넌트와 API 로직 모두에서 공유됩니다.
// ======================================
export interface Comment {
  id: string;
  author: string;
  text: string;
  status?: "pending" | "success";
}

// ======================================
// 가상의 API 호출 함수
// 이 함수는 실제 서버에 요청을 보내는 역할을 대신합니다.
// ======================================
export const createComment = (
  commentData: Omit<Comment, "id" | "status">
): Promise<Comment> => {
  return new Promise((resolve, reject) => {
    const delay = Math.random() * 2000 + 500; // 0.5초에서 2.5초 사이의 랜덤 지연
    setTimeout(() => {
      // 70% 확률로 성공하고, 30% 확률로 실패하도록 설정
      if (Math.random() > 0.3) {
        resolve({
          ...commentData,
          id: `comment-${Date.now()}`,
          status: "success",
        });
      } else {
        reject(new Error("네트워크 오류: 댓글 작성 실패"));
      }
    }, delay);
  });
};
