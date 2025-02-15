function getTotalCommentCount(comments: mock): number {
  let totalCount = 0;
  const list = [...comments];
  while (list.length > 0) {
    const current = list.pop();
    console.log(current);
    totalCount += 1;

    if (current && current.replies && current.replies.length > 0) {
      list.push(...current.replies);
    }
  }
  return totalCount;
}

// function getTotalCommentCount(comments) {
//   let total = 0;
//   const temp = [];
//   total += getTotalCommentCount(comment.replies);

//   comments.forEach((comment) => {
//     total += 1; // 현재 댓글 카운트
//     // 대댓글이 있다면 재귀적으로 호출
//     if (comment.replies && comment.replies.length > 0) {
//     }
//   });

//   return total;
// }

type mock = {
  id: number;
  replies: {
    id: number;
    replies: never[];
  }[];
}[];
const mockComments = [
  { id: 1, replies: [{ id: 2, replies: [] }] },
  { id: 3, replies: [] },
];

console.log(getTotalCommentCount(mockComments)); // 결과: 3
