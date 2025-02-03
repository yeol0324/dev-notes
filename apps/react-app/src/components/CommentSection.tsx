import { useState, useOptimistic } from "react";

const tailwindScript = document.createElement("script");
tailwindScript.src = "https://cdn.tailwindcss.com";
document.head.appendChild(tailwindScript);

import type { Comment } from "../services/api";

// ======================================
// 가상의 API 호출 함수 (src/services/api.ts 역할)
// Promise<Comment> 타입을 반환하도록 명시합니다.
// ======================================
const createComment = (
  commentData: Omit<Comment, "id" | "status">
): Promise<Comment> => {
  return new Promise((resolve, reject) => {
    const delay = Math.random() * 2000 + 500;
    setTimeout(() => {
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

// ======================================
// CommentSection 컴포넌트 (src/components/CommentSection.tsx 역할)
// useState와 useOptimistic에 제네릭 타입을 명시합니다.
// ======================================
export function CommentSection() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [inputValue, setInputValue] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const [optimisticComments, addOptimisticComment] = useOptimistic<
    Comment[],
    Omit<Comment, "id" | "status">
  >(comments, (state, newComment) => {
    return [
      {
        ...newComment,
        id: `temp-${Date.now()}`,
        status: "pending",
      },
      ...state,
    ];
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!inputValue.trim()) {
      return;
    }

    const newCommentData = {
      author: "익명의 사용자",
      text: inputValue,
    };

    addOptimisticComment(newCommentData);
    setInputValue("");

    try {
      const finalComment = await createComment(newCommentData);
      setComments((prevComments) => [finalComment, ...prevComments]);
      console.log("댓글 작성 성공:", finalComment);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      }
      console.error("댓글 작성 실패:", err);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border-2 border-gray-100 max-w-2xl mx-auto my-10 font-sans">
      <h3 className="text-2xl font-bold mb-6 text-gray-800">댓글 목록</h3>
      <div className="space-y-4 mb-6">
        {optimisticComments.length > 0 ? (
          optimisticComments.map((comment) => (
            <div
              key={comment.id}
              className="p-4 bg-gray-50 rounded-lg transition-all duration-300 ease-in-out"
              style={{ opacity: comment.status === "pending" ? 0.6 : 1 }}
            >
              <div className="flex justify-between items-center mb-1">
                <strong className="text-sm font-semibold text-gray-700">
                  {comment.author}
                </strong>
                {comment.status === "pending" && (
                  <span className="text-xs text-blue-500 font-medium">
                    (보내는 중...)
                  </span>
                )}
              </div>
              <p className="text-gray-600 text-base">{comment.text}</p>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-400 italic">
            첫 댓글을 남겨주세요.
          </p>
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="댓글을 입력하세요..."
          className="flex-1 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl shadow-md transition-transform transform hover:scale-105"
        >
          작성
        </button>
      </form>

      {error && (
        <p className="mt-4 text-center text-red-500 font-medium">{error}</p>
      )}
    </div>
  );
}
