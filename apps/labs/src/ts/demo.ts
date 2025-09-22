import { add } from "./add";

const x: number = add(1, 2);

// 의도적 오류: 문자열을 숫자로 기대하는 함수에 전달
const y: number = add(1, "2" as unknown as number); // 이 줄이 경고/오류 포인트

console.log({ x, y });
