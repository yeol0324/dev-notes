// src/components/CommentSection.test.tsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";

// jest.mock은 모든 import보다 상단에 위치하는 것이 관례입니다.
// 모킹된 함수를 직접 import해서 사용할 수 있도록 jest.fn()을 제공합니다.
jest.mock("../services/api", () => ({
  createComment: jest.fn(),
}));

// mock된 모듈에서 함수를 가져옵니다.
import { createComment } from "../services/api";
import type { Comment } from "../services/api";

// ===================================
// [1] 단위 테스트 (Unit Test)
// ===================================
describe("CommentSection - Unit Tests", () => {
  // createComment를 MockedFunction으로 캐스팅하여 타입 안전성을 확보합니다.
  const mockedCreateComment = createComment as jest.MockedFunction<
    typeof createComment
  >;

  beforeEach(() => {
    mockedCreateComment.mockClear();
  });

  test("createComment 함수는 성공적으로 호출되면 올바른 댓글 객체를 반환해야 한다", async () => {
    const mockCommentData = { author: "UnitUser", text: "Unit Test Comment" };
    const mockResponse: Comment = {
      id: "999",
      ...mockCommentData,
      status: "success",
    };
    mockedCreateComment.mockResolvedValue(mockResponse);

    const result = await mockedCreateComment(mockCommentData);

    expect(mockedCreateComment).toHaveBeenCalledWith(mockCommentData);
    expect(result).toEqual(mockResponse);
  });

  test("createComment 함수가 실패하면 에러를 던져야 한다", async () => {
    const errorMessage = "API Error occurred";
    mockedCreateComment.mockRejectedValue(new Error(errorMessage));

    await expect(
      mockedCreateComment({ author: "FailUser", text: "fail" })
    ).rejects.toThrow(errorMessage);
  });
});

// ===================================
// [2] 통합 테스트 (Integration Test)
// ===================================
import { CommentSection } from "./CommentSection";
describe("CommnetSection", () => {
  render(<CommentSection />);
  const heading = screen.getByRole("heading", {
    name: "Page Not Found",
  });
  expect(heading).toBeInTheDocument();
});

describe("CommentSection - Integration Tests", () => {
  const mockedCreateComment = createComment as jest.MockedFunction<
    typeof createComment
  >;

  beforeEach(() => {
    mockedCreateComment.mockClear();
  });

  test("댓글 작성 성공 시, 낙관적 UI가 표시되었다가 최종 댓글로 업데이트되어야 한다", async () => {
    const mockResponse: Comment = {
      id: "123",
      author: "User",
      text: "새로운 댓글",
      status: "success",
    };
    mockedCreateComment.mockResolvedValue(mockResponse);
    render(<CommentSection />);

    const commentInput = screen.getByPlaceholderText("댓글을 입력하세요...");
    const submitButton = screen.getByRole("button", { name: "작성" });

    fireEvent.change(commentInput, { target: { value: "새로운 댓글" } });
    fireEvent.click(submitButton);

    expect(screen.getByText("보내는 중...")).toBeInTheDocument();

    expect(mockedCreateComment).toHaveBeenCalledWith({
      author: "User",
      text: "새로운 댓글",
    });

    await waitFor(() => {
      expect(screen.queryByText("보내는 중...")).not.toBeInTheDocument();
      expect(screen.getByText("새로운 댓글")).toBeInTheDocument();
    });
  });

  test("댓글 작성 실패 시, optimistic UI가 제거되고 오류 메시지가 표시되어야 한다", async () => {
    const errorMessage = "네트워크 에러 발생";
    mockedCreateComment.mockRejectedValue(new Error(errorMessage));

    render(<CommentSection />);

    const commentInput = screen.getByPlaceholderText("댓글을 입력하세요...");
    const submitButton = screen.getByRole("button", { name: "작성" });

    fireEvent.change(commentInput, { target: { value: "실패할 댓글" } });
    fireEvent.click(submitButton);

    expect(screen.getByText("보내는 중...")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByText("실패할 댓글")).not.toBeInTheDocument();
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });
});
