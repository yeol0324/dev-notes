// Challenge 3: 제네릭

// TODO: 배열에서 첫 번째 요소를 리턴하는 함수 작성
// 단, 빈 배열이면 undefined
// 힌트: function first<T>(arr: T[]): T | undefined { ... }

const nums = [1, 2, 3];
const words = ["a", "b", "c"];

function first<T>(arr: T[]): T | undefined {
  return arr[0];
}

console.log(first(nums)); // 1
console.log(first(words)); // "a"
console.log(first([])); // undefined
