// @flow
import { add } from "./add.js";

const x: number = add(1, 2);

// 의도적 오류: 문자열 전달
const y: number = add(1, "2"); // Flow가 여기 오류 보고

console.log({ x, y });
